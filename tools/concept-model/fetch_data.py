"""Download context data for the YMF Kikwite concept model.

Area: 8 km x 8 km around Kikwite, southeast of Hoima CBD.
Sources: OpenStreetMap API (ODbL), AWS terrain tiles (terrarium, SRTM-derived),
EOX Sentinel-2 cloudless 2016 (CC BY 4.0).
"""
import math, os, time, subprocess, sys

OUT = os.path.join(os.path.dirname(__file__), "raw")
os.makedirs(OUT, exist_ok=True)

LAT_MIN, LAT_MAX = 1.368, 1.440
LON_MIN, LON_MAX = 31.328, 31.400


def curl(url, path, data=None):
    if os.path.exists(path) and os.path.getsize(path) > 0:
        return True
    cmd = ["curl", "-sS", "-m", "120", "-o", path, "-w", "%{http_code}", url]
    for attempt in range(3):
        r = subprocess.run(cmd, capture_output=True, text=True)
        if r.stdout.strip() == "200":
            return True
        time.sleep(2)
    print("FAILED", url, r.stdout, r.stderr[:200], file=sys.stderr)
    if os.path.exists(path):
        os.remove(path)
    return False


def tile_xy(lat, lon, z):
    n = 2 ** z
    x = (lon + 180) / 360 * n
    y = (1 - math.log(math.tan(math.radians(lat)) + 1 / math.cos(math.radians(lat))) / math.pi) / 2 * n
    return x, y


def tiles(z):
    x0, y0 = tile_xy(LAT_MAX, LON_MIN, z)
    x1, y1 = tile_xy(LAT_MIN, LON_MAX, z)
    return range(int(x0), int(x1) + 1), range(int(y0), int(y1) + 1)


# OSM API in a 4 x 4 grid of chunks
steps = 4
dlat = (LAT_MAX - LAT_MIN) / steps
dlon = (LON_MAX - LON_MIN) / steps
for i in range(steps):
    for j in range(steps):
        a, b = LAT_MIN + i * dlat, LON_MIN + j * dlon
        bbox = f"{b:.5f},{a:.5f},{b + dlon:.5f},{a + dlat:.5f}"
        ok = curl(f"https://api.openstreetmap.org/api/0.6/map?bbox={bbox}", f"{OUT}/osm_{i}_{j}.xml")
        print("osm", i, j, ok, flush=True)
        time.sleep(1)

# Terrain, z14
xs, ys = tiles(14)
for x in xs:
    for y in ys:
        curl(f"https://s3.amazonaws.com/elevation-tiles-prod/terrarium/14/{x}/{y}.png", f"{OUT}/dem_14_{x}_{y}.png")
print("dem tiles", len(xs) * len(ys), flush=True)

# Imagery, z15 (EOX Sentinel-2 cloudless 2016)
xs, ys = tiles(15)
for x in xs:
    for y in ys:
        curl(f"https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/g/15/{y}/{x}.jpg", f"{OUT}/img_15_{x}_{y}.jpg")
print("img tiles", len(xs) * len(ys), flush=True)
