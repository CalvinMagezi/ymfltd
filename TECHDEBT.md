# Tech debt

| Item | Reason skipped | Date | File:line |
|------|----------------|------|-----------|
| Buildings built with Python meshes, not Geometry Nodes | Spike needed a reproducible scene fast; meshes with metre UVs also export cleanly to glTF later | 2026-11-03 | tools/blender/build_scene.py:378 |
| Solar farm, crop rows and golf course are painted on the ground, not modelled in 3D | Not done in the spike or the film re-render (YMF-3D-002); the film ships with the painted versions | 2026-11-03 | tools/blender/paint_ground.py:125 |
| No aerial haze or depth falloff in Cycles renders | Volume scattering at kilometre scale costs render time; the film raised the sun and used AgX Punchy instead; try a light world volume or mist pass next | 2026-11-03 | tools/blender/build_scene.py |
| Zone views do not draw the explorer's selected-zone outline | A white survey outline fights the realistic look; stills shipped without it in YMF-3D-002 | 2026-11-03 | tools/blender/paint_ground.py |
| Golf bunker ellipse is axis-aligned; the explorer rotates it 0.5 rad | Pillow ellipses cannot rotate; invisible at film distance | 2026-11-03 | tools/blender/paint_ground.py |
| Film buildings read grey from film distance (glass and solar roofs), where the old film showed white boxes | Calvin chose to ship this look on 3 Nov 2026; lighter roofs or a closer camera would help | 2026-11-03 | tools/blender/build_scene.py |
| Ground painter allocates full-size layers per feature (about 0.5 GB peak at 8192) | Runs in seconds on this Mac; crop layers to feature bounds if it moves to a smaller machine | 2026-11-03 | tools/blender/paint_ground.py |
