"""Procedural concept content + compact data files for the viewer."""
import json, math, os, random
import numpy as np
from PIL import Image, ImageEnhance
from shapely.geometry import Polygon, Point, LineString, MultiPolygon
from shapely.ops import unary_union
from shapely import affinity

HERE = os.path.dirname(__file__)
B = os.path.join(HERE, "base")
SITE = os.path.join(HERE, "site")
os.makedirs(f"{SITE}/data", exist_ok=True)
random.seed(7)

osm = json.load(open(f"{B}/osm_local.json"))
F = osm["frame"]
bnd = Polygon(json.load(open(f"{B}/boundary.json"))["boundary"])
Z = json.load(open(f"{B}/zones.json"))["zones"]
PHASE = {"forest": 0, "wetland": 0, "dairy": 0, "heritage": 0, "golf": 1, "hotel": 1, "hospital": 1,
         "housing": 1, "utilities": 1, "university": 2, "arena": 2, "bamboo": 2, "ecolodge": 2,
         "commercial": 3, "agro": 3}


def to_local(lat, lon):
    return (lon - F["lon0"]) * F["mx"], (lat - F["lat0"]) * F["my"]


def zpoly(z):
    ps = [Polygon(p["o"], p["h"]) for p in z["polys"]]
    return unary_union([p.buffer(0) for p in ps])


zp = {z["id"]: zpoly(z) for z in Z}
for z in Z:
    z["phase"] = PHASE[z["id"]]


def largest(g):
    if isinstance(g, MultiPolygon):
        return max(g.geoms, key=lambda p: p.area)
    return g


def axis_angle(p):
    r = p.minimum_rotated_rectangle
    c = list(r.exterior.coords)
    e1 = (c[1][0] - c[0][0], c[1][1] - c[0][1]); e2 = (c[2][0] - c[1][0], c[2][1] - c[1][1])
    e = e1 if math.hypot(*e1) > math.hypot(*e2) else e2
    return math.atan2(e[1], e[0])


boxes = []   # [x, y, w, d, h, ang, colorKey, phase]
cyl = []     # [x, y, r, h, colorKey, phase, cone(0/1)]
trees = []   # [x, y, s, kind, phase]  kind 0 broadleaf, 1 bamboo, 2 ornamental
paint = []   # extra painted features: {t:type, p:[...], ph}


def add_box(x, y, w, d, h, a, k, ph):
    boxes.append([round(x, 1), round(y, 1), round(w, 1), round(d, 1), round(h, 1), round(a, 3), k, ph])


def fits(poly, x, y, w, d, a, margin=4):
    r = affinity.rotate(Polygon([(-w / 2, -d / 2), (w / 2, -d / 2), (w / 2, d / 2), (-w / 2, d / 2)]), a, use_radians=True)
    r = affinity.translate(r, x, y)
    return poly.buffer(-margin).contains(r)


def grid_place(poly, sx, sy, a, fn, jitter=0.0):
    c = poly.centroid
    R = math.hypot(*(np.array(poly.bounds[2:]) - np.array(poly.bounds[:2])))
    ca, sa = math.cos(a), math.sin(a)
    n = int(R / min(sx, sy)) + 2
    for i in range(-n, n + 1):
        for j in range(-n, n + 1):
            u, v = i * sx, j * sy
            x = c.x + u * ca - v * sa + random.uniform(-jitter, jitter)
            y = c.y + u * sa + v * ca + random.uniform(-jitter, jitter)
            fn(x, y, i, j)


# ---------- hospital ----------
p = largest(zp["hospital"]); a = axis_angle(p); c = p.representative_point()
ca, sa = math.cos(a), math.sin(a)
def at(u, v):
    return c.x + u * ca - v * sa, c.y + u * sa + v * ca
for (u, v, w, d, h) in [(0, 0, 110, 40, 22), (-40, 45, 50, 24, 14), (40, 45, 50, 24, 14), (0, -48, 60, 26, 10), (70, -10, 24, 24, 8)]:
    x, y = at(u, v); add_box(x, y, w, d, h, a, "hospital", 1)

# ---------- heritage: existing library + museum + cultural village ----------
lib = to_local(1.412144, 31.3648953)
add_box(lib[0], lib[1], 34, 18, 8, 0.3, "library", 0)
p = largest(zp["heritage"]); a = axis_angle(p); c = p.representative_point()
mx_, my_ = c.x + 60 * math.cos(a), c.y + 60 * math.sin(a)
if not p.contains(Point(mx_, my_)):
    mx_, my_ = c.x, c.y
add_box(mx_, my_, 64, 30, 11, a, "museum", 2)
vx, vy = c.x - 70 * math.cos(a), c.y - 70 * math.sin(a)
if not p.buffer(-10).contains(Point(vx, vy)):
    vx, vy = c.x, c.y - 30
for k in range(12):
    t = 2 * math.pi * k / 12
    cyl.append([round(vx + 34 * math.cos(t), 1), round(vy + 34 * math.sin(t), 1), 5.5, 4, "hut", 2, 1])
cyl.append([round(vx, 1), round(vy, 1), 9, 6, "hut", 2, 1])

# ---------- commercial ----------
p = largest(zp["commercial"]); a = axis_angle(p); c = p.representative_point(); ca, sa = math.cos(a), math.sin(a)
for (u, v, w, d, h) in [(0, 0, 150, 70, 15), (-60, 70, 40, 30, 22), (0, 72, 40, 30, 28), (60, 70, 40, 30, 18), (100, -10, 36, 50, 12)]:
    x, y = c.x + u * ca - v * sa, c.y + u * sa + v * ca
    if fits(p, x, y, w, d, a, 2):
        add_box(x, y, w, d, h, a, "commercial", 3)

# ---------- hotel ----------
p = largest(zp["hotel"]); a = axis_angle(p); c = p.representative_point(); ca, sa = math.cos(a), math.sin(a)
add_box(c.x, c.y, 62, 24, 48, a, "hotel", 1)
x, y = c.x - 0 * ca + 40 * sa, c.y - 0 * sa - 40 * ca
add_box(x, y, 96, 50, 10, a, "hotel", 1)
def villa(x, y, i, j):
    if (i or j) and fits(p, x, y, 12, 12, a, 6) and abs(i) + abs(j) > 2:
        add_box(x, y, 12, 12, 5, a, "villa", 1)
grid_place(p, 34, 34, a, villa, 4)

# ---------- housing (north streets phase 1, rest phase 3) ----------
p = largest(zp["housing"]); a = axis_angle(p); cyc = p.centroid.y
def house(x, y, i, j):
    apt = (i + j) % 3 == 0
    w, d, h = (36, 14, random.choice([12, 15, 18])) if apt else (30, 10, random.choice([6, 7]))
    if fits(p, x, y, w, d, a, 8):
        ph = 1 if y > cyc else 3
        add_box(x, y, w, d, h, a, "apartment" if apt else "townhouse", ph)
        if random.random() < 0.5:
            trees.append([round(x + 20, 1), round(y + 12, 1), 0.7, 2, ph])
grid_place(p, 48, 34, a, house, 0)

# ---------- university: quad ring + schools ----------
p = largest(zp["university"]); a = axis_angle(p); ca, sa = math.cos(a), math.sin(a)
c = p.representative_point()
def uni(x, y, i, j):
    if fits(p, x, y, 64, 18, a, 10) and (i + j) % 2 == 0:
        add_box(x, y, 64, 18, random.choice([12, 14, 16]), a, "university", 2)
    elif fits(p, x, y, 20, 20, a, 10) and random.random() < 0.4:
        trees.append([round(x, 1), round(y, 1), 1.0, 2, 2])
grid_place(p, 90, 52, a, uni, 0)

# ---------- agro-industrial park ----------
for g in (zp["agro"].geoms if isinstance(zp["agro"], MultiPolygon) else [zp["agro"]]):
    if g.area < 20000:
        continue
    a = axis_angle(g)
    def ware(x, y, i, j):
        if fits(g, x, y, 80, 40, a, 8):
            add_box(x, y, 80, 40, 11, a, "warehouse", 3)
            if j % 2 == 0:
                cyl.append([round(x + 48 * math.cos(a), 1), round(y + 48 * math.sin(a), 1), 6, 20, "silo", 3, 0])
    grid_place(g, 120, 72, a, ware, 0)

# ---------- dairy farm: existing barns + expansion ----------
p = largest(zp["dairy"]); a = axis_angle(p); c = p.representative_point(); ca, sa = math.cos(a), math.sin(a)
for k, (u, v) in enumerate([(0, 0), (0, 26), (0, 52), (70, 10)]):
    add_box(c.x + u * ca - v * sa, c.y + u * sa + v * ca, 56, 14, 6, a, "barn", 0)
for (u, v, w, d, h, kk) in [(-80, 20, 40, 24, 9, "processing"), (-80, -30, 30, 18, 7, "visitor")]:
    x, y = c.x + u * ca - v * sa, c.y + u * sa + v * ca
    if p.contains(Point(x, y)):
        add_box(x, y, w, d, h, a, kk, 2)
bx, by = c.x + 70 * ca + 60 * sa, c.y + 70 * sa - 60 * ca
if p.contains(Point(bx, by)):
    cyl.append([round(bx, 1), round(by, 1), 9, 7, "biogas", 2, 2])
    cyl.append([round(bx + 22, 1), round(by, 1), 9, 7, "biogas", 2, 2])

# ---------- eco-lodge ----------
p = largest(zp["ecolodge"]); a = axis_angle(p); c = p.representative_point(); ca, sa = math.cos(a), math.sin(a)
add_box(c.x, c.y, 26, 12, 6, a, "lodge", 2)
for k in range(-4, 5):
    if k == 0:
        continue
    x, y = c.x + k * 22 * ca, c.y + k * 22 * sa
    if p.buffer(-3).contains(Point(x, y)):
        add_box(x, y, 8, 8, 4, a, "cabin", 2)

# ---------- forest: trees (existing) + wildlife centre (phase 2) ----------
fpoly = zp["forest"]
minx, miny, maxx, maxy = fpoly.bounds
from shapely import contains_xy
xs = np.arange(minx, maxx, 19.0); ys = np.arange(miny, maxy, 19.0)
GX, GY = np.meshgrid(xs, ys)
GX = GX + np.random.RandomState(3).uniform(-7, 7, GX.shape)
GY = GY + np.random.RandomState(4).uniform(-7, 7, GY.shape)
ok = contains_xy(fpoly, GX, GY)
for x, y in zip(GX[ok], GY[ok]):
    trees.append([round(float(x), 1), round(float(y), 1), round(random.uniform(0.8, 1.4), 2), 0, 0])
# visitor centre + viewing tower at the forest edge nearest the site centre
edge_pt = fpoly.exterior.interpolate(fpoly.exterior.project(bnd.centroid)) if hasattr(fpoly, "exterior") else largest(fpoly).exterior.interpolate(0)
lp = largest(fpoly)
edge_pt = lp.exterior.interpolate(lp.exterior.project(bnd.centroid))
inward = Point(edge_pt.x + (lp.centroid.x - edge_pt.x) * 0.08, edge_pt.y + (lp.centroid.y - edge_pt.y) * 0.08)
add_box(inward.x, inward.y, 40, 18, 7, 0.2, "visitor", 2)
cyl.append([round(inward.x + 40, 1), round(inward.y + 10, 1), 3, 18, "tower", 2, 0])
# wildlife enclosure fence: painted line, about the 126.93 acre holding ground
hold = lp.buffer(-60)
hold = largest(hold) if not hold.is_empty else lp
scale_f = math.sqrt(126.93 * 4046.86 / hold.area) if hold.area > 126.93 * 4046.86 else 1.0
hold = affinity.scale(hold, scale_f, scale_f, origin=hold.centroid).intersection(lp.buffer(-30))
hold = largest(hold).simplify(8)
paint.append({"t": "fence", "p": [[round(a_, 1), round(b_, 1)] for a_, b_ in hold.exterior.coords], "ph": 2})

# ---------- wetland: boardwalk ----------
wp = largest(zp["wetland"])
line = LineString(list(wp.minimum_rotated_rectangle.exterior.coords)[:2])
bw = wp.buffer(-15)
if not bw.is_empty:
    bw = largest(bw)
    cl = bw.exterior.coords
    seg = LineString([cl[i] for i in range(0, len(cl), max(1, len(cl) // 40))][: len(cl) // 2 if len(cl) > 6 else len(cl)])
    paint.append({"t": "boardwalk", "p": [[round(a_, 1), round(b_, 1)] for a_, b_ in seg.coords], "ph": 2})

# ---------- bamboo & hemp ----------
bp = zp["bamboo"]
bpoly = largest(bp); a = axis_angle(bpoly)
def bam(x, y, i, j):
    if bpoly.contains(Point(x, y)) and (i % 4 != 0):
        trees.append([round(x, 1), round(y, 1), round(random.uniform(0.7, 1.0), 2), 1, 2])
grid_place(bpoly, 16, 16, a, bam, 3)
paint.append({"t": "rows", "p": [[round(a_, 1), round(b_, 1)] for a_, b_ in bpoly.exterior.coords], "a": round(a, 3), "s": 9, "ph": 2, "c": "#9fbf55"})

# ---------- utilities: solar rows + substation + water tower ----------
up = largest(zp["utilities"]); a = axis_angle(up); c = up.representative_point()
solar = up.buffer(-20)
solar = largest(solar) if not solar.is_empty else up
solar = largest(solar.intersection(c.buffer(math.sqrt(0.55 * up.area / math.pi))))
paint.append({"t": "solar", "p": [[round(a_, 1), round(b_, 1)] for a_, b_ in solar.exterior.coords], "a": round(a, 3), "s": 7, "ph": 1})
sx_, sy_ = solar.centroid.x, solar.centroid.y
add_box(sx_ + 0, sy_ - math.sqrt(solar.area) * 0.6, 30, 20, 6, a, "substation", 1) if up.contains(Point(sx_, sy_ - math.sqrt(solar.area) * 0.6)) else None
cyl.append([round(c.x + 50, 1), round(c.y + 50, 1), 7, 26, "watertower", 1, 0]) if up.contains(Point(c.x + 50, c.y + 50)) else None

# ---------- arena + motorsport course ----------
ap = largest(zp["arena"]); a = axis_angle(ap); c = ap.representative_point()
arena = {"x": round(c.x, 1), "y": round(c.y, 1), "rx": 95, "ry": 72, "h": 24, "a": round(a, 3), "ph": 2}
course = ap.buffer(-25)
course = largest(course).simplify(10) if not course.is_empty else ap
paint.append({"t": "circuit", "p": [[round(a_, 1), round(b_, 1)] for a_, b_ in course.exterior.coords], "ph": 2})

# ---------- golf course: 18 holes as fairway strokes ----------
gp = unary_union(zp["golf"])
g = largest(gp)
inner = g.buffer(-35)
inner = largest(inner)
holes = []
coords = list(inner.exterior.coords)
L = inner.exterior.length
n_holes = 18
for h in range(n_holes):
    t0 = (h / n_holes) * L; t1 = ((h + 0.82) / n_holes) * L
    p0 = inner.exterior.interpolate(t0); p1 = inner.exterior.interpolate(t1)
    # pull fairways inward alternately so they don't sit in a ring
    cen = inner.centroid
    k = 0.35 if h % 2 else 0.12
    q0 = (p0.x + (cen.x - p0.x) * k, p0.y + (cen.y - p0.y) * k)
    q1 = (p1.x + (cen.x - p1.x) * (0.47 - k), p1.y + (cen.y - p1.y) * (0.47 - k))
    holes.append([[round(q0[0], 1), round(q0[1], 1)], [round(q1[0], 1), round(q1[1], 1)]])
paint.append({"t": "golf", "holes": holes, "ph": 1})
# rough trees
def gtree(x, y, i, j):
    if g.contains(Point(x, y)) and random.random() < 0.28:
        near = min(LineString(hh).distance(Point(x, y)) for hh in holes)
        if near > 28:
            trees.append([round(x, 1), round(y, 1), round(random.uniform(0.7, 1.1), 2), 2, 1])
grid_place(g, 22, 22, 0, gtree, 6)
# clubhouse next to hotel
hc = largest(zp["hotel"]).centroid
cp = g.exterior.interpolate(g.exterior.project(hc))
add_box(cp.x + (g.centroid.x - cp.x) * 0.06, cp.y + (g.centroid.y - cp.y) * 0.06, 34, 20, 7, 0.0, "clubhouse", 1)

# ---------- internal roads: spine from north gate linking zone centres ----------
north_gate = max(bnd.exterior.coords, key=lambda q: q[1])
pts = {"gate": (north_gate[0], north_gate[1] - 20)}
for z in Z:
    if z["id"] not in ("forest", "wetland"):
        rp = largest(zp[z["id"]]).representative_point()
        pts[z["id"]] = (rp.x, rp.y)
# Prim's MST from the gate, penalising wetland crossings
names = list(pts)
in_tree = {"gate"}; edges = []
def cost(a_, b_):
    ln = LineString([pts[a_], pts[b_]])
    return ln.length + 6 * ln.intersection(zp["wetland"]).length
while len(in_tree) < len(names):
    best = min(((cost(u, v), u, v) for u in in_tree for v in names if v not in in_tree), key=lambda t: t[0])
    edges.append((best[1], best[2])); in_tree.add(best[2])
roads = []
for u, v in edges:
    (x0, y0), (x1, y1) = pts[u], pts[v]
    mx, my = (x0 + x1) / 2, (y0 + y1) / 2
    dx, dy = x1 - x0, y1 - y0
    bend = 0.12 * (1 if hash(u + v) % 2 else -1)
    cxp, cyp = mx - dy * bend, my + dx * bend
    seg = [(x0 + (cxp - x0) * 2 * t * (1 - t) / 1 * 1 + 0, 0) for t in []]
    poly = []
    for i in range(17):
        t = i / 16
        x = (1 - t) ** 2 * x0 + 2 * (1 - t) * t * cxp + t * t * x1
        y = (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cyp + t * t * y1
        poly.append([round(x, 1), round(y, 1)])
    roads.append({"p": poly, "ph": max(1, min(PHASE.get(u, 1), PHASE.get(v, 1)) if u != "gate" else 1)})

# ---------- context: existing buildings as oriented rectangles ----------
ctx_b = []
bc = bnd.centroid
for b in osm["buildings"]:
    try:
        P = Polygon(b)
        if not P.is_valid or P.area < 12:
            continue
        r = P.minimum_rotated_rectangle
        cc_ = list(r.exterior.coords)
        e1 = math.hypot(cc_[1][0] - cc_[0][0], cc_[1][1] - cc_[0][1])
        e2 = math.hypot(cc_[2][0] - cc_[1][0], cc_[2][1] - cc_[1][1])
        ang = math.atan2(cc_[1][1] - cc_[0][1], cc_[1][0] - cc_[0][0])
        ce = P.centroid
        near = 1 if ce.distance(bnd) < 1800 else 0
        ctx_b.append([round(ce.x, 1), round(ce.y, 1), round(e1, 1), round(e2, 1), round(ang, 2), near])
    except Exception:
        pass
inside_existing = sum(1 for b in ctx_b if bnd.contains(Point(b[0], b[1])))

ctx_roads = [{"c": r["c"], "n": r["n"], "p": [[round(a_), round(b_)] for a_, b_ in LineString(r["p"]).simplify(2).coords]} for r in osm["roads"]]
ctx_areas = [a_ for a_ in osm["areas"] if a_["k"] in ("wood", "water", "stadium", "pitch")]

landmarks = [
    {"n": "Hoima CBD", "ll": [1.4309760, 31.3525120]},
    {"n": "Kinubi", "ll": [1.4217892, 31.3685491]},
    {"n": "Kibati", "ll": [1.4074, 31.3500]},
    {"n": "Bunyoro University", "ll": [1.4006961, 31.3728286]},
    {"n": "Hoima City Stadium (AFCON 2027)", "ll": [1.4351605, 31.3936893]},
    {"n": "Mugenyi Private Library", "ll": [1.412144, 31.3648953], "own": True},
]
for lm in landmarks:
    lm["x"], lm["y"] = [round(v, 1) for v in to_local(*lm["ll"])]
    del lm["ll"]

# ---------- DEM ----------
dem = np.load(f"{B}/dem.npy")
dem_d = (np.round(dem * 10)).astype(int).tolist()

plan = {"boundary": json.load(open(f"{B}/boundary.json"))["boundary"], "zones": Z, "boxes": boxes, "cyl": cyl,
        "trees": trees, "paint": paint, "roads": roads, "arena": arena, "existing_inside": inside_existing}
ctx = {"roads": ctx_roads, "buildings": ctx_b, "areas": ctx_areas, "landmarks": landmarks,
       "frame": F, "dem": {"n": dem.shape[0], "dm": dem_d}}
json.dump(plan, open(f"{SITE}/data/plan.json", "w"), separators=(",", ":"))
json.dump(ctx, open(f"{SITE}/data/context.json", "w"), separators=(",", ":"))

g = Image.open(f"{B}/ground_raw.png").convert("RGB")
g = ImageEnhance.Contrast(g).enhance(1.25)
g = ImageEnhance.Brightness(g).enhance(1.12)
g.save(f"{SITE}/data/ground.jpg", quality=86)

print("boxes", len(boxes), "cyl", len(cyl), "trees", len(trees), "paint", len(paint), "roads", len(roads))
print("context buildings", len(ctx_b), "near", sum(b[5] for b in ctx_b), "existing inside boundary", inside_existing)
for f_ in os.listdir(f"{SITE}/data"):
    print(f_, round(os.path.getsize(f"{SITE}/data/{f_}") / 1024), "KB")
