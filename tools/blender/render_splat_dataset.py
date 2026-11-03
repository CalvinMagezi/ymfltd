"""Render a Gaussian-splat training set of the town centre from the Blender scene (YMF-3D-004 experiment).

Writes nerfstudio-format images, transforms.json and a starting point cloud for Brush:
  blender -b -P tools/blender/render_splat_dataset.py -- [--views-scale 1.0] [--samples 48]
  brush_app tools/blender/.work/splat/dataset --total-steps 15000 --export-path ...
Scene units are metres divided by SCENE_SCALE, so the capture sits in a box a few units across.
"""
import argparse, json, math, os, sys

import bpy
import numpy as np
from mathutils import Vector

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_scene as bs  # noqa: E402

OUT = os.path.join(bs.WORK, "splat", "dataset")
SCENE_SCALE = 100.0  # metres per scene unit
FOCUS_ZONE = "hospital"  # the capture orbits the hospital and library district and the homes beside it
FOCUS_RADIUS_M = 650  # area the init points and the cameras cover
RES = (1280, 720)
FOV_Y_DEG = 38  # the explorer's camera
SUN_ELEV_DEG = 22  # baked into the splat; higher than the stills so shadows do not swallow streets
# Orbit rings: distance from the focus (m), camera elevation (deg) and views per ring.
RINGS = [(450, 32, 28), (750, 40, 32), (1050, 52, 32), (1350, 64, 20)]
TOP_VIEWS = 6
INIT_GRID_M = 12  # ground point spacing for the starting cloud
INIT_MAX_POINTS = 120000


def args():
    p = argparse.ArgumentParser()
    p.add_argument("--samples", type=int, default=48)
    p.add_argument("--views-scale", type=float, default=1.0, help="multiply views per ring, for quick tests")
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


def camera_poses(focus, views_scale):
    poses = []
    for dist, elev, n in RINGS:
        n = max(4, round(n * views_scale))
        for k in range(n):
            az = 2 * math.pi * (k + 0.5 * (dist // 300 % 2)) / n
            e = math.radians(elev)
            poses.append(focus + Vector((math.cos(az) * math.cos(e), math.sin(az) * math.cos(e), math.sin(e))) * dist)
    for k in range(TOP_VIEWS):
        az = 2 * math.pi * k / TOP_VIEWS
        poses.append(focus + Vector((math.cos(az) * 120, math.sin(az) * 120, 1500)))
    return poses


def init_points(T, focus, img):
    """Ground points coloured from the painted ground texture, plus building and tree positions."""
    r = FOCUS_RADIUS_M * 1.6
    xs = np.arange(focus.x - r, focus.x + r, INIT_GRID_M)
    ys = np.arange(focus.y - r, focus.y + r, INIT_GRID_M)
    gx, gy = np.meshgrid(xs, ys)
    gx, gy = gx.ravel(), gy.ravel()
    gz = T.h(gx, gy)
    w, h = img.size
    px = np.asarray(img.pixels[:], np.float32).reshape(h, w, 4)
    u = np.clip(((gx + T.hw) / (2 * T.hw) * (w - 1)).astype(int), 0, w - 1)
    v = np.clip(((gy + T.hh) / (2 * T.hh) * (h - 1)).astype(int), 0, h - 1)
    col = px[v, u, :3]
    pts = np.stack([gx, gy, gz], -1)
    if len(pts) > INIT_MAX_POINTS:
        keep = np.random.default_rng(0).choice(len(pts), INIT_MAX_POINTS, replace=False)
        pts, col = pts[keep], col[keep]
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
    os.makedirs(os.path.join(OUT, "images"), exist_ok=True)
    plan = json.load(open(f"{bs.SRC}/plan.json"))
    ctx = json.load(open(f"{bs.SRC}/context.json"))
    T = bs.Terrain(ctx)
    build(plan, T)
    sc = bpy.context.scene
    sc.cycles.samples = a.samples
    z = next(z for z in plan["zones"] if z["id"] == FOCUS_ZONE)
    focus = Vector((z["label"][0], z["label"][1], float(T.h(*z["label"]))))
    cam_data = bpy.data.cameras.new("cam")
    cam_data.sensor_fit = "VERTICAL"
    cam_data.sensor_height = 24
    cam_data.lens = 12 / math.tan(math.radians(FOV_Y_DEG / 2))
    cam_data.clip_start, cam_data.clip_end = 5, 40000
    cam = bpy.data.objects.new("cam", cam_data)
    sc.collection.objects.link(cam)
    sc.camera = cam
    frames = []
    for i, p in enumerate(camera_poses(focus, a.views_scale)):
        cam.location = p
        cam.rotation_euler = (focus - p).to_track_quat("-Z", "Y").to_euler()
        bpy.context.view_layer.update()
        name = f"images/{i:04d}.png"
        sc.render.filepath = os.path.join(OUT, name)
        bpy.ops.render.render(write_still=True)
        m = cam.matrix_world.copy()
        m.translation = m.translation / SCENE_SCALE
        frames.append({"file_path": name, "transform_matrix": [list(row) for row in m]})
        print(f"view {i} done", flush=True)
    fov_x = 2 * math.atan(math.tan(math.radians(FOV_Y_DEG / 2)) * RES[0] / RES[1])
    ground_img = bpy.data.images.load(os.path.join(bs.WORK, "ground_2048.png"))
    pts, col = init_points(T, focus, ground_img)
    write_ply(os.path.join(OUT, "init.ply"), pts, col)
    with open(os.path.join(OUT, "transforms.json"), "w") as fh:
        json.dump({"camera_angle_x": fov_x, "camera_angle_y": math.radians(FOV_Y_DEG), "w": RES[0], "h": RES[1],
                   "ply_file_path": "init.ply", "frames": frames}, fh)
    print("dataset", len(frames), "views,", len(pts), "init points ->", OUT)


main()
