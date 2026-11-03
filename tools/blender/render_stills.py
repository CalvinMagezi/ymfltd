# /// script
# requires-python = ">=3.11"
# dependencies = ["pillow"]
# ///
"""Render the concept-model stills (public/images/concept/<view>.jpg) in Cycles.

Paint the final ground first (uv run tools/blender/paint_ground.py 8192), then:
  uv run tools/blender/render_stills.py [--views hospital,hero] [--publish]
"""
import argparse, os, shutil, subprocess, sys
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
WORK = os.path.join(HERE, ".work", "stills")
# The same views tools/concept-model/renders.py shot from the explorer, at the size those stills had.
VIEWS = ["hero", "overview", "hospital", "heritage", "commercial", "housing", "golf", "hotel", "university",
         "arena", "forest", "wetland", "dairy", "agro", "bamboo", "ecolodge", "utilities"]
RES = "1497x936"
SAMPLES = 128
JPEG_QUALITY = 82


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--views", default=",".join(VIEWS))
    p.add_argument("--publish", action="store_true", help="copy the JPEGs into public/images/concept")
    a = p.parse_args()
    os.makedirs(WORK, exist_ok=True)
    for v in a.views.split(","):
        png = os.path.join(WORK, f"{v}.png")
        cmd = ["blender", "-b", "--python-exit-code", "1", "-P", os.path.join(HERE, "build_scene.py"), "--",
               "--view", v, "--res", RES, "--samples", str(SAMPLES), "--out", png]
        r = subprocess.run(cmd, capture_output=True, text=True)
        if r.returncode != 0 or not os.path.exists(png):
            sys.exit(f"render failed {v}:\n{r.stdout[-2000:]}\n{r.stderr[-2000:]}")
        jpg = os.path.join(WORK, f"{v}.jpg")
        Image.open(png).convert("RGB").save(jpg, quality=JPEG_QUALITY, optimize=True, progressive=True)
        if a.publish:
            shutil.copyfile(jpg, os.path.join(ROOT, "public", "images", "concept", f"{v}.jpg"))
        print(f"{v} {os.path.getsize(jpg) // 1024} KB", flush=True)


if __name__ == "__main__":
    main()
