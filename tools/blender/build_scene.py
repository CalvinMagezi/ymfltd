"""Build New Kikwite Town in Blender from the PUBLIC explore data and render it in Cycles.

Uses public/explore/plan.json and context.json (the same data as /explore) plus the ground
texture from paint_ground.py. Coordinates match lib/explore/engine.ts exactly: a plan point
(x, y) at terrain height h is three.js (x, h, -y) and Blender (x, y, h). Placement and cameras
match the explorer; facades, roofs, tree shapes, bamboo, silo caps and the low golden-hour sun are
deliberately richer than its Lambert boxes, because this scene is the film-quality version.

Run from the repo root (paint the ground first):
  uv run tools/blender/paint_ground.py 8192
  blender -b -P tools/blender/build_scene.py -- --view hospital --res 1497x936 --samples 128
Views: hospital (the concept still), film (last frame of the home film), hero, or any zone id.
"""
import argparse, json, math, os, random, sys, time

import bmesh
import bpy
import numpy as np
from mathutils import Euler, Matrix, Vector

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SRC = os.path.join(ROOT, "public", "explore")
WORK = os.path.join(ROOT, "tools", "blender", ".work")

EXAG = 1.5  # vertical exaggeration used by the explorer
TERRAIN_UPSAMPLE = 4  # DEM is about 31 m per cell; 4x gives smooth slopes under the buildings
FOV_Y_DEG = 38
# The public ground is painted light for the flat-lit explorer; under a real sun it needs more body.
GROUND_SATURATION = 1.3
GROUND_VALUE = 0.82
PARAPET_INSET = 0.35
PARAPET_DROP = 0.9
SOLAR_ROW_M = 2.6
SOLAR_DEPTH_M = 1.7
SOLAR_TILT_DEG = 10
SOLAR_MARGIN_M = 1.0
SOLAR_LIFT_M = 0.35
SOLAR_MIN_SPAN_M = 2.0
PENTHOUSE_MIN_WIDTH_M = 20
PENTHOUSE_HALF = (0.16, 0.2)  # half-size as a share of the building's width and depth
PENTHOUSE_SHIFT = 0.35  # offset along the width axis, as a share of the half-width
PENTHOUSE_HEIGHT_M = 3.2
PLANT_CLEARANCE_M = 1.5
CANOPY_MIN_WIDTH_M = 80
CANOPY_HALF_DEPTH_M = 4
CANOPY_HALF_WIDTH = 0.18
CANOPY_Z_M = (4.2, 4.6)
FOOTING_M = 0.5  # boxes sink this far below the low side of the slope, as in engine.ts
LIT_WINDOW_SHARE = 0.14
LIT_WINDOW_STRENGTH = 2.5
SLAB_BAND = 0.05
SLAB_SHADE = 0.78
LOBBY_MULLION_M = 1.6
GROUND_FINE_WEIGHT = 0.14
GROUND_BROAD_WEIGHT = 0.16
GROUND_FLOOR = 0.85
GROUND_FINE_SCALE, GROUND_FINE_DETAIL = 0.35, 8  # grass-scale texture, per metre
GROUND_BROAD_SCALE, GROUND_BROAD_DETAIL = 0.012, 4  # field-scale patches, about 80 m
GROUND_BUMP = 0.25
WINDOW_MIN_V_M = 0.4  # no windows in the footing below ground level
LOBBY_FRAME = (0.05, 0.25, 0.92)  # mullion share, lobby glass sill (m) and head (share of floor)
WALL_ROUGHNESS = 0.72
GLASS = dict(color=(0.03, 0.045, 0.06, 1), rough=0.04, glow=(1.0, 0.72, 0.42, 1))
FOLIAGE_LIGHT = 0x5F8F43  # the explorer's ornamental tree green
FOLIAGE_TRANSLUCENCY = 0.22  # leaves glow a little when backlit by the low sun
SKY_ALTITUDE_M = 1100  # Hoima sits at about 1,100 m
SKY_STRENGTH = 0.22
CAMERA = dict(sensor_mm=24, clip=(5, 40000))  # clip matches the explorer's PerspectiveCamera
SOLAR_MIN_ROOF_M = 1.5
DEFAULT_KIND = "default"
# The explorer's buildArena() proportions (engine.ts:312-329), as shares of the arena radii and height.
ARENA = dict(wall_flare=1.04, wall_sink_m=6, bowl_base=0.62, bowl_r=0.97, bowl_h=0.85, bowl_lift_m=1,
             roof_in=0.72, roof_out=1.04, roof_lift_m=0.2, pitch_rx=0.58, pitch_ry=0.56, pitch_lift_m=1.4,
             segs=64, roof_segs=96, pitch_segs=48)
# Per-tree yaw from position, the same hash as the explorer (engine.ts:359) so trees face the same way.
TREE_YAW = (13, 7, 6.28)
# Camera rigs copied from shot() and film() in engine.ts:520-557, in three.js offset form.
SQ_M_PER_ACRE = 4046.86
VIEW_ZONE = dict(min_m=850, span=2.3, dir=(-0.38, 0.55, -0.74))
VIEW_FILM = dict(yaw_dir=(0.78, 0.5), yaw0=0.36, yaw_sweep=0.46, d0_m=3150, d_sweep_m=800, up0=0.54, up_sweep=0.12)
VIEW_SITE = {"hero": dict(d_m=3300, dir=(0.5, 0.38, 0.78)), "overview": dict(d_m=4200, dir=(-0.42, 0.6, -0.68))}
TREE_CROWN_R = {"ornamental": 4.2, "broad": 6.2}  # metres at plan scale 1, as engine.ts:358

KIND = {
    "hospital": 0xF4F1EC, "library": 0xC98F5A, "museum": 0xD8B48A, "commercial": 0xE7D7EF, "hotel": 0xF3E3BD,
    "villa": 0xF6EFE0, "apartment": 0xF2E8D8, "townhouse": 0xE9D3B1, "university": 0xDFE4FB, "warehouse": 0xCFD2C6,
    "barn": 0xB5532F, "processing": 0xE8E2CF, "visitor": 0xD6C3A0, "lodge": 0x8A6A45, "cabin": 0x9B7A52,
    "substation": 0xB7C0C8, "clubhouse": 0xF1EAD8, "hut": 0xC7A46A, "silo": 0xDEDFD8, "biogas": 0x8FA36A,
    "tower": 0x8A6A45, "watertower": 0xD8DDE2,
}
GREENS = [0x2F5A2C, 0x3B6B32, 0x284F27, 0x46733A, 0x335F30]
THATCH = 0x8C6A3C

# Facade rhythm per kind: floor height (m), bay width (m), window width share, sill and head as a share
# of the floor, and whether the ground floor is a glazed lobby. Kinds missing here get plain walls.
FACADE = {
    "hospital": (4.2, 3.0, 0.72, 0.28, 0.86, True),
    "university": (4.0, 3.2, 0.62, 0.25, 0.85, True),
    "commercial": (4.5, 2.0, 0.86, 0.12, 0.92, True),
    "hotel": (3.4, 3.6, 0.55, 0.22, 0.88, True),
    "library": (5.0, 2.5, 0.8, 0.1, 0.9, True),
    "museum": (5.0, 4.0, 0.45, 0.15, 0.85, True),
    "apartment": (3.1, 3.0, 0.5, 0.3, 0.82, False),
    "townhouse": (3.0, 3.4, 0.45, 0.28, 0.82, False),
    "villa": (3.2, 4.5, 0.62, 0.12, 0.9, False),
    "clubhouse": (3.6, 3.0, 0.7, 0.15, 0.9, True),
    "visitor": (3.6, 3.2, 0.6, 0.2, 0.88, True),
    "lodge": (3.2, 3.5, 0.5, 0.25, 0.85, False),
    "cabin": (3.0, 3.5, 0.45, 0.3, 0.8, False),
}
SOLAR_ROOF = {"hospital", "university", "commercial", "apartment", "warehouse", "processing", "substation"}
GREEN_ROOF = {"hotel", "villa", "library", "museum", "visitor", "clubhouse", "lodge"}
PENTHOUSE = {"hospital", "university", "commercial", "hotel"}


def args():
    p = argparse.ArgumentParser()
    p.add_argument("--view", default="hospital")
    p.add_argument("--res", default="1497x936")
    p.add_argument("--samples", type=int, default=128)
    p.add_argument("--ground", default=os.path.join(WORK, "ground_8192.png"))
    p.add_argument("--out", default="")
    p.add_argument("--sun-elev", type=float, default=11.0)
    p.add_argument("--sun-rot", type=float, default=300.0)
    p.add_argument("--save", default="", help="also save the .blend here")
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    return p.parse_args(argv)


def lin(hex_):
    def c(v):
        v /= 255
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    return (c((hex_ >> 16) & 255), c((hex_ >> 8) & 255), c(hex_ & 255), 1.0)


class Terrain:
    """Bilinear height lookup identical to hAt() in engine.ts."""

    def __init__(self, ctx):
        f = ctx["frame"]
        self.hw, self.hh = f["half_w"], f["half_h"]
        self.dem = np.array(ctx["dem"]["dm"], dtype=np.float64)
        self.n = self.dem.shape[0]
        self.base = self.dem.min() / 10

    def h(self, x, y):
        x, y = np.asarray(x, np.float64), np.asarray(y, np.float64)
        n, d = self.n, self.dem
        fx = (x + self.hw) / (2 * self.hw) * (n - 1)
        fy = (self.hh - y) / (2 * self.hh) * (n - 1)
        x0 = np.clip(np.floor(fx), 0, n - 2).astype(int)
        y0 = np.clip(np.floor(fy), 0, n - 2).astype(int)
        tx = np.clip(fx - x0, 0, 1)
        ty = np.clip(fy - y0, 0, 1)
        a, b, c, e = d[y0, x0], d[y0, x0 + 1], d[y0 + 1, x0], d[y0 + 1, x0 + 1]
        v = (a * (1 - tx) + b * tx) * (1 - ty) + (c * (1 - tx) + e * tx) * ty
        return (v / 10 - self.base) * EXAG


def link(nt, a, b):
    nt.links.new(a, b)


def math_node(nt, op, a, b=None):
    n = nt.nodes.new("ShaderNodeMath")
    n.operation = op
    for i, v in enumerate((a, b)):
        if v is None:
            continue
        if isinstance(v, (int, float)):
            n.inputs[i].default_value = v
        else:
            link(nt, v, n.inputs[i])
    return n.outputs[0]


def principled(nt, color, rough, **kw):
    p = nt.nodes.new("ShaderNodeBsdfPrincipled")
    if isinstance(color, tuple):
        p.inputs["Base Color"].default_value = color
    else:
        link(nt, color, p.inputs["Base Color"])
    p.inputs["Roughness"].default_value = rough
    for k, v in kw.items():
        p.inputs[k].default_value = v
    return p


def new_material(name):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    return m, nt, out


def plain_material(name, color, rough=0.8, **kw):
    m, nt, out = new_material(name)
    link(nt, principled(nt, color, rough, **kw).outputs[0], out.inputs[0])
    return m


def facade_material(kind):
    """Walls with windows laid out in metres from the UV map (u along the facade, v above the ground)."""
    fh, bay, ww, lo, hi, lobby = FACADE[kind]
    m, nt, out = new_material(f"facade_{kind}")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    link(nt, nt.nodes.new("ShaderNodeUVMap").outputs[0], sep.inputs[0])
    u, v = sep.outputs[0], sep.outputs[1]
    fu = math_node(nt, "FRACT", math_node(nt, "DIVIDE", u, bay))
    fy = math_node(nt, "FRACT", math_node(nt, "DIVIDE", v, fh))
    mx = math_node(nt, "MULTIPLY", math_node(nt, "GREATER_THAN", fu, (1 - ww) / 2), math_node(nt, "LESS_THAN", fu, (1 + ww) / 2))
    my = math_node(nt, "MULTIPLY", math_node(nt, "GREATER_THAN", fy, lo), math_node(nt, "LESS_THAN", fy, hi))
    mask = math_node(nt, "MULTIPLY", math_node(nt, "MULTIPLY", mx, my), math_node(nt, "GREATER_THAN", v, WINDOW_MIN_V_M))
    if lobby:
        ground = math_node(nt, "LESS_THAN", v, fh)
        mull = math_node(nt, "GREATER_THAN", math_node(nt, "FRACT", math_node(nt, "DIVIDE", u, LOBBY_MULLION_M)), LOBBY_FRAME[0])
        band = math_node(nt, "MULTIPLY", math_node(nt, "GREATER_THAN", v, LOBBY_FRAME[1]), math_node(nt, "LESS_THAN", v, fh * LOBBY_FRAME[2]))
        gmask = math_node(nt, "MULTIPLY", mull, band)
        keep = math_node(nt, "MULTIPLY", mask, math_node(nt, "SUBTRACT", 1.0, ground))
        mask = math_node(nt, "MAXIMUM", keep, math_node(nt, "MULTIPLY", gmask, ground))

    # A few warm lit rooms, picked per window so whole panes light up, not noise.
    cell = nt.nodes.new("ShaderNodeCombineXYZ")
    link(nt, math_node(nt, "FLOOR", math_node(nt, "DIVIDE", u, bay)), cell.inputs[0])
    link(nt, math_node(nt, "FLOOR", math_node(nt, "DIVIDE", v, fh)), cell.inputs[1])
    noise = nt.nodes.new("ShaderNodeTexWhiteNoise")
    noise.noise_dimensions = "3D"
    link(nt, cell.outputs[0], noise.inputs["Vector"])
    lit = math_node(nt, "GREATER_THAN", noise.outputs["Value"], 1 - LIT_WINDOW_SHARE)

    base = lin(KIND[kind])
    slab = math_node(nt, "LESS_THAN", fy, SLAB_BAND)
    wallcol = nt.nodes.new("ShaderNodeMix")
    wallcol.data_type = "RGBA"
    link(nt, slab, wallcol.inputs["Factor"])
    wallcol.inputs[6].default_value = base
    wallcol.inputs[7].default_value = tuple(c * SLAB_SHADE for c in base[:3]) + (1,)
    wall = principled(nt, wallcol.outputs[2], WALL_ROUGHNESS)
    glass = principled(nt, GLASS["color"], GLASS["rough"], **{"Specular IOR Level": 1.0})
    glass.inputs["Emission Color"].default_value = GLASS["glow"]
    link(nt, math_node(nt, "MULTIPLY", lit, LIT_WINDOW_STRENGTH), glass.inputs["Emission Strength"])
    mix = nt.nodes.new("ShaderNodeMixShader")
    link(nt, mask, mix.inputs[0])
    link(nt, wall.outputs[0], mix.inputs[1])
    link(nt, glass.outputs[0], mix.inputs[2])
    link(nt, mix.outputs[0], out.inputs[0])
    return m


def ground_material(path):
    m, nt, out = new_material("ground")
    tex = nt.nodes.new("ShaderNodeTexImage")
    tex.image = bpy.data.images.load(path)
    tex.interpolation = "Cubic"
    coord = nt.nodes.new("ShaderNodeTexCoord")
    fine = nt.nodes.new("ShaderNodeTexNoise")
    fine.inputs["Scale"].default_value = GROUND_FINE_SCALE
    fine.inputs["Detail"].default_value = GROUND_FINE_DETAIL
    link(nt, coord.outputs["Object"], fine.inputs["Vector"])
    broad = nt.nodes.new("ShaderNodeTexNoise")
    broad.inputs["Scale"].default_value = GROUND_BROAD_SCALE
    broad.inputs["Detail"].default_value = GROUND_BROAD_DETAIL
    link(nt, coord.outputs["Object"], broad.inputs["Vector"])
    # Brightness varies by about 10 per cent at grass and field scale so the soft public ground reads as land.
    var = math_node(nt, "ADD", math_node(nt, "MULTIPLY", fine.outputs["Fac"], GROUND_FINE_WEIGHT), math_node(nt, "MULTIPLY", broad.outputs["Fac"], GROUND_BROAD_WEIGHT))
    var = math_node(nt, "ADD", var, GROUND_FLOOR)
    col = nt.nodes.new("ShaderNodeMix")
    col.data_type = "RGBA"
    col.blend_type = "MULTIPLY"
    col.inputs["Factor"].default_value = 1
    hsv = nt.nodes.new("ShaderNodeHueSaturation")
    hsv.inputs["Saturation"].default_value = GROUND_SATURATION
    hsv.inputs["Value"].default_value = GROUND_VALUE
    link(nt, tex.outputs["Color"], hsv.inputs["Color"])
    link(nt, hsv.outputs[0], col.inputs[6])
    gray = nt.nodes.new("ShaderNodeCombineXYZ")
    for i in range(3):
        link(nt, var, gray.inputs[i])
    link(nt, gray.outputs[0], col.inputs[7])
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = GROUND_BUMP
    link(nt, fine.outputs["Fac"], bump.inputs["Height"])
    p = principled(nt, col.outputs[2], 0.95)
    link(nt, bump.outputs[0], p.inputs["Normal"])
    link(nt, p.outputs[0], out.inputs[0])
    return m


def foliage_material():
    m, nt, out = new_material("foliage")
    info = nt.nodes.new("ShaderNodeObjectInfo")
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    els = ramp.color_ramp.elements
    els[0].color = lin(GREENS[2])
    els[1].color = lin(FOLIAGE_LIGHT)
    mids = [GREENS[0], GREENS[1], GREENS[3]]
    for i, g in enumerate(mids):
        e = els.new((i + 1) / (len(mids) + 1))
        e.color = lin(g)
    link(nt, info.outputs["Random"], ramp.inputs[0])
    leaf = principled(nt, ramp.outputs[0], 0.7)
    trans = nt.nodes.new("ShaderNodeBsdfTranslucent")
    link(nt, ramp.outputs[0], trans.inputs[0])
    mix = nt.nodes.new("ShaderNodeMixShader")
    mix.inputs[0].default_value = FOLIAGE_TRANSLUCENCY
    link(nt, leaf.outputs[0], mix.inputs[1])
    link(nt, trans.outputs[0], mix.inputs[2])
    link(nt, mix.outputs[0], out.inputs[0])
    return m


def mesh_object(name, verts, faces, mats, face_mats, uvs=None, smooth=False):
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts, [], faces)
    for mat in mats:
        me.materials.append(mat)
    me.polygons.foreach_set("material_index", face_mats)
    if uvs is not None:
        layer = me.uv_layers.new(name="UVMap")
        layer.data.foreach_set("uv", [c for uv in uvs for c in uv])
    if smooth:
        me.polygons.foreach_set("use_smooth", [True] * len(faces))
    me.update()
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    return ob


def build_terrain(T, mat):
    m = (T.n - 1) * TERRAIN_UPSAMPLE + 1
    xs = np.linspace(-T.hw, T.hw, m)
    ys = np.linspace(T.hh, -T.hh, m)
    gx, gy = np.meshgrid(xs, ys)
    gz = T.h(gx, gy)
    me = bpy.data.meshes.new("terrain")
    me.vertices.add(m * m)
    me.vertices.foreach_set("co", np.stack([gx, gy, gz], -1).astype(np.float32).ravel())
    i = np.arange(m * m).reshape(m, m)
    quads = np.stack([i[:-1, :-1], i[1:, :-1], i[1:, 1:], i[:-1, 1:]], -1).reshape(-1, 4)
    nf = len(quads)
    me.loops.add(nf * 4)
    me.loops.foreach_set("vertex_index", quads.astype(np.int32).ravel())
    me.polygons.add(nf)
    me.polygons.foreach_set("loop_start", (np.arange(nf) * 4).astype(np.int32))
    me.polygons.foreach_set("use_smooth", np.ones(nf, bool))
    uv = np.stack([(gx + T.hw) / (2 * T.hw), (gy + T.hh) / (2 * T.hh)], -1).reshape(-1, 2)
    me.uv_layers.new(name="UVMap").data.foreach_set("uv", uv[quads.ravel()].astype(np.float32).ravel())
    me.update(calc_edges=True)
    me.validate()
    me.materials.append(mat)
    ob = bpy.data.objects.new("terrain", me)
    bpy.context.scene.collection.objects.link(ob)


class Builder:
    """Collects quads for one joined mesh with per-face materials and metre UVs."""

    def __init__(self):
        self.v, self.f, self.uv, self.mi = [], [], [], []

    def quad(self, pts, uvs, mat):
        base = len(self.v)
        self.v.extend(pts)
        self.f.append(tuple(range(base, base + len(pts))))
        self.uv.extend(uvs)
        self.mi.append(mat)

    def box(self, c, ax, ay, hx, hy, z0, z1, side_mat, top_mat):
        ring = rect(c, ax, ay, hx, hy)
        self.walls(ring, z0, z1, z0, side_mat)
        self.quad([(p.x, p.y, z1) for p in ring], [(0, 0)] * 4, top_mat)

    def walls(self, ring, z0, z1, zg, mat):
        s = 0.0
        for i in range(4):
            a, b = ring[i], ring[(i + 1) % 4]
            ln = (b - a).length
            self.quad([(a.x, a.y, z0), (b.x, b.y, z0), (b.x, b.y, z1), (a.x, a.y, z1)],
                      [(s, z0 - zg), (s + ln, z0 - zg), (s + ln, z1 - zg), (s, z1 - zg)], mat)
            s += ln


def plain_key(kind):
    return f"plain_{kind if kind in KIND else DEFAULT_KIND}"


def axes(rot):
    return Vector((math.cos(rot), math.sin(rot))), Vector((-math.sin(rot), math.cos(rot)))


def rect(c, ax, ay, hx, hy):
    return [c - ax * hx - ay * hy, c + ax * hx - ay * hy, c + ax * hx + ay * hy, c - ax * hx + ay * hy]


class MaterialSlots:
    """Assigns a slot index to each material name in first-use order for the joined buildings mesh."""

    def __init__(self):
        self.idx = {}

    def __call__(self, name):
        return self.idx.setdefault(name, len(self.idx))

    def names(self):
        return sorted(self.idx, key=self.idx.get)


def add_building(B, solar, slot, n, b, T):
    """One plan box: walls with windows, parapet, roof finish, and plant room, panels or canopy by kind."""
    x, y, w, d, hgt, rot, kind = b[:7]
    h0 = float(T.h(x, y))
    slope = max(abs(float(T.h(x + w / 2, y)) - h0), abs(float(T.h(x, y + d / 2)) - h0))
    zt = h0 + hgt
    ax, ay = axes(rot)
    c = Vector((x, y))
    hx, hy = w / 2, d / 2
    outer = rect(c, ax, ay, hx, hy)
    trim = slot(plain_key(kind))
    B.walls(outer, h0 - slope - FOOTING_M, zt, h0, slot(f"facade_{kind}" if kind in FACADE else plain_key(kind)))
    ix, iy = hx - PARAPET_INSET, hy - PARAPET_INSET
    inner = rect(c, ax, ay, ix, iy)
    zr = zt - PARAPET_DROP
    for i in range(4):
        a, a2, ia, ib = outer[i], outer[(i + 1) % 4], inner[i], inner[(i + 1) % 4]
        B.quad([(a.x, a.y, zt), (a2.x, a2.y, zt), (ib.x, ib.y, zt), (ia.x, ia.y, zt)], [(0, 0)] * 4, trim)
    B.walls(list(reversed(inner)), zr, zt, zr, trim)
    # Townhouses alternate solar and green roofs so the estate does not read as one repeated block.
    green = kind in GREEN_ROOF or (kind == "townhouse" and n % 2)
    B.quad([(p.x, p.y, zr) for p in inner], [(0, 0)] * 4, slot("roof_green" if green else "roof_concrete"))

    keep_out = None
    if kind in PENTHOUSE and w > PENTHOUSE_MIN_WIDTH_M:
        px_, py_ = w * PENTHOUSE_HALF[0], d * PENTHOUSE_HALF[1]
        pc = c + ax * (hx * PENTHOUSE_SHIFT)
        B.box(pc, ax, ay, px_, py_, zr, zt + PENTHOUSE_HEIGHT_M, trim, slot("roof_concrete"))
        keep_out = (pc, px_ + PLANT_CLEARANCE_M, py_ + PLANT_CLEARANCE_M)
    if kind in SOLAR_ROOF or (kind == "townhouse" and not green):
        add_solar(solar, c, ax, ay, ix - SOLAR_MARGIN_M, iy - SOLAR_MARGIN_M, zr + SOLAR_LIFT_M, keep_out)
    if kind == "hospital" and w > CANOPY_MIN_WIDTH_M:
        cc = c - ay * (hy + CANOPY_HALF_DEPTH_M)
        B.box(cc, ax, ay, w * CANOPY_HALF_WIDTH, CANOPY_HALF_DEPTH_M, h0 + CANOPY_Z_M[0], h0 + CANOPY_Z_M[1], trim, trim)


def build_boxes(plan, T, mats):
    """Every plan box becomes a building in one joined mesh; roof panels go in a second mesh."""
    B, solar, slot = Builder(), Builder(), MaterialSlots()
    for n, b in enumerate(plan["boxes"]):
        add_building(B, solar, slot, n, b, T)
    ob = mesh_object("buildings", B.v, B.f, [mats[k] for k in slot.names()], B.mi, B.uv)
    if solar.f:
        mesh_object("solar", solar.v, solar.f, [mats["solar"]], solar.mi, solar.uv)
    return ob


def add_solar(S, c, ax, ay, hx, hy, z, keep_out):
    """Rows of tilted panels along the building's depth axis, skipping any plant room."""
    if hx < SOLAR_MIN_ROOF_M or hy < SOLAR_MIN_ROOF_M:
        return
    tilt = math.tan(math.radians(SOLAR_TILT_DEG)) * SOLAR_DEPTH_M
    yy = -hy
    while yy + SOLAR_DEPTH_M <= hy:
        mid = c + ay * (yy + SOLAR_DEPTH_M / 2)
        spans = [(-hx, hx)]
        if keep_out and abs((mid - keep_out[0]).dot(ay)) < keep_out[2]:
            off = (keep_out[0] - c).dot(ax)
            spans = [(-hx, off - keep_out[1]), (off + keep_out[1], hx)]
        for s0, s1 in spans:
            if s1 - s0 < SOLAR_MIN_SPAN_M:
                continue
            p0, p1 = c + ax * s0 + ay * yy, c + ax * s1 + ay * yy
            q0, q1 = p0 + ay * SOLAR_DEPTH_M, p1 + ay * SOLAR_DEPTH_M
            S.quad([(p0.x, p0.y, z), (p1.x, p1.y, z), (q1.x, q1.y, z + tilt), (q0.x, q0.y, z + tilt)], [(0, 0)] * 4, 0)
        yy += SOLAR_ROW_M


def bm_object(name, bm, mat, loc=(0, 0, 0), rot=0.0, smooth=True):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    if smooth:
        me.polygons.foreach_set("use_smooth", [True] * len(me.polygons))
    me.materials.append(mat)
    ob = bpy.data.objects.new(name, me)
    ob.location = loc
    ob.rotation_euler = (0, 0, rot)
    bpy.context.scene.collection.objects.link(ob)
    return ob


def cone(bm, r1, r2, depth, z, segs=24, caps=True, sx=1.0, sy=1.0):
    geom = bmesh.ops.create_cone(bm, cap_ends=caps, segments=segs, radius1=r1, radius2=r2, depth=depth)
    bmesh.ops.transform(bm, matrix=Matrix.Translation((0, 0, z + depth / 2)) @ Matrix.Diagonal((sx, sy, 1, 1)), verts=geom["verts"])


def build_cylinders(plan, T, mats):
    for i, c in enumerate(plan["cyl"]):
        x, y, r, h, kind, _, typ = c
        g = float(T.h(x, y))
        bm = bmesh.new()
        if typ == 2:
            geom = bmesh.ops.create_uvsphere(bm, u_segments=24, v_segments=12, radius=1)
            for v in geom["verts"]:
                v.co.z = max(v.co.z, 0)
                v.co = Vector((v.co.x * r, v.co.y * r, v.co.z * h))
        else:
            cone(bm, r, r, h + 0.5, -0.5)
        # Domes are always biogas digesters in the explorer, whatever kind the plan gives them.
        bm_object(f"cyl{i}", bm, mats[plain_key("biogas" if typ == 2 else kind)], (x, y, g))
        if typ == 1:
            bm = bmesh.new()
            cone(bm, r * 1.25, 0, r * 0.9, h)
            bm_object(f"roof{i}", bm, mats["thatch"], (x, y, g))
        elif kind == "silo":
            bm = bmesh.new()
            geom = bmesh.ops.create_uvsphere(bm, u_segments=24, v_segments=8, radius=r)
            for v in geom["verts"]:
                v.co.z = max(v.co.z, 0) * 0.5 + h
            bm_object(f"cap{i}", bm, mats[plain_key(kind)], (x, y, g))


def build_arena(a, T, mats):
    if not a:
        return
    A = ARENA
    loc, rot = (a["x"], a["y"], float(T.h(a["x"], a["y"]))), a["a"]
    rx, ry, h = a["rx"], a["ry"], a["h"]
    bm = bmesh.new()
    cone(bm, A["wall_flare"], 1.0, 1, 0, A["segs"], False)
    bmesh.ops.scale(bm, vec=(rx, ry, h + A["wall_sink_m"]), verts=bm.verts)
    bmesh.ops.translate(bm, vec=(0, 0, -A["wall_sink_m"]), verts=bm.verts)
    bm_object("arena_wall", bm, mats["arena_wall"], loc, rot)
    bm = bmesh.new()
    cone(bm, A["bowl_base"], 1.0, 1, 0, A["segs"], False)
    bmesh.ops.scale(bm, vec=(rx * A["bowl_r"], ry * A["bowl_r"], h * A["bowl_h"]), verts=bm.verts)
    bmesh.ops.translate(bm, vec=(0, 0, A["bowl_lift_m"]), verts=bm.verts)
    bm_object("arena_seats", bm, mats["arena_seats"], loc, rot)
    bm = bmesh.new()
    angles = np.linspace(0, 2 * math.pi, A["roof_segs"], endpoint=False)
    z = h + A["roof_lift_m"]
    outer = [bm.verts.new((math.cos(t) * A["roof_out"] * rx, math.sin(t) * A["roof_out"] * ry, z)) for t in angles]
    inner = [bm.verts.new((math.cos(t) * A["roof_in"] * rx, math.sin(t) * A["roof_in"] * ry, z)) for t in angles]
    for i in range(len(angles)):
        j = (i + 1) % len(angles)
        bm.faces.new((outer[i], outer[j], inner[j], inner[i]))
    bm_object("arena_roof", bm, mats["arena_wall"], loc, rot)
    bm = bmesh.new()
    bmesh.ops.create_circle(bm, cap_ends=True, segments=A["pitch_segs"], radius=1)
    bmesh.ops.scale(bm, vec=(rx * A["pitch_rx"], ry * A["pitch_ry"], 1), verts=bm.verts)
    bmesh.ops.translate(bm, vec=(0, 0, A["pitch_lift_m"]), verts=bm.verts)
    bm_object("arena_pitch", bm, mats["pitch"], loc, rot)


def tree_prototypes(leaf, bark):
    """Unit-sized trees (crown radius 1) that the plan scales per tree, as the explorer does."""
    rng = random.Random(3)
    protos = {}

    def crown(bm, blobs, flat=1.0):
        for cx, cy, cz, cr in blobs:
            g = bmesh.ops.create_icosphere(bm, subdivisions=2, radius=cr)
            for v in g["verts"]:
                j = 1 + rng.uniform(-0.12, 0.12)
                v.co = Vector((v.co.x * j + cx, v.co.y * j + cy, v.co.z * j * flat + cz))

    for k in range(3):
        bm = bmesh.new()
        blobs = [(0, 0, 1.3, 0.75)] + [(rng.uniform(-0.45, 0.45), rng.uniform(-0.45, 0.45), rng.uniform(1.1, 1.6), rng.uniform(0.45, 0.6)) for _ in range(4)]
        crown(bm, blobs)
        n_leaf = len(bm.faces)
        cone(bm, 0.07, 0.05, 1.1, 0, 8)
        protos[f"broad{k}"] = (bm, n_leaf)
    bm = bmesh.new()
    crown(bm, [(0, 0, 1.25, 1.0), (0.5, 0.2, 1.2, 0.6), (-0.4, -0.3, 1.25, 0.6)], flat=0.45)
    n_leaf = len(bm.faces)
    cone(bm, 0.06, 0.04, 1.1, 0, 8)
    protos["ornamental"] = (bm, n_leaf)
    bm = bmesh.new()
    for _ in range(7):
        g = bmesh.ops.create_cone(bm, cap_ends=False, segments=6, radius1=0.5, radius2=0.0, depth=1)
        off = Vector((rng.uniform(-1.6, 1.6), rng.uniform(-1.6, 1.6), 0))
        lean = Euler((rng.uniform(-0.12, 0.12), rng.uniform(-0.12, 0.12), 0)).to_matrix().to_4x4()
        s = rng.uniform(0.75, 1.0)
        bmesh.ops.transform(bm, matrix=Matrix.Translation(off) @ lean @ Matrix.Diagonal((s, s, 11 * s, 1)) @ Matrix.Translation((0, 0, 0.5)), verts=g["verts"])
    protos["bamboo"] = (bm, len(bm.faces))

    meshes = {}
    for name, (bm, n_leaf) in protos.items():
        me = bpy.data.meshes.new(f"tree_{name}")
        bm.to_mesh(me)
        bm.free()
        me.materials.append(leaf)
        me.materials.append(bark)
        me.polygons.foreach_set("material_index", [0] * n_leaf + [1] * (len(me.polygons) - n_leaf))
        me.polygons.foreach_set("use_smooth", [True] * len(me.polygons))
        meshes[name] = me
    return meshes


def build_trees(plan, T, protos):
    col = bpy.data.collections.new("trees")
    bpy.context.scene.collection.children.link(col)
    for i, t in enumerate(plan["trees"]):
        x, y, s, typ = t[0], t[1], t[2], t[3]
        if typ == 1:
            me, r = protos["bamboo"], s
        elif typ == 2:
            me, r = protos["ornamental"], TREE_CROWN_R["ornamental"] * s
        else:
            me, r = protos[f"broad{i % 3}"], TREE_CROWN_R["broad"] * s
        ob = bpy.data.objects.new(f"t{i}", me)
        ob.location = (x, y, float(T.h(x, y)))
        ob.rotation_euler = (0, 0, (x * TREE_YAW[0] + y * TREE_YAW[1]) % TREE_YAW[2])
        ob.scale = (r, r, r)
        col.objects.link(ob)


def make_materials(ground_path):
    mats = {f"facade_{k}": facade_material(k) for k in FACADE}
    for k, hx in KIND.items():
        mats[f"plain_{k}"] = plain_material(f"plain_{k}", lin(hx), 0.75)
    # Unknown kinds fall back to the explorer's light grey (engine.ts:340) instead of failing the build.
    mats[f"plain_{DEFAULT_KIND}"] = plain_material("plain_default", lin(0xEEEEEE), 0.75)
    mats["roof_concrete"] = plain_material("roof_concrete", lin(0xB9B6AE), 0.9)
    mats["roof_green"] = plain_material("roof_green", lin(0x5C7A3A), 0.95)
    mats["solar"] = plain_material("solar", (0.012, 0.02, 0.045, 1), 0.12, **{"Specular IOR Level": 0.9})
    mats["thatch"] = plain_material("thatch", lin(THATCH), 0.95)
    mats["arena_wall"] = plain_material("arena_wall", lin(0xF0ECE4), 0.6)
    mats["arena_seats"] = plain_material("arena_seats", lin(0xE0773A), 0.7)
    mats["pitch"] = plain_material("pitch", lin(0x5EA64A), 0.9)
    mats["leaf"] = foliage_material()
    mats["bark"] = plain_material("bark", lin(0x4A3B2A), 0.9)
    mats["ground"] = ground_material(ground_path)
    return mats


def world(elev, rot):
    w = bpy.data.worlds.new("sky")
    bpy.context.scene.world = w
    w.use_nodes = True
    nt = w.node_tree
    nt.nodes.clear()
    sky = nt.nodes.new("ShaderNodeTexSky")
    for t in ("MULTIPLE_SCATTERING", "NISHITA", "SINGLE_SCATTERING"):
        try:
            sky.sky_type = t
            break
        except TypeError:
            continue
    sky.sun_elevation = math.radians(elev)
    sky.sun_rotation = math.radians(rot)
    sky.altitude = SKY_ALTITUDE_M
    bg = nt.nodes.new("ShaderNodeBackground")
    bg.inputs["Strength"].default_value = SKY_STRENGTH
    out = nt.nodes.new("ShaderNodeOutputWorld")
    link(nt, sky.outputs[0], bg.inputs[0])
    link(nt, bg.outputs[0], out.inputs[0])
    print("sky type", sky.sky_type)


def camera_for(view, plan, T):
    """The explorer's named views, converted from three.js offsets (dx, dy, dz) to Blender (dx, -dz, dy)."""
    zones = plan["zones"]
    pts = [q for z in zones for p in z["polys"] for q in p["o"]]
    mx = (min(q[0] for q in pts) + max(q[0] for q in pts)) / 2
    my = (min(q[1] for q in pts) + max(q[1] for q in pts)) / 2
    z = next((zz for zz in zones if zz["id"] == view), None)
    if z:
        V = VIEW_ZONE
        tx, ty = z["label"]
        d = max(V["min_m"], math.sqrt(z["acres"] * SQ_M_PER_ACRE) * V["span"])
        off = tuple(k * d for k in V["dir"])
    elif view == "film":
        # film(f, a) at its last frame: a = 1, so the eased camera sits at the end of its arc.
        F, e = VIEW_FILM, 1.0
        tx, ty = mx, my
        yaw = math.atan2(*F["yaw_dir"]) + F["yaw0"] - F["yaw_sweep"] * e
        d, up = F["d0_m"] - F["d_sweep_m"] * e, F["up0"] - F["up_sweep"] * e
        off = (math.cos(yaw) * d, up * d, math.sin(yaw) * d)
    else:
        V = VIEW_SITE.get(view, VIEW_SITE["overview"])
        tx, ty = mx, my
        off = tuple(k * V["d_m"] for k in V["dir"])
    t = Vector((tx, ty, float(T.h(tx, ty))))
    p = t + Vector((off[0], -off[2], off[1]))
    return t, p


def setup_camera(t, p, w, h):
    cam = bpy.data.cameras.new("cam")
    cam.sensor_fit = "VERTICAL"
    cam.sensor_height = CAMERA["sensor_mm"]
    cam.lens = CAMERA["sensor_mm"] / 2 / math.tan(math.radians(FOV_Y_DEG / 2))
    cam.clip_start, cam.clip_end = CAMERA["clip"]
    ob = bpy.data.objects.new("cam", cam)
    bpy.context.scene.collection.objects.link(ob)
    ob.location = p
    ob.rotation_euler = (t - p).to_track_quat("-Z", "Y").to_euler()
    bpy.context.scene.camera = ob
    r = bpy.context.scene.render
    r.resolution_x, r.resolution_y, r.resolution_percentage = w, h, 100


def setup_cycles(samples):
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    prefs = bpy.context.preferences.addons["cycles"].preferences
    prefs.compute_device_type = "METAL"
    prefs.get_devices()
    gpus = [d for d in prefs.devices if d.type == "METAL"]
    if not gpus:
        sys.exit("No Metal GPU found; refusing to fall back to CPU silently")
    for d in prefs.devices:
        d.use = d.type == "METAL"
    sc.cycles.device = "GPU"
    sc.cycles.samples = samples
    sc.cycles.use_denoising = True
    sc.cycles.denoiser = "OPENIMAGEDENOISE"
    sc.render.use_persistent_data = True
    sc.view_settings.view_transform = "AgX"
    try:
        sc.view_settings.look = "AgX - Medium High Contrast"
    except TypeError:
        print("WARNING: AgX contrast look missing, rendering with the default look")
    sc.render.image_settings.file_format = "PNG"
    print("devices", [d.name for d in gpus])


def main():
    a = args()
    t0 = time.time()
    bpy.ops.wm.read_factory_settings(use_empty=True)
    plan = json.load(open(f"{SRC}/plan.json"))
    ctx = json.load(open(f"{SRC}/context.json"))
    T = Terrain(ctx)
    mats = make_materials(a.ground)
    build_terrain(T, mats["ground"])
    build_boxes(plan, T, mats)
    build_cylinders(plan, T, mats)
    build_arena(plan.get("arena"), T, mats)
    build_trees(plan, T, tree_prototypes(mats["leaf"], mats["bark"]))
    world(a.sun_elev, a.sun_rot)
    w, h = (int(v) for v in a.res.split("x"))
    setup_camera(*camera_for(a.view, plan, T), w, h)
    setup_cycles(a.samples)
    print(f"built in {time.time() - t0:.1f}s")
    if a.save:
        bpy.ops.wm.save_as_mainfile(filepath=a.save)
    out = a.out or os.path.join(WORK, "renders", f"{a.view}_{w}x{h}_{a.samples}.png")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    bpy.context.scene.render.filepath = out
    t1 = time.time()
    bpy.ops.render.render(write_still=True)
    print(f"RENDER {a.view} {w}x{h} {a.samples}spp {time.time() - t1:.1f}s -> {out}")


main()
