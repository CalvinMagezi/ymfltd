"""Export the PUBLIC version of the concept model for the website's /explore page.

Differences from the private family model:
- no satellite photograph: the ground is a painted hillshade with generalised land cover
  (forest, farmland, built-up) blurred to roughly 60 m so no individual building shows;
- no site boundary line and no neighbouring buildings;
- only major and secondary roads from OpenStreetMap, and a short list of public landmarks;
- the library is shown as planned, not existing.

Run after content.py:  python3 public_export.py <work_dir> <repo_public_explore_dir>
"""
import json, math, os, sys
import numpy as np
from PIL import Image, ImageFilter
from scipy.ndimage import gaussian_filter, zoom

WORK = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(__file__)
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(__file__), "..", "..", "public", "explore")
os.makedirs(OUT, exist_ok=True)
B = os.path.join(WORK, "base")
SITE = os.path.join(WORK, "site", "data")

plan = json.load(open(f"{SITE}/plan.json"))
ctx = json.load(open(f"{SITE}/context.json"))
F = ctx["frame"]
HW, HH = F["half_w"], F["half_h"]
dem = np.load(f"{B}/dem.npy")
N = dem.shape[0]

# ---------- plan: library becomes planned ----------
for b in plan["boxes"]:
    if b[6] == "library":
        b[7] = 2
for z in plan["zones"]:
    if z["id"] == "heritage":
        z["phase"] = 2
plan.pop("existing_inside", None)
plan.pop("boundary", None)
json.dump(plan, open(f"{OUT}/plan.json", "w"), separators=(",", ":"))
# The home page ledger needs only these four fields per zone; keeping them apart keeps the
# 180 KB plan out of the home page's JavaScript.
ROOT = os.path.join(OUT, "..", "..")
with open(os.path.join(ROOT, "lib", "content", "ledger-zones.json"), "w") as fh:
    json.dump([{k: z[k] for k in ("id", "acres", "phase", "color")} for z in plan["zones"]], fh, separators=(",", ":"))
    fh.write("\n")

# ---------- context: roads + public landmarks only ----------
roads = [r for r in ctx["roads"] if r["c"] >= 1]
landmarks = [l for l in ctx["landmarks"] if not l.get("own")]
json.dump({"frame": F, "roads": roads, "landmarks": landmarks,
           "dem": {"n": N, "dm": ctx["dem"]["dm"]}}, open(f"{OUT}/context.json", "w"), separators=(",", ":"))

# ---------- painted ground ----------
S = 2048
px_m = 2 * HW / S
dem_hi = gaussian_filter(zoom(dem, S / N, order=3)[:S, :S], 5)
gy, gx = np.gradient(dem_hi, px_m)
gy = -gy  # rows run north to south
az, alt = math.radians(315), math.radians(42)
slope = np.arctan(np.hypot(gx, gy) * 1.6)
aspect = np.arctan2(gy, -gx)
shade = np.sin(alt) * np.cos(slope) + np.cos(alt) * np.sin(slope) * np.cos(az - aspect)
shade = np.clip(shade, 0, 1)

sat = np.asarray(Image.open(f"{B}/ground_raw.png").convert("RGB").resize((S, S), Image.BICUBIC)).astype(np.float32) / 255
r, g, b_ = sat[..., 0], sat[..., 1], sat[..., 2]
green = gaussian_filter(g - (r + b_) / 2, 12)          # vegetation vigour, ~60 m blur
bright = gaussian_filter((r + g + b_) / 3, 12)

# built-up density from OSM building centroids, blurred
dens = np.zeros((S, S), np.float32)
for bb in ctx["buildings"]:
    c = int((bb[0] + HW) / (2 * HW) * (S - 1)); rr = int((HH - bb[1]) / (2 * HH) * (S - 1))
    if 0 <= c < S and 0 <= rr < S:
        dens[rr, c] += max(1.0, bb[2] * bb[3] / 60)
dens = gaussian_filter(dens, 14)
dens = np.clip(dens / (np.percentile(dens[dens > 0], 85) + 1e-6), 0, 1)

lo, hi = np.percentile(bright, 8), np.percentile(bright, 30)
forest = np.clip((hi - bright) / (hi - lo), 0, 1) * (1 - dens)
forest = gaussian_filter(forest ** 1.4, 4)

C_GRASS = np.array([0.66, 0.73, 0.52])
C_FARM = np.array([0.76, 0.75, 0.57])
C_FOREST = np.array([0.30, 0.45, 0.30])
C_TOWN = np.array([0.84, 0.80, 0.72])
m0, m1 = np.percentile(bright, 45), np.percentile(bright, 85)
mix = np.clip((gaussian_filter(bright, 30) - m0) / (m1 - m0), 0, 1)[..., None]
col = C_GRASS * (1 - mix) + C_FARM * mix
col = col * (1 - forest[..., None]) + C_FOREST * forest[..., None]
col = col * (1 - 0.85 * dens[..., None]) + C_TOWN * (0.85 * dens[..., None])
lit = 0.62 + 0.5 * shade[..., None]
img = np.clip(col * lit, 0, 1)
Image.fromarray((img * 255).astype(np.uint8)).save(f"{OUT}/ground.webp", quality=82, method=6)

for f in os.listdir(OUT):
    print(f, round(os.path.getsize(os.path.join(OUT, f)) / 1024), "KB")
