/*
 * Renders the "land becomes the town" frame sequence for the home page (public/film).
 * It drives the real 3D explorer through its film(f, a, zoom) API, one frame per scroll step.
 *
 * 1. Run the site locally on port 3100 (bun run dev, or build and start).
 * 2. Desktop: node tools/film/render-frames.cjs d 1440 810 72 1 public/film/d
 *    Phone:   node tools/film/render-frames.cjs m 900 900 72 1.32 public/film/m
 * The timing (a short hold on today, then three eased phases) must match filmPhase() in components/home/Folio.tsx.
 * Uses the Playwright that ships with the machine; WebGL runs on SwiftShader, so it is slow but deterministic.
 */
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [,, set, W, H, N, zoom, outDir] = process.argv;
  fs.mkdirSync(outDir, { recursive: true });
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const pg = await b.newPage({ viewport: { width: +W, height: +H + 74 }, deviceScaleFactor: 1 });
  await pg.goto('http://localhost:3100/explore', { waitUntil: 'networkidle' });
  await pg.waitForFunction(() => window.__ymf, null, { timeout: 60000 });
  await pg.waitForTimeout(1500);
  const n = +N;
  const sm = (x) => x * x * (3 - 2 * x);
  for (let i = 0; i < n; i++) {
    const s = i / (n - 1);
    const u = Math.min(1, Math.max(0, (s - 0.1) / 0.82)) * 3;
    const k = Math.min(2, Math.floor(u)), fr = u - k;
    const f = u >= 3 ? 3 : k + sm(Math.min(1, fr));
    const data = await pg.evaluate(({ f, s, zoom }) => {
      window.__ymf.setSky('#e8e0cc');
      window.__ymf.film(f, s, zoom);
      const c = document.querySelector('canvas');
      return [c.width, c.height, c.toDataURL('image/webp', 0.62)];
    }, { f, s, zoom: +zoom });
    if (i === 0) console.log('size', data[0], data[1]);
    fs.writeFileSync(`${outDir}/${String(i).padStart(2, '0')}.webp`, Buffer.from(data[2].split(',')[1], 'base64'));
  }
  await b.close();
})();
