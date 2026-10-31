"""Turn raw downloads into a local-metre base: DEM grid, ground image, OSM context.

Local frame: origin at (LAT0, LON0); x east (m), y north (m).
"""
import json, math, os, glob
import xml.etree.ElementTree as ET
import numpy as np
from PIL import Image, ImageDraw
from shapely.geometry import Polygon, LineString, Point
from shapely import affinity

HERE = os.path.dirname(__file__)
RAW = os.path.join(HERE, "raw")
OUT = os.path.join(HERE, "base")
os.makedirs(OUT, exist_ok=True)

LAT_MIN, LAT_MAX = 1.368, 1.440
LON_MIN, LON_MAX = 31.328, 31.400
LAT0, LON0 = (LAT_MIN + LAT_MAX) / 2, (LON_MIN + LON_MAX) / 2
MX = 111320.0 * math.cos(math.radians(LAT0))
MY = 110574.0
HALF_W = (LON_MAX - LON_MIN) / 2 * MX
HALF_H = (LAT_MAX - LAT_MIN) / 2 * MY


def to_local(lat, lon):
    return (lon - LON0) * MX, (lat - LAT0) * MY


def to_ll(x, y):
    return LAT0 + y / MY, LON0 + x / MX


def merc_px(lat, lon, z):
    n = 2 ** z * 256
    px = (lon + 180) / 360 * n
    py = (1 - math.log(math.tan(math.radians(lat)) + 1 / math.cos(math.radians(lat))) / math.pi) / 2 * n
    return px, py


def mosaic(prefix, z, ext, mode):
    files = glob.glob(f"{RAW}/{prefix}_{z}_*.{ext}")
    xs = sorted({int(f.split("_")[-2]) for f in files})
    ys = sorted({int(f.split("_")[-1].split(".")[0]) for f in files})
    im = Image.new(mode, (256 * len(xs), 256 * len(ys)))
    for f in files:
        x = int(f.split("_")[-2]); y = int(f.split("_")[-1].split(".")[0])
        im.paste(Image.open(f).convert(mode), ((x - xs[0]) * 256, (y - ys[0]) * 256))
    return im, xs[0] * 256, ys[0] * 256


def sample_grid(im_arr, ox, oy, z, n, fn):
    """Sample an image array on an n x n grid spanning the local extent (row 0 = north)."""
    out = np.zeros((n, n) + im_arr.shape[2:], dtype=np.float32)
    for r in range(n):
        y = HALF_H - r * (2 * HALF_H) / (n - 1)
        for c in range(n):
            x = -HALF_W + c * (2 * HALF_W) / (n - 1)
            lat, lon = to_ll(x, y)
            px, py = merc_px(lat, lon, z)
            out[r, c] = fn(im_arr, px - ox, py - oy)
    return out


def bilinear(a, fx, fy):
    x0, y0 = int(math.floor(fx)), int(math.floor(fy))
    tx, ty = fx - x0, fy - y0
    x0 = min(max(x0, 0), a.shape[1] - 2); y0 = min(max(y0, 0), a.shape[0] - 2)
    return (a[y0, x0] * (1 - tx) * (1 - ty) + a[y0, x0 + 1] * tx * (1 - ty)
            + a[y0 + 1, x0] * (1 - tx) * ty + a[y0 + 1, x0 + 1] * tx * ty)


# ---- DEM ----
dem_im, dox, doy = mosaic("dem", 14, "png", "RGB")
d = np.asarray(dem_im).astype(np.float32)
elev = d[..., 0] * 256 + d[..., 1] + d[..., 2] / 256 - 32768
N = 257
grid = sample_grid(elev, dox, doy, 14, N, bilinear)
print("DEM range", grid.min(), grid.max())
np.save(f"{OUT}/dem.npy", grid)

# ---- Ground image ----
img_im, iox, ioy = mosaic("img", 15, "jpg", "RGB")
ia = np.asarray(img_im).astype(np.float32)
NI = 1600
gimg = sample_grid(ia, iox, ioy, 15, NI, bilinear)
Image.fromarray(np.clip(gimg, 0, 255).astype(np.uint8)).save(f"{OUT}/ground_raw.png")

# ---- OSM ----
nodes = {}
ways = []
seen = set()
for f in sorted(glob.glob(f"{RAW}/osm_*.xml")):
    root = ET.parse(f).getroot()
    for n in root.iter("node"):
        nodes[n.get("id")] = (float(n.get("lat")), float(n.get("lon")))
    for w in root.iter("way"):
        wid = w.get("id")
        if wid in seen:
            continue
        seen.add(wid)
        refs = [nd.get("ref") for nd in w.iter("nd")]
        tags = {t.get("k"): t.get("v") for t in w.iter("tag")}
        ways.append((wid, refs, tags))

roads, buildings, areas, water = [], [], [], []
MAJOR = {"trunk", "primary", "secondary", "trunk_link", "primary_link"}
MID = {"tertiary", "unclassified", "residential", "tertiary_link"}
for wid, refs, tags in ways:
    pts = [to_local(*nodes[r]) for r in refs if r in nodes]
    if len(pts) < 2:
        continue
    pts = [(round(x, 1), round(y, 1)) for x, y in pts]
    if "highway" in tags:
        hw = tags["highway"]
        cls = 2 if hw in MAJOR else 1 if hw in MID else 0
        if hw in {"footway", "path", "steps", "cycleway"}:
            cls = -1
        if cls >= 0:
            roads.append({"c": cls, "n": tags.get("name", ""), "p": pts})
    elif "building" in tags and len(pts) >= 4:
        buildings.append(pts[:-1] if pts[0] == pts[-1] else pts)
    elif tags.get("waterway"):
        water.append({"k": tags["waterway"], "p": pts})
    elif tags.get("natural") or tags.get("landuse") or tags.get("leisure"):
        areas.append({"k": tags.get("natural") or tags.get("landuse") or tags.get("leisure"), "n": tags.get("name", ""), "p": pts})

print("roads", len(roads), "buildings", len(buildings), "areas", len(areas), "water", len(water))
from collections import Counter
print(Counter(a["k"] for a in areas).most_common(15))
print(Counter(r["n"] for r in roads if r["c"] == 2).most_common(10))
json.dump({"roads": roads, "buildings": buildings, "areas": areas, "water": water,
           "frame": {"lat0": LAT0, "lon0": LON0, "mx": MX, "my": MY, "half_w": HALF_W, "half_h": HALF_H}},
          open(f"{OUT}/osm_local.json", "w"))
