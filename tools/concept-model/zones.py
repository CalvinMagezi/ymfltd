"""Concept land budget v0 laid out inside the indicative boundary.

Wetland follows the lowest valley ground; the forest reserve follows the darkest
(most wooded) imagery; other zones are grown from seeds with a weighted Voronoi
so each gets its budgeted acreage.
"""
import json, math, os
import numpy as np
from PIL import Image, ImageDraw
from shapely.geometry import Polygon, Point, box, MultiPolygon
from shapely.ops import unary_union

HERE = os.path.dirname(__file__)
B = os.path.join(HERE, "base")
osm = json.load(open(f"{B}/osm_local.json"))
F = osm["frame"]
HW, HH = F["half_w"], F["half_h"]
ACRE = 4046.8564224
bnd = Polygon(json.load(open(f"{B}/boundary.json"))["boundary"])
dem = np.load(f"{B}/dem.npy")
gimg = np.asarray(Image.open(f"{B}/ground_raw.png").convert("RGB")).astype(np.float32)


def to_local(lat, lon):
    return (lon - F["lon0"]) * F["mx"], (lat - F["lat0"]) * F["my"]


def sample(arr, x, y):
    n = arr.shape[0]
    fx = (x + HW) / (2 * HW) * (n - 1)
    fy = (HH - y) / (2 * HH) * (n - 1)
    x0, y0 = int(fx), int(fy)
    x0 = min(max(x0, 0), n - 2); y0 = min(max(y0, 0), n - 2)
    tx, ty = fx - x0, fy - y0
    return (arr[y0, x0] * (1 - tx) * (1 - ty) + arr[y0, x0 + 1] * tx * (1 - ty)
            + arr[y0 + 1, x0] * (1 - tx) * ty + arr[y0 + 1, x0 + 1] * tx * ty)


ZONES = [
    # id, name, acres, phase, colour, kind
    ("forest", "Forest game reserve and wildlife centre", 300, 2, "#2f6b3a"),
    ("wetland", "Wetland and conservation buffer", 110, 0, "#3f8f9a"),
    ("golf", "18-hole golf course", 160, 1, "#8cc152"),
    ("hotel", "Five-star hotel, resort and conference centre", 25, 1, "#d9a441"),
    ("hospital", "100-bed hospital and medical campus", 20, 1, "#e05a5a"),
    ("housing", "Residential estate: apartments and town houses", 160, 1, "#e8c9a0"),
    ("university", "University, schools and vocational centre", 85, 2, "#6b7fd7"),
    ("commercial", "Commercial, shopping and entertainment centre", 30, 3, "#c46bd0"),
    ("arena", "Sports arena (10,000 seats) and motorsport course", 70, 2, "#f08a3c"),
    ("agro", "Agro-industrial park and Centre for Agricultural Excellence", 90, 3, "#9a9a7e"),
    ("dairy", "Kikwite dairy farm and agri-tourism", 85, 0, "#c8b35a"),
    ("heritage", "Library, museum and cultural village", 20, 0, "#a0522d"),
    ("bamboo", "Bamboo and hemp plantations", 40, 2, "#b5d36b"),
    ("ecolodge", "Green eco-lodge", 10, 2, "#5aa36e"),
    ("utilities", "Solar farm, utilities and open space", 75, 1, "#7aa0b8"),
]
assert sum(z[2] for z in ZONES) == 1280

# ---- grid of cells inside the boundary ----
CELL = 15.0
minx, miny, maxx, maxy = bnd.bounds
xs = np.arange(minx + CELL / 2, maxx, CELL)
ys = np.arange(miny + CELL / 2, maxy, CELL)
from shapely import contains_xy
GX, GY = np.meshgrid(xs, ys)
inside = contains_xy(bnd, GX, GY)
cx, cy = GX[inside], GY[inside]
ncell = len(cx)
cell_acre = CELL * CELL / ACRE
print("cells", ncell, "acres", round(ncell * cell_acre))
scale = 1280 / (ncell * cell_acre)  # cells -> budget acres

elev = np.array([sample(dem, x, y) for x, y in zip(cx, cy)])
# relative elevation: cell minus mean of a 500 m neighbourhood (sampled ring)
rel = np.zeros(ncell)
for k in range(ncell):
    ring = [sample(dem, cx[k] + 500 * math.cos(a), cy[k] + 500 * math.sin(a)) for a in np.linspace(0, 2 * math.pi, 12, endpoint=False)]
    rel[k] = elev[k] - np.mean(ring)
# darkness from imagery (wooded = dark green)
def img_px(x, y):
    n = gimg.shape[0]
    return gimg[int((HH - y) / (2 * HH) * (n - 1)), int((x + HW) / (2 * HW) * (n - 1))]
bright = np.array([img_px(x, y).mean() for x, y in zip(cx, cy)])
# smooth brightness with neighbours for stable patches
from scipy.ndimage import uniform_filter
print("elev in boundary", elev.min().round(), elev.max().round())

target_cells = {z[0]: z[2] / scale / cell_acre for z in ZONES}
assign = np.full(ncell, -1)
ids = [z[0] for z in ZONES]


import heapq
rr, cc = np.where(inside)
idx2d = np.full(GX.shape, -1)
idx2d[rr, cc] = np.arange(ncell)


def smooth(vals, size):
    g = np.zeros(GX.shape); m = np.zeros(GX.shape)
    g[rr, cc] = vals; m[rr, cc] = 1
    return (uniform_filter(g, size) / np.maximum(uniform_filter(m, size), 1e-6))[rr, cc]


def grow(score, n_target, allowed):
    """Priority-flood region growing from the best cell: one connected area."""
    start = min((i for i in range(ncell) if allowed[i]), key=lambda i: score[i])
    taken = np.zeros(ncell, bool); queued = np.zeros(ncell, bool)
    heap = [(score[start], start)]; queued[start] = True
    out = []
    while heap and len(out) < int(round(n_target)):
        s, i = heapq.heappop(heap)
        taken[i] = True; out.append(i)
        for dr_, dc_ in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            r2, c2 = rr[i] + dr_, cc[i] + dc_
            if 0 <= r2 < GX.shape[0] and 0 <= c2 < GX.shape[1]:
                j = idx2d[r2, c2]
                if j >= 0 and allowed[j] and not queued[j]:
                    queued[j] = True; heapq.heappush(heap, (score[j], j))
    return np.array(out)


# wetland = valley floors: lowest ground relative to its surroundings
wet_score = smooth(rel, 5) + 0.03 * (elev - elev.min())
wi = grow(wet_score, target_cells["wetland"], assign < 0)
assign[wi] = ids.index("wetland")
# forest = darkest (most wooded) imagery, pulled toward the southern lobe
forest_score = smooth(bright, 11) + 0.012 * (cy - cy.min())
fi = grow(forest_score, target_cells["forest"], assign < 0)
assign[fi] = ids.index("forest")
# close pockets of free ground trapped inside the forest, then trim the same
# number of forest cells from the edge facing the open land, so acreage holds
from scipy.ndimage import label as cc_label
free2d = np.zeros(GX.shape, bool); free2d[rr, cc] = assign < 0
lab2d, nlab = cc_label(free2d)
sizes = np.bincount(lab2d[rr, cc][assign < 0])
wz = ids.index("wetland")
wet2d = np.zeros(GX.shape, bool); wet2d[rr, cc] = assign == wz
from scipy.ndimage import binary_dilation
near_wet = binary_dilation(wet2d, iterations=2)
big = set(int(k) for k in np.unique(lab2d[near_wet & free2d]) if k > 0)
pocket = np.array([assign[i] < 0 and int(lab2d[rr[i], cc[i]]) not in big for i in range(ncell)])
n_pocket = int(pocket.sum())
assign[pocket] = ids.index("forest")
if n_pocket:
    fz = ids.index("forest")
    def touches_main(i):
        for a, b in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            r2, c2 = rr[i] + a, cc[i] + b
            if 0 <= r2 < GX.shape[0] and 0 <= c2 < GX.shape[1] and int(lab2d[r2, c2]) in big:
                return True
        return False
    for _ in range(n_pocket):
        cand = [i for i in np.where(assign == fz)[0] if touches_main(i)]
        worst = max(cand, key=lambda i: forest_score[i])
        assign[worst] = -1
        lab2d[rr[worst], cc[worst]] = int(lab2d[rr[worst] + 0, cc[worst]]) if int(lab2d[rr[worst], cc[worst]]) in big else next(iter(big))
print("forest pockets closed", n_pocket)
fi = np.where(assign == ids.index("forest"))[0]
# eco-lodge seed: the free cell on the forest edge closest to the site centre
fset = set(fi.tolist())
edge = [i for i in range(ncell) if assign[i] < 0 and any(
    0 <= rr[i] + a < GX.shape[0] and 0 <= cc[i] + b < GX.shape[1] and idx2d[rr[i] + a, cc[i] + b] in fset
    for a, b in ((1, 0), (-1, 0), (0, 1), (0, -1)))]
bc = bnd.centroid
eco_seed = min(edge, key=lambda i: (cx[i] - bc.x) ** 2 + (cy[i] - bc.y) ** 2)

# seeds for the rest, in local metres
lib = to_local(1.412144, 31.3648953)
north = max(bnd.exterior.coords, key=lambda p: p[1])
south = min(bnd.exterior.coords, key=lambda p: p[1])
east = max(bnd.exterior.coords, key=lambda p: p[0])
west = min(bnd.exterior.coords, key=lambda p: p[0])
c = (bnd.centroid.x, bnd.centroid.y)
def lerp(a, b, t):
    return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)
seeds = {
    "heritage": lib,
    "commercial": lerp(north, c, 0.12),
    "hospital": lerp(north, east, 0.35),
    "housing": lerp(lerp(north, west, 0.5), c, 0.35),
    "hotel": lerp(c, east, 0.45),
    "golf": lerp(c, east, 0.1),
    "university": lerp(east, c, 0.12),
    "arena": lerp(lerp(east, south, 0.55), c, 0.2),
    "agro": lerp(lerp(west, c, 0.5), north, 0.1),
    "dairy": lerp(west, c, 0.25),
    "bamboo": lerp(c, south, 0.35),
    "ecolodge": (cx[eco_seed], cy[eco_seed]),
    "utilities": lerp(lerp(west, south, 0.5), c, 0.15),
}
free = assign < 0
fx, fy = cx[free], cy[free]
names = list(seeds.keys())
S = np.array([seeds[n] for n in names])
D = np.sqrt((fx[:, None] - S[None, :, 0]) ** 2 + (fy[:, None] - S[None, :, 1]) ** 2)
w = np.zeros(len(names))
tgt = np.array([target_cells[n] for n in names])
for it in range(4000):
    lab = np.argmin(D - w[None, :], axis=1)
    cnt = np.bincount(lab, minlength=len(names))
    err = tgt - cnt
    if np.abs(err).max() < 2:
        break
    w += 0.6 * err / np.sqrt(tgt)
print("voronoi iterations", it, "max err cells", np.abs(err).max())
free_idx = np.where(free)[0]
for k, n in enumerate(names):
    assign[free_idx[lab == k]] = ids.index(n)

# ---- polygons ----
zones_out = []
for zi, (zid, name, acres, phase, col) in enumerate(ZONES):
    sel = assign == zi
    sq = [box(x - CELL / 2, y - CELL / 2, x + CELL / 2, y + CELL / 2) for x, y in zip(cx[sel], cy[sel])]
    geom = unary_union(sq).buffer(12, join_style=1).buffer(-12, join_style=1).intersection(bnd)
    parts = list(geom.geoms) if isinstance(geom, MultiPolygon) else [geom]
    parts = [p.simplify(3) for p in parts if p.area > 2500]
    polys = []
    for p in parts:
        polys.append({"o": [[round(a, 1), round(b, 1)] for a, b in p.exterior.coords],
                      "h": [[[round(a, 1), round(b, 1)] for a, b in r.coords] for r in p.interiors if Polygon(r).area > 900]})
    real = sum(p.area for p in parts) / ACRE * scale
    cen = unary_union(parts).representative_point() if parts else Point(*c)
    zones_out.append({"id": zid, "name": name, "acres": acres, "phase": phase, "color": col,
                      "polys": polys, "label": [round(cen.x, 1), round(cen.y, 1)],
                      "drawn_acres": round(real)})
    print(f"{zid:11s} budget {acres:4d}  drawn {real:6.0f}  parts {len(parts)}")

json.dump({"zones": zones_out, "cell": CELL}, open(f"{B}/zones.json", "w"))
np.save(f"{B}/assign.npy", np.stack([cx, cy, assign, elev]))

# preview
img = Image.open(f"{B}/ground_raw.png").convert("RGB")
W = img.width
def px(x, y):
    return ((x + HW) / (2 * HW) * W, (HH - y) / (2 * HH) * W)
ov = Image.new("RGBA", img.size, (0, 0, 0, 0))
dr = ImageDraw.Draw(ov)
for z in zones_out:
    colr = tuple(int(z["color"][i:i + 2], 16) for i in (1, 3, 5))
    for p in z["polys"]:
        dr.polygon([px(*q) for q in p["o"]], fill=colr + (170,), outline=(255, 255, 255, 255))
img = Image.alpha_composite(img.convert("RGBA"), ov)
dr = ImageDraw.Draw(img)
for z in zones_out:
    x, y = px(*z["label"])
    dr.text((x - 20, y - 5), z["id"], fill=(255, 255, 255))
img.convert("RGB").crop((500, 450, 1100, 1250)).save(f"{B}/zones_preview.png")
