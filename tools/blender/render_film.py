# /// script
# requires-python = ">=3.11"
# dependencies = ["pillow"]
# ///
"""Render the home film ("land becomes the town") in Cycles, frame by frame, for FilmPlayer.

Paint the ground first:  uv run tools/blender/paint_ground.py 6144 --film --zone-fill 0.5
Then:                    uv run tools/blender/render_film.py [--frames 7,25,44,67] [--sets d,m] [--q 60]
Frames land in tools/blender/.work/film/<set>/NN.webp; --publish copies them to public/film/<set>.
"""
import argparse, os, shutil, subprocess, sys, time
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from film_timing import FRAMES  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
WORK = os.path.join(HERE, ".work")
# Desktop and phone sets as tools/film/render-frames.cjs made them: size and camera distance factor.
SETS = {"d": dict(res="1440x810", zoom=1.0), "m": dict(res="900x900", zoom=1.32)}
PAGE_BG = "#e8e0cc"  # the film section's cream, which the old frames used as their sky
SAMPLES = 96
# Film look chosen on 3 Nov 2026 against the old frames: a higher sun than the stills keeps terrain
# shadows from swamping the town at film distance, and Punchy with a little less exposure stops the
# pale public ground from washing out.
FILM_LOOK = ["--sun-elev", "32", "--look", "AgX - Punchy", "--exposure", "-0.4"]
WEBP_METHOD = 6


def render(set_name, i, samples):
    cfg = SETS[set_name]
    out = os.path.join(WORK, "film", set_name, f"{i:02d}.png")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    cmd = ["blender", "-b", "--python-exit-code", "1", "-P", os.path.join(HERE, "build_scene.py"), "--",
           "--frame", str(i), "--zoom", str(cfg["zoom"]), "--res", cfg["res"], "--samples", str(samples),
           "--transparent", *FILM_LOOK, "--ground", os.path.join(WORK, "film_ground", f"{i:02d}.png"), "--out", out]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0 or not os.path.exists(out):
        sys.exit(f"render failed {set_name}{i:02d}:\n{r.stdout[-2000:]}\n{r.stderr[-2000:]}")
    return out


def encode(png, q):
    """Lay the transparent sky over the page cream and write a WebP next to the PNG."""
    im = Image.open(png).convert("RGBA")
    bg = Image.new("RGBA", im.size, PAGE_BG)
    bg.alpha_composite(im)
    flat = png[:-4] + "_flat.png"
    bg.convert("RGB").save(flat)
    webp = png[:-4] + ".webp"
    subprocess.run(["cwebp", "-quiet", "-q", str(q), "-m", str(WEBP_METHOD), flat, "-o", webp], check=True)
    return webp


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--frames", default="", help="comma list; default all")
    p.add_argument("--sets", default="d,m")
    p.add_argument("--q", type=int, default=62)
    p.add_argument("--samples", type=int, default=SAMPLES)
    p.add_argument("--encode-only", action="store_true", help="re-encode existing renders at a new quality")
    p.add_argument("--publish", action="store_true", help="copy the WebPs into public/film")
    a = p.parse_args()
    frames = [int(v) for v in a.frames.split(",")] if a.frames else list(range(FRAMES))
    for s in a.sets.split(","):
        total, t0 = 0, time.time()
        for i in frames:
            png = os.path.join(WORK, "film", s, f"{i:02d}.png")
            if not a.encode_only:
                render(s, i, a.samples)
            webp = encode(png, a.q)
            total += os.path.getsize(webp)
            if a.publish:
                shutil.copyfile(webp, os.path.join(ROOT, "public", "film", s, f"{i:02d}.webp"))
            print(f"{s}{i:02d} {os.path.getsize(webp) // 1024} KB  {time.time() - t0:.0f}s", flush=True)
        print(f"SET {s}: {len(frames)} frames, {total / 1e6:.2f} MB at q{a.q}", flush=True)


if __name__ == "__main__":
    main()
