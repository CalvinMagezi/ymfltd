import { LEDGER, LEDGER_COLS, LEDGER_ROWS, type LedgerZone } from "@/lib/content/ledger";

/** Zone for each acre cell, row by row, in planning order. */
export const CELL_ZONE: LedgerZone[] = (() => {
  const out: LedgerZone[] = [];
  for (const z of LEDGER) for (let i = 0; i < z.acres; i++) out.push(z);
  return out;
})();

/** Draw the 32 by 40 acre grid with `filled` cells coloured. Sizes the canvas to its box. */
export function drawGrid(c: HTMLCanvasElement, filled: number, empty: string) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = c.clientWidth, h = c.clientHeight;
  if (!w || !h) return;
  if (c.width !== Math.round(w * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
  const g = c.getContext("2d")!;
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.clearRect(0, 0, w, h);
  const cs = Math.min(w / LEDGER_COLS, h / LEDGER_ROWS);
  const gap = cs >= 6 ? 1 : cs >= 3 ? 0.5 : 0;
  for (let i = 0; i < CELL_ZONE.length; i++) {
    const x = (i % LEDGER_COLS) * cs, y = Math.floor(i / LEDGER_COLS) * cs;
    g.fillStyle = i < filled ? CELL_ZONE[i].color : empty;
    g.fillRect(x, y, cs - gap, cs - gap);
  }
}

/** The ledger as one thin bar, for phones. */
export function drawBar(c: HTMLCanvasElement, filled: number, empty: string) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = c.clientWidth, h = c.clientHeight;
  if (!w || !h) return;
  if (c.width !== Math.round(w * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
  const g = c.getContext("2d")!;
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.clearRect(0, 0, w, h);
  g.fillStyle = empty;
  g.fillRect(0, 0, w, h);
  let at = 0;
  for (const z of LEDGER) {
    const take = Math.max(0, Math.min(z.acres, filled - at));
    if (take > 0) {
      g.fillStyle = z.color;
      g.fillRect((at / CELL_ZONE.length) * w, 0, (take / CELL_ZONE.length) * w + 0.5, h);
    }
    at += z.acres;
  }
}

/** Which zone sits under a point on the grid canvas. */
export function zoneAt(c: HTMLCanvasElement, clientX: number, clientY: number): LedgerZone | null {
  const r = c.getBoundingClientRect();
  const cs = Math.min(r.width / LEDGER_COLS, r.height / LEDGER_ROWS);
  const col = Math.floor((clientX - r.left) / cs), row = Math.floor((clientY - r.top) / cs);
  if (col < 0 || col >= LEDGER_COLS || row < 0 || row >= LEDGER_ROWS) return null;
  return CELL_ZONE[row * LEDGER_COLS + col] ?? null;
}
