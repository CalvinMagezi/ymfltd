"""Build one Gaussian-splat close-up per district into public/explore/splat (render, train, compress).

Run from the repo root after `uv run tools/blender/paint_ground.py 8192` and `... 2048`:
  python3 tools/blender/build_district_splats.py [--zones hospital,heritage] [--keep]
Needs blender, node and the Brush app in tools/blender/.work/brush (v0.3.0 from ArthurBrussee/brush).
"""
import argparse, json, os, shutil, subprocess, sys, time

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
WORK = os.path.join(HERE, ".work", "splat")
OUT = os.path.join(ROOT, "public", "explore", "splat")
BRUSH = os.path.join(HERE, ".work", "brush", "brush-app-aarch64-apple-darwin", "brush_app")
TRAIN_STEPS = 12000
MAX_SPLATS = 100000  # about 2 MB as SPZ, so a close-up loads in a few seconds on a phone
SH_DEGREE = 1


def run(*cmd):
    subprocess.run(cmd, check=True, cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)


def build(zone, keep):
    t0 = time.time()
    data = os.path.join(WORK, zone)
    run("blender", "-b", "--python-exit-code", "1", "-P", os.path.join(HERE, "render_splat_dataset.py"), "--", "--zone", zone)
    trained = os.path.join(WORK, f"{zone}_train")
    run(BRUSH, data, "--total-steps", str(TRAIN_STEPS), "--export-every", str(TRAIN_STEPS), "--export-path", trained,
        "--sh-degree", str(SH_DEGREE), "--max-splats", str(MAX_SPLATS))
    ply = os.path.join(trained, f"export_{TRAIN_STEPS}.ply")
    r = subprocess.run(["node", os.path.join(HERE, "transcode_splat.mjs"), ply, os.path.join(data, "capture.json"), OUT],
                       check=True, cwd=ROOT, capture_output=True, text=True)
    print(r.stdout.strip(), f"in {(time.time() - t0) / 60:.1f} min", flush=True)
    if not keep:  # the renders are about 100 MB per district and fully reproducible
        shutil.rmtree(data)
        shutil.rmtree(trained)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--zones", default="")
    p.add_argument("--keep", action="store_true", help="keep each district's renders and raw splat")
    a = p.parse_args()
    plan = json.load(open(os.path.join(ROOT, "public", "explore", "plan.json")))
    zones = a.zones.split(",") if a.zones else [z["id"] for z in plan["zones"]]
    failed = []
    for zone in zones:
        try:
            build(zone, a.keep)
        except subprocess.CalledProcessError as e:
            failed.append(zone)
            print(f"{zone}: FAILED {e.cmd[0]}: {(e.stderr or '')[-400:]}", flush=True)
    if failed:
        sys.exit(f"failed districts: {', '.join(failed)}")


if __name__ == "__main__":
    main()
