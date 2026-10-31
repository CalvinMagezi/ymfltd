import plan from "@/public/explore/plan.json";
import { ZONE_SHORT } from "@/lib/content/zones";

/**
 * The acre ledger: one cell per acre of the 1,280, filled in the order the town is planned.
 * Sizes come from the draft land budget in the 3D concept model, not from a survey.
 */
export type LedgerZone = { id: string; name: string; acres: number; phase: number; color: string };

type PlanZone = { id: string; acres: number; phase: number; color: string };

const ORDER = ["forest", "wetland", "dairy", "housing", "golf", "utilities", "hotel", "hospital", "university", "arena", "bamboo", "heritage", "ecolodge", "agro", "commercial"];

export const LEDGER: LedgerZone[] = ORDER.map((id) => {
  const z = (plan.zones as PlanZone[]).find((q) => q.id === id)!;
  return { id, name: ZONE_SHORT[id] ?? id, acres: z.acres, phase: z.phase, color: z.color };
});

export const LEDGER_TOTAL = LEDGER.reduce((s, z) => s + z.acres, 0);

/** Acres in each phase, in fill order: today, then phases 1 to 3. */
export const PHASE_ACRES = [0, 1, 2, 3].map((ph) => LEDGER.filter((z) => z.phase === ph).reduce((s, z) => s + z.acres, 0));

export const LEDGER_COLS = 32;
export const LEDGER_ROWS = 40;
