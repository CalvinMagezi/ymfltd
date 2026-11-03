// Compress a Brush .ply into Spark's .spz and write the page's meta.json (YMF-3D-004 experiment).
// Usage: node tools/blender/transcode_splat.mjs <in.ply> <out_dir> <focusX> <focusY> <focusZ>
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { transcodeSpz } from "@sparkjsdev/spark";

const MAX_SH = 1; // Brush trained with SH degree 1; higher bands would be empty bytes
const OPACITY_THRESHOLD = 0.02; // near-invisible splats only cost download

const [, , input, outDir, fx, fy, fz] = process.argv;
const fileBytes = new Uint8Array(await readFile(input));
const { fileBytes: spz } = await transcodeSpz({
  inputs: [{ fileBytes, fileType: "ply", pathOrUrl: input }],
  maxSh: MAX_SH,
  opacityThreshold: OPACITY_THRESHOLD,
});
await mkdir(outDir, { recursive: true });
await writeFile(`${outDir}/town.spz`, spz);
const header = new TextDecoder().decode(fileBytes.subarray(0, 2000));
const splats = Number(/element vertex (\d+)/.exec(header)?.[1] ?? 0);
const meta = { file: "town.spz", bytes: spz.length, splats, focus: [Number(fx), Number(fy), Number(fz)] };
await writeFile(`${outDir}/meta.json`, JSON.stringify(meta));
console.log(`ply ${(fileBytes.length / 1e6).toFixed(1)} MB -> spz ${(spz.length / 1e6).toFixed(1)} MB, ${splats} splats`);
