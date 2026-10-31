const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const smooth = (x: number) => x * x * (3 - 2 * x);

/**
 * Phase (0 today to 3 complete) shown at film progress p.
 * Same timing as the rendered frames (tools/film/render-frames.cjs): a short hold on today, then three eased phases.
 */
export function filmPhase(p: number) {
  const u = clamp01((p - 0.1) / 0.82) * 3;
  const k = Math.min(2, Math.floor(u));
  return u >= 3 ? 3 : k + smooth(Math.min(1, u - k));
}
