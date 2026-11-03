"""Export the live explorer's upgrade: detailed buildings as glTF and baked shadow maps per phase.

Runs inside Blender and reuses build_scene.py, but on the explorer's raw DEM (no smoothing) and under
the explorer's own sun, so the assets line up with lib/explore/engine.ts and its live lighting.

  blender -b -P tools/blender/export_explore.py -- --meshes
  blender -b -P tools/blender/export_explore.py -- --lightmap 2      (one process per phase 0..3)
Then tools/blender/build_explore_assets.py compresses everything into public/explore/upgrade.
"""
import argparse, json, math, os, struct, sys

import bpy
import numpy as np
from mathutils import Vector

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_scene as bs  # noqa: E402

WORK = os.path.join(bs.WORK, "explore")
# engine.ts places its DirectionalLight at three (-3000, 5000, -2000); in Blender that is (x, -z, y).
ENGINE_SUN = Vector((-3000, 2000, 5000)).normalized()
SITE_MARGIN_M = 250  # shadows of edge trees and buildings fall a little outside the zones
LIGHTMAP_M_PER_PX = 2.5  # the explorer paints its ground at 2 to 4 m per pixel
LIGHTMAP_GRID_M = 8  # terrain patch vertex spacing for the bake
SHADOW_STRENGTH = 0.42  # how dark a cast shadow gets; the live sun term already shades the slopes
AO_STRENGTH = 0.45
AO_DISTANCE_M = 25
BAKE_SAMPLES = 64
# Kinds whose roofs carry panels in the stills. Under the explorer's flat top light a true panel colour
# reads as a black slab, so the live model uses a lighter blue-grey that still says "solar".
SOLAR_COLOR = (0.16, 0.2, 0.27)
ROOF_GREEN = bs.lin(0x5C7A3A)[:3]
ROOF_CONCRETE = bs.lin(0xB9B6AE)[:3]
NO_WINDOWS = (0.0, 0.0, 0.0, 0.0)
NO_SILL = (0.0, 0.0)


def args():
    p = argparse.ArgumentParser()
    p.add_argument("--meshes", action="store_true")
    p.add_argument("--lightmap", type=int, default=-1)
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    return p.parse_args(argv)


def load():
    plan = json.load(open(f"{bs.SRC}/plan.json"))
    ctx = json.load(open(f"{bs.SRC}/context.json"))
    return plan, ctx, bs.Terrain(ctx, smooth=False)


def site_bounds(plan):
    pts = [q for z in plan["zones"] for p in z["polys"] for q in p["o"]]
    xs, ys = [q[0] for q in pts], [q[1] for q in pts]
    return (min(xs) - SITE_MARGIN_M, min(ys) - SITE_MARGIN_M, max(xs) + SITE_MARGIN_M, max(ys) + SITE_MARGIN_M)


def face_style(name, kind, n):
    """Vertex colour and window parameters for one face, from the material slot build_scene gave it."""
    if name.startswith("facade_"):
        fh, bay, ww, lo, hi, lobby = bs.FACADE[kind]
        return bs.lin(bs.KIND[kind])[:3], (fh, bay, ww, 1.0 if lobby else 0.0), (lo, hi)
    if name == "roof_green":
        return ROOF_GREEN, NO_WINDOWS, NO_SILL
    if name == "roof_concrete":
        solar = kind in bs.SOLAR_ROOF or (kind == "townhouse" and not n % 2)
        return (SOLAR_COLOR if solar else ROOF_CONCRETE), NO_WINDOWS, NO_SILL
    return bs.lin(bs.KIND.get(kind, 0xEEEEEE))[:3], NO_WINDOWS, NO_SILL


def phase_arrays(plan, T, k):
    """Flat-shaded triangles for every building of phase k, in three.js axes, with per-vertex style."""
    # Roof panel rows go to a throwaway builder: the live model shows solar roofs as a panel colour instead.
    B, unused, slot = bs.Builder(), bs.Builder(), bs.MaterialSlots()
    foot, owner = [], []
    for n, b in enumerate(plan["boxes"]):
        if b[7] != k:
            continue
        v0 = len(B.v)
        z0 = bs.add_building(B, unused, slot, n, b, T)
        foot += [z0] * (len(B.v) - v0)
        owner += [(b[6], n)] * (len(B.v) - v0)
    names = slot.names()
    pos, nrm, uvm, col, win, sill, ft = [], [], [], [], [], [], []
    for fi, face in enumerate(B.f):
        name = names[B.mi[fi]]
        kind, n = owner[face[0]]
        c, w, sl = face_style(name, kind, n)
        p = [Vector(B.v[i]) for i in face]
        normal = (p[1] - p[0]).cross(p[2] - p[0]).normalized()
        for tri in ((0, 1, 2), (0, 2, 3)):
            for t in tri:
                x, y, z = p[t]
                pos.append((x, z, -y))
                nrm.append((normal.x, normal.z, -normal.y))
                uvm.append(B.uv[face[t]])
                col.append(c)
                win.append(w)
                sill.append(sl)
                ft.append(foot[face[t]])
    f32 = lambda a, n: np.asarray(a, np.float32).reshape(-1, n)
    return {"POSITION": f32(pos, 3), "NORMAL": f32(nrm, 3), "COLOR_0": f32(col, 3),
            "_UVM": f32(uvm, 2), "_WIN": f32(win, 4), "_SILL": f32(sill, 2), "_FOOT": f32(ft, 1)}


def write_glb(meshes, path):
    """A minimal glTF 2.0 binary: one node and mesh per phase, non-indexed float attributes."""
    blob, views, accessors, gl_meshes, nodes = bytearray(), [], [], [], []
    kinds = {1: "SCALAR", 2: "VEC2", 3: "VEC3", 4: "VEC4"}
    for name, attrs in meshes:
        prim = {}
        for key, arr in attrs.items():
            off = len(blob)
            blob += arr.tobytes()
            blob += b"\0" * (-len(blob) % 4)
            views.append({"buffer": 0, "byteOffset": off, "byteLength": arr.nbytes, "target": 34962})
            acc = {"bufferView": len(views) - 1, "componentType": 5126, "count": len(arr), "type": kinds[arr.shape[1]]}
            if key == "POSITION":
                acc["min"], acc["max"] = arr.min(0).tolist(), arr.max(0).tolist()
            accessors.append(acc)
            prim[key] = len(accessors) - 1
        gl_meshes.append({"name": name, "primitives": [{"attributes": prim, "mode": 4}]})
        nodes.append({"name": name, "mesh": len(gl_meshes) - 1})
    doc = {"asset": {"version": "2.0", "generator": "ymfltd export_explore.py"}, "scene": 0,
           "scenes": [{"nodes": list(range(len(nodes)))}], "nodes": nodes, "meshes": gl_meshes,
           "accessors": accessors, "bufferViews": views, "buffers": [{"byteLength": len(blob)}]}
    js = json.dumps(doc, separators=(",", ":")).encode()
    js += b" " * (-len(js) % 4)
    with open(path, "wb") as fh:
        fh.write(struct.pack("<III", 0x46546C67, 2, 12 + 8 + len(js) + 8 + len(blob)))
        fh.write(struct.pack("<II", len(js), 0x4E4F534A) + js)
        fh.write(struct.pack("<II", len(blob), 0x004E4942) + bytes(blob))


def export_meshes(plan, T):
    meshes = [(f"phase{k}", phase_arrays(plan, T, k)) for k in range(4)]
    meshes = [(n, a) for n, a in meshes if len(a["POSITION"])]
    path = os.path.join(WORK, "buildings_raw.glb")
    write_glb(meshes, path)
    for n, a in meshes:
        print(n, len(a["POSITION"]) // 3, "triangles")
    print("wrote", path, os.path.getsize(path) // 1024, "KB")


def terrain_patch(T, bounds):
    """The site's terrain at bake resolution, with UVs spanning the patch from 0 to 1."""
    x0, y0, x1, y1 = bounds
    nx, ny = int((x1 - x0) / LIGHTMAP_GRID_M) + 1, int((y1 - y0) / LIGHTMAP_GRID_M) + 1
    xs, ys = np.linspace(x0, x1, nx), np.linspace(y0, y1, ny)
    gx, gy = np.meshgrid(xs, ys)
    gz = T.h(gx, gy)
    verts = np.stack([gx, gy, gz], -1).reshape(-1, 3).tolist()
    idx = np.arange(nx * ny).reshape(ny, nx)
    faces = np.stack([idx[:-1, :-1], idx[:-1, 1:], idx[1:, 1:], idx[1:, :-1]], -1).reshape(-1, 4).tolist()
    uvs = [((v[0] - x0) / (x1 - x0), (v[1] - y0) / (y1 - y0)) for f in faces for v in (verts[i] for i in f)]
    mat = bs.plain_material("bake_ground", (0.8, 0.8, 0.8, 1), 1.0)
    return bs.mesh_object("patch", verts, faces, [mat], [0] * len(faces), uvs, smooth=True)


def add_sun():
    light = bpy.data.lights.new("engine_sun", "SUN")
    light.energy = 4
    light.angle = math.radians(1.0)
    ob = bpy.data.objects.new("engine_sun", light)
    bpy.context.scene.collection.objects.link(ob)
    ob.rotation_euler = (-ENGINE_SUN).to_track_quat("-Z", "Y").to_euler()


def bake_pass(ob, kind, res):
    img = bpy.data.images.new(f"bake_{kind}", res[0], res[1], float_buffer=True)
    for slot in ob.material_slots:
        nt = slot.material.node_tree
        node = nt.nodes.new("ShaderNodeTexImage")
        node.image = img
        nt.nodes.active = node
    bpy.ops.object.select_all(action="DESELECT")
    ob.select_set(True)
    bpy.context.view_layer.objects.active = ob
    bpy.ops.object.bake(type=kind, margin=4)
    return np.array(img.pixels[:], np.float32).reshape(res[1], res[0], 4)[..., 0]


def export_lightmap(plan, ctx, T, k):
    """Bake cast shadow and ambient occlusion of everything built by phase k onto the site's ground."""
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bs.PHASE["f"] = float(k)
    mats = bs.make_materials(os.path.join(bs.WORK, "ground_2048.png"))
    bs.build_boxes(plan, T, mats)
    bs.build_cylinders(plan, T, mats)
    bs.build_arena(plan.get("arena"), T, mats)
    bs.build_trees(plan, T, bs.tree_prototypes(mats["leaf"], mats["bark"]))
    bounds = site_bounds(plan)
    patch = terrain_patch(T, bounds)
    add_sun()
    bs.setup_cycles(BAKE_SAMPLES)
    bpy.context.scene.world = bpy.data.worlds.new("bake_world")
    bpy.context.scene.world.light_settings.distance = AO_DISTANCE_M
    res = (round((bounds[2] - bounds[0]) / LIGHTMAP_M_PER_PX), round((bounds[3] - bounds[1]) / LIGHTMAP_M_PER_PX))
    shadow = bake_pass(patch, "SHADOW", res)
    ao = bake_pass(patch, "AO", res)
    lm = (1 - SHADOW_STRENGTH * (1 - np.clip(shadow, 0, 1))) * (1 - AO_STRENGTH * (1 - np.clip(ao, 0, 1)))
    out = bpy.data.images.new("lightmap", res[0], res[1])
    rgba = np.repeat(lm[..., None], 4, -1)
    rgba[..., 3] = 1
    out.pixels[:] = rgba.ravel()
    path = os.path.join(WORK, f"lightmap_{k}.png")
    out.filepath_raw = path
    out.file_format = "PNG"
    out.save()
    with open(os.path.join(WORK, "bounds.json"), "w") as fh:
        json.dump({"x0": bounds[0], "y0": bounds[1], "x1": bounds[2], "y1": bounds[3]}, fh)
    print("wrote", path, res)


def main():
    a = args()
    os.makedirs(WORK, exist_ok=True)
    plan, ctx, T = load()
    if a.meshes:
        export_meshes(plan, T)
    if a.lightmap >= 0:
        export_lightmap(plan, ctx, T, a.lightmap)


main()
