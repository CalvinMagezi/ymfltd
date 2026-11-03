"""Render a Gaussian-splat training set of one district from the Blender scene.

Writes nerfstudio-format images, transforms.json, a starting point cloud for Brush and capture.json:
  blender -b -P tools/blender/render_splat_dataset.py -- --zone hospital [--views-scale 0.7] [--samples 32]
tools/blender/build_district_splats.py runs this, Brush and the transcoder for every district.
Scene units are metres divided by SCENE_SCALE, so a capture sits in a box a few units across.
"""
import argparse, json, math, os, sys

import bpy
import numpy as np
from mathutils import Vector

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_scene as bs  # noqa: E402

SCENE_SCALE = 100.0  # metres per scene unit
RES = (960, 540)
FOV_Y_DEG = 38  # the explorer's camera
SUN_ELEV_DEG = 22  # baked into the splat; higher than the stills so shadows do not swallow streets
# A district's capture radius is half its larger span, kept between these so small zones still get
# context and the forest does not need hundreds of views.
RADIUS_MIN_M, RADIUS_MAX_M = 250, 900
# Orbit rings as multiples of that radius: distance, camera elevation (deg) and views per ring.
RINGS = [(1.5, 32, 28), (2.3, 40, 32), (3.2, 52, 32), (4.2, 64, 20)]
TOP_VIEWS = 6
TOP_HEIGHT = 5.0  # top views sit this many radii above the focus
# The close-up opens like the explorer's zone views: three.js offset direction and distance in radii.
VIEW_DIR = (-0.38, 0.55, -0.74)
VIEW_DIST = 3.0
INIT_GRID_M = 12  # finest ground point spacing for the starting cloud
# Brush's --max-splats only limits growth, so the starting cloud must stay well under the 100k budget.
INIT_MAX_POINTS = 30000


def args():
    p = argparse.ArgumentParser()
    p.add_argument("--zone", default="hospital")
    p.add_argument("--samples", type=int, default=32)
    p.add_argument("--views-scale", type=float, default=0.7, help="multiply views per ring")
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    return p.parse_args(argv)


def build(plan, T):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    ground = os.path.join(bs.WORK, "ground_8192.png")
    mats = bs.make_materials(ground)
    bs.build_terrain(T, mats["ground"])
    bs.build_boxes(plan, T, mats)
    bs.build_cylinders(plan, T, mats)
    bs.build_arena(plan.get("arena"), T, mats)
    bs.build_trees(plan, T, bs.tree_prototypes(mats["leaf"], mats["bark"]))
    bs.world(SUN_ELEV_DEG, 300.0)
    bs.setup_cycles(1)
    sc = bpy.context.scene
    sc.render.film_transparent = True  # Brush learns the alpha, so no sky gets baked into splats
    sc.render.image_settings.color_mode = "RGBA"
    sc.render.resolution_x, sc.render.resolution_y = RES


def zone_radius(z):
    pts = [q for p in z["polys"] for q in p["o"]]
    span = max(max(q[0] for q in pts) - min(q[0] for q in pts), max(q[1] for q in pts) - min(q[1] for q in pts))
    return min(RADIUS_MAX_M, max(RADIUS_MIN_M, span / 2))


def camera_poses(focus, radius, views_scale):
    poses = []
    for ring, (mult, elev, n) in enumerate(RINGS):
        n = max(4, round(n * views_scale))
        for k in range(n):
            az = 2 * math.pi * (k + 0.5 * (ring % 2)) / n  # alternate rings are offset half a step
            e = math.radians(elev)
            poses.append(focus + Vector((math.cos(az) * math.cos(e), math.sin(az) * math.cos(e), math.sin(e))) * radius * mult)
    for k in range(TOP_VIEWS):
        az = 2 * math.pi * k / TOP_VIEWS
        poses.append(focus + Vector((math.cos(az) * radius * 0.2, math.sin(az) * radius * 0.2, radius * TOP_HEIGHT)))
    return poses


def init_points(T, focus, radius, img):
    """Ground points around the district, coloured from the painted ground texture."""
    r = radius * 2.5
    step = max(INIT_GRID_M, 2 * r / math.sqrt(INIT_MAX_POINTS))
    xs = np.arange(focus.x - r, focus.x + r, step)
    ys = np.arange(focus.y - r, focus.y + r, step)
    gx, gy = np.meshgrid(xs, ys)
    gx, gy = gx.ravel(), gy.ravel()
    gz = T.h(gx, gy)
    w, h = img.size
    px = np.asarray(img.pixels[:], np.float32).reshape(h, w, 4)
    u = np.clip(((gx + T.hw) / (2 * T.hw) * (w - 1)).astype(int), 0, w - 1)
    v = np.clip(((gy + T.hh) / (2 * T.hh) * (h - 1)).astype(int), 0, h - 1)
    col = px[v, u, :3]
    pts = np.stack([gx, gy, gz], -1)
    return pts / SCENE_SCALE, np.clip(col, 0, 1)


def write_ply(path, pts, col):
    with open(path, "wb") as fh:
        fh.write(f"ply\nformat binary_little_endian 1.0\nelement vertex {len(pts)}\n"
                 "property float x\nproperty float y\nproperty float z\n"
                 "property uchar red\nproperty uchar green\nproperty uchar blue\nend_header\n".encode())
        rec = np.zeros(len(pts), dtype=[("p", "<f4", 3), ("c", "u1", 3)])
        rec["p"], rec["c"] = pts, (col * 255).round().astype(np.uint8)
        fh.write(rec.tobytes())


def main():
    a = args()
    out = os.path.join(bs.WORK, "splat", a.zone)
    os.makedirs(os.path.join(out, "images"), exist_ok=True)
    plan = json.load(open(f"{bs.SRC}/plan.json"))
    ctx = json.load(open(f"{bs.SRC}/context.json"))
    T = bs.Terrain(ctx)
    build(plan, T)
    sc = bpy.context.scene
    sc.cycles.samples = a.samples
    z = next(z for z in plan["zones"] if z["id"] == a.zone)
    focus = Vector((z["label"][0], z["label"][1], float(T.h(*z["label"]))))
    radius = zone_radius(z)
    cam_data = bpy.data.cameras.new("cam")
    cam_data.sensor_fit = "VERTICAL"
    cam_data.sensor_height = 24
    cam_data.lens = 12 / math.tan(math.radians(FOV_Y_DEG / 2))
    cam_data.clip_start, cam_data.clip_end = 5, 40000
    cam = bpy.data.objects.new("cam", cam_data)
    sc.collection.objects.link(cam)
    sc.camera = cam
    frames = []
    for i, p in enumerate(camera_poses(focus, radius, a.views_scale)):
        cam.location = p
        cam.rotation_euler = (focus - p).to_track_quat("-Z", "Y").to_euler()
        bpy.context.view_layer.update()
        name = f"images/{i:04d}.png"
        sc.render.filepath = os.path.join(out, name)
        bpy.ops.render.render(write_still=True)
        m = cam.matrix_world.copy()
        m.translation = m.translation / SCENE_SCALE
        frames.append({"file_path": name, "transform_matrix": [list(row) for row in m]})
        print(f"view {i} done", flush=True)
    fov_x = 2 * math.atan(math.tan(math.radians(FOV_Y_DEG / 2)) * RES[0] / RES[1])
    ground_img = bpy.data.images.load(os.path.join(bs.WORK, "ground_2048.png"))
    pts, col = init_points(T, focus, radius, ground_img)
    write_ply(os.path.join(out, "init.ply"), pts, col)
    with open(os.path.join(out, "transforms.json"), "w") as fh:
        json.dump({"camera_angle_x": fov_x, "camera_angle_y": math.radians(FOV_Y_DEG), "w": RES[0], "h": RES[1],
                   "ply_file_path": "init.ply", "frames": frames}, fh)
    # Where the close-up looks and starts, in three.js axes and scene units.
    target = [focus.x / SCENE_SCALE, focus.z / SCENE_SCALE, -focus.y / SCENE_SCALE]
    dist = radius * VIEW_DIST / SCENE_SCALE
    with open(os.path.join(out, "capture.json"), "w") as fh:
        json.dump({"zone": a.zone, "target": target, "camera": [t + d * dist for t, d in zip(target, VIEW_DIR)],
                   "maxDistance": radius * RINGS[-1][0] / SCENE_SCALE, "minDistance": radius * 0.4 / SCENE_SCALE}, fh)
    print("dataset", len(frames), "views,", len(pts), "init points ->", out)


main()
