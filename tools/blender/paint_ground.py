# /// script
# requires-python = ">=3.11"
# dependencies = ["pillow", "numpy"]
# ///
"""Paint the ground texture for the Blender scene from the PUBLIC explore data only.

Ports paint() in lib/explore/engine.ts, including its phase fades, with quieter zone tints so the
3D buildings carry the picture. Never feed it ground_raw.png or the private site plan: the public
model must stay generalised.

Run from the repo root:
  uv run tools/blender/paint_ground.py 8192                 final phase, for stills
  uv run tools/blender/paint_ground.py 6144 --film          one texture per film frame
"""
import argparse, json, math, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from film_timing import FRAMES, frame_fa  # noqa: E402

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
SRC = os.path.join(ROOT, "public", "explore")
OUT = os.path.join(os.path.dirname(__file__), ".work")
DEFAULT_SIZE = 8192  # about 1 m per pixel over the 8 km frame
FILM_OVERLAY = 0.28  # strength of the not-yet-built plan in the film, as film() in engine.ts
_ap = argparse.ArgumentParser()
_ap.add_argument("size", nargs="?", type=int, default=DEFAULT_SIZE)
_ap.add_argument("--film", action="store_true", help="paint every film frame into .work/film_ground")
_ap.add_argument("--only", default="", help="film frames to paint, comma list; default all")
_ap.add_argument("--zone-fill", type=float, default=0.34, help="built zone tint; the film reads from further away")
ARGS = _ap.parse_args()
S = ARGS.size
PNG_COMPRESS = 3  # fast write; this is a working file, not a web asset

# Fills are about half the explorer's (0.62 zones, 0.32 forest) so under real light the ground reads
# as land, not a map; forest drops further because the trees already carry its colour.
ZONE_FILL = ARGS.zone_fill
FOREST_FILL = 0.2
ZONE_EDGE = 0.4
ZONE_EDGE_M = 2.5
ZONE_DASH_M = (10, 7)  # unbuilt zones get a dashed edge
# Explorer fills before and after a zone is built, which ZONE_FILL and FOREST_FILL scale down.
EXPLORER_FILL = {"zone": (0.2, 0.62), "forest": (0.16, 0.32)}
FEATHER_M = 55
DASH_EPS = 1e-6

# The remaining widths (m), colours and alphas are the explorer's paint() values (engine.ts:187-270).
CONTEXT_ROADS = [(1, 5, (244, 238, 224, 217)), (2, 10, (250, 230, 168, 242))]
WETLAND_FILL = ("#3f8f9a", 0.6)
WETLAND_STRIPES = dict(angle=0.6, spacing=26, fill=(190, 230, 232, 102), width=5)
GOLF = dict(fairway_m=34, fairway=(150, 200, 96, 242), green_r=15, green=(198, 238, 140, 255),
            bunker=(9, 6, 23, 14), sand=(239, 227, 180, 255), tee_half=5, tee=(185, 224, 124, 255))
SOLAR = dict(bed=(60, 70, 80, 89), rows=(36, 58, 92, 242), row_m=4.2)
ROWS_ALPHA, ROWS_M = 0.75, 3.5
CIRCUIT = dict(track_m=13, track=(70, 70, 72, 242), dash_m=6, line=(255, 255, 255, 204), line_m=1.2)
FENCE = dict(on_m=9, off_m=6, color=(240, 200, 120, 242), width_m=3)
BOARDWALK = dict(color=(130, 94, 58, 242), width_m=4)
PLAN_ROADS = [(12, (90, 84, 72, 230)), (9, (226, 220, 204, 250))]
UNBUILT_ROAD = dict(color=(240, 236, 224), alpha=0.75, width_m=3, dash_m=8)

# Phase state for the texture being painted: f runs 0 (today) to 3; ovl is the not-yet-built overlay.
STATE = {"f": 3.0, "ovl": 1.0}


def live(ph):
    """How built a phase is at the current f, as liveAmt() in engine.ts."""
    return 1.0 if ph <= 0 else max(0.0, min(1.0, STATE["f"] - (ph - 1)))

plan = json.load(open(f"{SRC}/plan.json"))
ctx = json.load(open(f"{SRC}/context.json"))
HW, HH = ctx["frame"]["half_w"], ctx["frame"]["half_h"]
K = S / (2 * HW)


def px(q):
    return ((q[0] + HW) / (2 * HW) * S, (HH - q[1]) / (2 * HH) * S)


def rgba(hex_or_rgb, a):
    if isinstance(hex_or_rgb, str):
        n = int(hex_or_rgb[1:], 16)
        hex_or_rgb = ((n >> 16) & 255, (n >> 8) & 255, n & 255)
    return (*hex_or_rgb, round(255 * a))


def layer():
    im = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    return im, ImageDraw.Draw(im)


def mask_alpha(im, mask):
    """Scale an RGBA image's alpha by an L mask, so fills and clips blend instead of overwriting."""
    a = np.asarray(im.getchannel("A"), np.uint16) * np.asarray(mask, np.uint16) // 255
    im.putalpha(Image.fromarray(a.astype(np.uint8)))


def fade(im, alpha):
    if alpha < 1:
        a = np.asarray(im.getchannel("A"), np.float32) * alpha
        im.putalpha(Image.fromarray(a.astype(np.uint8)))


def on_layer(base, draw, alpha=1.0):
    """Draw on a transparent layer and blend it onto base; ImageDraw on RGBA overwrites, it does not blend."""
    im, g = layer()
    draw(g)
    fade(im, alpha)
    base.alpha_composite(im)


def m(width_m):
    return max(1, round(width_m * K))


def poly_mask(polys):
    m = Image.new("L", (S, S), 0)
    d = ImageDraw.Draw(m)
    for p in polys:
        d.polygon([px(q) for q in p["o"]], fill=255)
        for h in p["h"]:
            d.polygon([px(q) for q in h], fill=0)
    return m


def dashed(d, pts, on, off, fill, width, closed=False):
    pts = [px(q) for q in pts] + ([px(pts[0])] if closed else [])
    carry, draw_on = 0.0, True
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        seg = math.hypot(x1 - x0, y1 - y0)
        t = 0.0
        while t < seg:
            step = min((on if draw_on else off) - carry, seg - t)
            if draw_on:
                a, b = t / seg, (t + step) / seg
                d.line([(x0 + (x1 - x0) * a, y0 + (y1 - y0) * a), (x0 + (x1 - x0) * b, y0 + (y1 - y0) * b)], fill=fill, width=width)
            t += step
            carry += step
            if carry >= (on if draw_on else off) - DASH_EPS:
                carry, draw_on = 0.0, not draw_on


def stripes(base, ring, angle, spacing, fill, width, alpha=1.0):
    """Parallel lines clipped to a ring, as stripes() in engine.ts."""
    im, d = layer()
    xs, ys = [q[0] for q in ring], [q[1] for q in ring]
    mx, my = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
    r = math.hypot(max(xs) - min(xs), max(ys) - min(ys))
    ca, sa = math.cos(angle), math.sin(angle)
    v = -r
    while v <= r:
        d.line([px((mx - r * ca - v * sa, my - r * sa + v * ca)), px((mx + r * ca - v * sa, my + r * sa + v * ca))], fill=fill, width=max(1, round(width * K)))
        v += spacing
    mask_alpha(im, poly_mask([{"o": ring, "h": []}]))
    fade(im, alpha)
    base.alpha_composite(im)


def paint_context_roads(ground):
    for cls, width, fill in CONTEXT_ROADS:
        on_layer(ground, lambda g: [g.line([px(q) for q in r["p"]], fill=fill, width=m(width), joint="curve")
                                    for r in ctx["roads"] if r["c"] == cls])


def zone_fill(z, a):
    """Fill alpha for a zone a share a built, scaling the explorer's off and on fills to this scene's tint."""
    if z["id"] == "wetland":
        return WETLAND_FILL[1]
    key, target = ("forest", FOREST_FILL) if z["id"] == "forest" else ("zone", ZONE_FILL)
    off, on = (v * target / EXPLORER_FILL[key][1] for v in EXPLORER_FILL[key])
    ovl = STATE["ovl"]
    return off * ovl + (on - off * ovl) * a


def paint_zones(top):
    for z in plan["zones"]:
        a = live(z["phase"])
        color = WETLAND_FILL[0] if z["id"] == "wetland" else z["color"]
        fill = Image.new("RGBA", (S, S), rgba(color, zone_fill(z, a)))
        mask_alpha(fill, poly_mask(z["polys"]))
        top.alpha_composite(fill)
        rings = [r for p in z["polys"] for r in [p["o"], *p["h"]]]
        edge = (255, 255, 255, round(255 * ZONE_EDGE * max(a, STATE["ovl"])))
        if a >= 0.999:
            on_layer(top, lambda g: [g.line([px(q) for q in r + [r[0]]], fill=edge, width=m(ZONE_EDGE_M), joint="curve") for r in rings])
        else:
            on_layer(top, lambda g: [dashed(g, r, ZONE_DASH_M[0] * K, ZONE_DASH_M[1] * K, edge, m(ZONE_EDGE_M), closed=True) for r in rings])
        if z["id"] == "wetland":
            for p in z["polys"]:
                stripes(top, p["o"], **WETLAND_STRIPES)


def draw_golf(g, f):
    G = GOLF
    for h in f["holes"]:
        g.line([px(q) for q in h], fill=G["fairway"], width=m(G["fairway_m"]), joint="curve")
    for h in f["holes"]:
        ex, ey = px(h[1])
        r = G["green_r"] * K
        g.ellipse([ex - r, ey - r, ex + r, ey + r], fill=G["green"])
        b = G["bunker"]
        g.ellipse([ex + b[0] * K, ey + b[1] * K, ex + b[2] * K, ey + b[3] * K], fill=G["sand"])
        sx, sy = px(h[0])
        t = G["tee_half"] * K
        g.rectangle([sx - t, sy - t, sx + t, sy + t], fill=G["tee"])


def paint_feature(top, f):
    fa = live(f["ph"])
    if fa <= 0:
        return
    t = f["t"]
    if t == "golf":
        on_layer(top, lambda g: draw_golf(g, f), fa)
    elif t == "solar":
        on_layer(top, lambda g: g.polygon([px(q) for q in f["p"]], fill=SOLAR["bed"]), fa)
        stripes(top, f["p"], f["a"], f["s"], SOLAR["rows"], SOLAR["row_m"], fa)
    elif t == "rows":
        stripes(top, f["p"], f["a"], f["s"], rgba(f["c"], ROWS_ALPHA), ROWS_M, fa)
    elif t == "circuit":
        C = CIRCUIT
        on_layer(top, lambda g: (g.line([px(q) for q in f["p"] + [f["p"][0]]], fill=C["track"], width=m(C["track_m"]), joint="curve"),
                                 dashed(g, f["p"], C["dash_m"] * K, C["dash_m"] * K, C["line"], m(C["line_m"]), closed=True)), fa)
    elif t == "fence":
        on_layer(top, lambda g: dashed(g, f["p"], FENCE["on_m"] * K, FENCE["off_m"] * K, FENCE["color"], m(FENCE["width_m"]), closed=True), fa)
    elif t == "boardwalk":
        on_layer(top, lambda g: g.line([px(q) for q in f["p"]], fill=BOARDWALK["color"], width=m(BOARDWALK["width_m"]), joint="curve"), fa)


def paint_plan_roads(top):
    """Built roads fade in by phase; the unbuilt rest shows as a faint dashed line, as in the explorer."""
    for r in plan["roads"]:
        ra = live(r["ph"])
        if ra > 0:
            for width, fill in PLAN_ROADS:
                on_layer(top, lambda g: g.line([px(q) for q in r["p"]], fill=fill, width=m(width), joint="curve"), ra)
        if ra < 1:
            U = UNBUILT_ROAD
            col = (*U["color"], round(255 * U["alpha"] * STATE["ovl"] * (1 - ra)))
            on_layer(top, lambda g: dashed(g, r["p"], U["dash_m"] * K, U["dash_m"] * K, col, m(U["width_m"])))


def paint(base, union, f, ovl, out):
    STATE["f"], STATE["ovl"] = f, ovl
    top = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    paint_zones(top)
    for feat in plan["paint"]:
        paint_feature(top, feat)
    paint_plan_roads(top)
    mask_alpha(top, union)
    ground = base.copy()
    ground.alpha_composite(top)
    ground.convert("RGB").save(out, optimize=False, compress_level=PNG_COMPRESS)
    print(out, f"f={f:.3f}", round(os.path.getsize(out) / 1e6, 1), "MB", flush=True)


def main():
    base = Image.open(f"{SRC}/ground.webp").convert("RGBA").resize((S, S), Image.BICUBIC)
    paint_context_roads(base)
    # Feather the outside edge of the site, as the explorer does, so it reads as a concept, not a survey line.
    union = poly_mask([p for z in plan["zones"] for p in z["polys"]]).filter(ImageFilter.GaussianBlur(FEATHER_M * K))
    if not ARGS.film:
        os.makedirs(OUT, exist_ok=True)
        paint(base, union, 3.0, 1.0, f"{OUT}/ground_{S}.png")
        return
    out_dir = f"{OUT}/film_ground"
    os.makedirs(out_dir, exist_ok=True)
    done = {}
    only = {int(v) for v in ARGS.only.split(",")} if ARGS.only else set(range(FRAMES))
    for i in sorted(only):
        f, _ = frame_fa(i)
        out = f"{out_dir}/{i:02d}.png"
        if f in done:
            # Held frames (today, and the finished town) share one texture.
            if os.path.lexists(out):
                os.remove(out)
            os.symlink(os.path.basename(done[f]), out)
            continue
        paint(base, union, f, FILM_OVERLAY, out)
        done[f] = out


if __name__ == "__main__":
    main()
