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
| Explorer upgrade uses WebP shadow maps and no HDRI, where the task named KTX2 and HDRI | The shadow maps are multiplied into the existing 2D ground canvas, which cannot draw KTX2; an HDRI would add a PMREM pass and shader cost on phones for Lambert materials that would not use it | 2026-11-03 | lib/explore/engine.ts |
| Baked shadows switch at once when the phase changes while buildings rise over 0.9 s | Cross-fading two maps would repaint the 2048 px ground canvas every frame of the rise | 2026-11-03 | lib/explore/engine.ts |
| Explorer upgrade waits for the first interaction or 12 s | Swapping in the new shader and re-uploading the ground costs about 3 s on Lighthouse's software GL, which would land inside its load window | 2026-11-03 | lib/explore/engine.ts |
| Live solar roofs are a flat blue-grey, not panel rows | Rows would need roof UVs and more shader work; the colour reads as solar from the explorer's distance | 2026-11-03 | tools/blender/export_explore.py |
