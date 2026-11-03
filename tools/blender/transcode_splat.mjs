// Compress a Brush .ply into Spark's .spz and record it in the close-up manifest.
// Usage: node tools/blender/transcode_splat.mjs <in.ply> <capture.json> <out_dir>
import { readFile, writeFile, mkdir, rename } from "node:fs/promises";
import { transcodeSpz } from "@sparkjsdev/spark";

const MAX_SH = 1; // Brush trains with SH degree 1; higher bands would be empty bytes
const OPACITY_THRESHOLD = 0.02; // near-invisible splats only cost download

const [, , input, capturePath, outDir] = process.argv;
const capture = JSON.parse(await readFile(capturePath, "utf8"));
const fileBytes = new Uint8Array(await readFile(input));
const { fileBytes: spz } = await transcodeSpz({
  inputs: [{ fileBytes, fileType: "ply", pathOrUrl: input }],
  maxSh: MAX_SH,
  opacityThreshold: OPACITY_THRESHOLD,
});
await mkdir(outDir, { recursive: true });
const file = `${capture.zone}.spz`;
await writeFile(`${outDir}/${file}`, spz);
const header = new TextDecoder().decode(fileBytes.subarray(0, 2000));
const splats = Number(/element vertex (\d+)/.exec(header)?.[1] ?? 0);

const manifestPath = `${outDir}/manifest.json`;
let manifest = { zones: {} };
try {
  manifest = JSON.parse(await readFile(manifestPath, "utf8"));
} catch (e) {
  if (e.code !== "ENOENT") throw new Error(`manifest unreadable, fix or delete it: ${e.message}`);
}
const { zone, ...view } = capture;
manifest.zones[zone] = { file, bytes: spz.length, splats, ...view };
// Write then rename, so a crash never leaves a half-written manifest that loses every other district.
await writeFile(`${manifestPath}.tmp`, JSON.stringify(manifest));
await rename(`${manifestPath}.tmp`, manifestPath);
console.log(`${zone}: ply ${(fileBytes.length / 1e6).toFixed(1)} MB -> spz ${(spz.length / 1e6).toFixed(2)} MB, ${splats} splats`);
