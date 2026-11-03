"""Build public/explore/upgrade: detailed buildings (meshopt glTF) and a baked shadow map per phase.

Run from the repo root:  python3 tools/blender/build_explore_assets.py
Needs blender, npx (for @gltf-transform/cli) and cwebp on the PATH.
"""
import json, os, shutil, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
WORK = os.path.join(HERE, ".work", "explore")
OUT = os.path.join(ROOT, "public", "explore", "upgrade")
PHASES = 4
GLTF_CLI = "@gltf-transform/cli@4"
LIGHTMAP_QUALITY = 70


def run(*cmd):
    subprocess.run(cmd, check=True, cwd=ROOT)


def blender(*argv):
    run("blender", "-b", "--python-exit-code", "1", "-P", os.path.join(HERE, "export_explore.py"), "--", *argv)


def main():
    os.makedirs(OUT, exist_ok=True)
    blender("--meshes")
    for k in range(PHASES):
        blender("--lightmap", str(k))
    welded = os.path.join(WORK, "buildings_welded.glb")
    run("npx", "-y", GLTF_CLI, "weld", os.path.join(WORK, "buildings_raw.glb"), welded)
    run("npx", "-y", GLTF_CLI, "meshopt", welded, os.path.join(OUT, "buildings.glb"))
    for k in range(PHASES):
        run("cwebp", "-quiet", "-q", str(LIGHTMAP_QUALITY), "-m", "6",
            os.path.join(WORK, f"lightmap_{k}.png"), "-o", os.path.join(OUT, f"shadow_{k}.webp"))
    bounds = json.load(open(os.path.join(WORK, "bounds.json")))
    manifest = {"buildings": "buildings.glb", "shadows": [f"shadow_{k}.webp" for k in range(PHASES)], "shadowBounds": bounds}
    with open(os.path.join(OUT, "manifest.json"), "w") as fh:
        json.dump(manifest, fh, separators=(",", ":"))
    for f in sorted(os.listdir(OUT)):
        print(f, os.path.getsize(os.path.join(OUT, f)) // 1024, "KB")


if __name__ == "__main__":
    main()
