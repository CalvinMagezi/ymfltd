"""Indicative YMF boundary (not surveyed) and a preview render for placement checks."""
import json, math, os, sys
import numpy as np
from PIL import Image, ImageDraw
from shapely.geometry import Polygon, Point
from shapely import affinity
from shapely.strtree import STRtree

HERE = os.path.dirname(__file__)
B = os.path.join(HERE, "base")
osm = json.load(open(f"{B}/osm_local.json"))
F = osm["frame"]
ACRE = 4046.8564224
TARGET = 1280 * ACRE


def to_local(lat, lon):
    return (lon - F["lon0"]) * F["mx"], (lat - F["lat0"]) * F["my"]


# Screen-pixel trace from the satellite orientation view, converted with the
# calibration from two known places (Mugenyi Private Library, Bunyoro University).
PX = json.loads(sys.argv[1]) if len(sys.argv) > 1 else [
    (420, 90), (500, 105), (545, 160), (570, 240), (575, 330), (560, 420), (530, 500),
    (470, 560), (390, 575), (320, 545), (285, 470), (300, 390), (330, 310), (350, 230), (380, 150)]
K = 0.0000547
ll = [(1.403 - (y - 289) * K, 31.362 + (x - 399) * K) for x, y in PX]
poly = Polygon([to_local(a, b) for a, b in ll])
s = math.sqrt(TARGET / poly.area)
poly = affinity.scale(poly, s, s, origin=poly.centroid)
print("raw area acres", round(poly.area / s / s / ACRE), "scale", round(s, 3), "final", round(poly.area / ACRE))

bpolys = [Polygon(b) for b in osm["buildings"] if len(b) >= 3]
bpolys = [p for p in bpolys if p.is_valid]
inside = [p for p in bpolys if poly.contains(p.centroid)]
print("buildings inside boundary", len(inside))

lib = Point(*to_local(1.412144, 31.3648953))
uni = Point(*to_local(1.4006961, 31.3728286))
print("library inside:", poly.contains(lib), "dist to edge m", round(poly.exterior.distance(lib)))
print("university inside:", poly.contains(uni), "dist m", round(poly.exterior.distance(uni)))
json.dump({"boundary": [list(map(lambda v: round(v, 1), c)) for c in poly.exterior.coords]}, open(f"{B}/boundary.json", "w"))

# Preview
img = Image.open(f"{B}/ground_raw.png").convert("RGB")
W = img.width
hw, hh = F["half_w"], F["half_h"]


def px(x, y):
    return ((x + hw) / (2 * hw) * W, (hh - y) / (2 * hh) * W)


dr = ImageDraw.Draw(img)
for a in osm["areas"]:
    if a["k"] == "wood":
        dr.polygon([px(*p) for p in a["p"]], outline=(0, 255, 120))
for r in osm["roads"]:
    col = (255, 220, 80) if r["c"] == 2 else (230, 230, 230) if r["c"] == 1 else (160, 160, 160)
    dr.line([px(*p) for p in r["p"]], fill=col, width=2 if r["c"] == 2 else 1)
for p in bpolys:
    c = p.centroid
    x, y = px(c.x, c.y)
    dr.point((x, y), fill=(255, 80, 80))
dr.line([px(*p) for p in poly.exterior.coords], fill=(255, 0, 255), width=3)
for pt, col in ((lib, (0, 200, 255)), (uni, (255, 255, 0))):
    x, y = px(pt.x, pt.y)
    dr.ellipse((x - 6, y - 6, x + 6, y + 6), outline=col, width=3)
img.save(f"{B}/preview.png")
