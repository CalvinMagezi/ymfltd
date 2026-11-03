# Tech debt

| Item | Reason skipped | Date | File:line |
|------|----------------|------|-----------|
| Buildings built with Python meshes, not Geometry Nodes | Spike needed a reproducible scene fast; meshes with metre UVs also export cleanly to glTF later | 2026-11-03 | tools/blender/build_scene.py:378 |
| Solar farm, crop rows and golf course are painted on the ground, not modelled in 3D | Out of spike scope; needed before the film re-render (YMF-3D-002) | 2026-11-03 | tools/blender/paint_ground.py:125 |
| No aerial haze or depth falloff in Cycles renders | Volume scattering at kilometre scale costs render time; try a light world volume or mist pass in YMF-3D-002 | 2026-11-03 | tools/blender/build_scene.py |
| Blender scene renders only the final phase; film(f, a) phase rise and the phone zoom (1.32) are not ported | Spike compared the final frame only; both needed to re-render the home film | 2026-11-03 | tools/blender/build_scene.py |
| No terrain skirt or base plane under the Blender terrain (engine.ts:126-150 has one) | Hospital and film cameras never see the frame edge; add before rendering hero or wide zone views | 2026-11-03 | tools/blender/build_scene.py |
| Zone views do not draw the explorer's selected-zone outline | A white survey outline fights the realistic look; decide per still in YMF-3D-002 | 2026-11-03 | tools/blender/paint_ground.py |
| Golf bunker ellipse is axis-aligned; the explorer rotates it 0.5 rad | Pillow ellipses cannot rotate; invisible at film distance | 2026-11-03 | tools/blender/paint_ground.py |
| Ground painter allocates full-size layers per feature (about 0.5 GB peak at 8192) | Runs in seconds on this Mac; crop layers to feature bounds if it moves to a smaller machine | 2026-11-03 | tools/blender/paint_ground.py |
