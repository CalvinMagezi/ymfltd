"use client";

import { useEffect, useRef, useState } from "react";
import { LEDGER, LEDGER_TOTAL } from "@/lib/content/ledger";
import { drawGrid, zoneAt } from "./ledger-draw";

/** The finished acre ledger beside the draft land budget, for the colophon. */
export default function LedgerPlate() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [hot, setHot] = useState<string | null>(null);

  useEffect(() => {
    const draw = () => {
      if (!ref.current) return;
      const empty = getComputedStyle(document.documentElement).getPropertyValue("--ledger-empty").trim();
      drawGrid(ref.current, LEDGER_TOTAL, empty);
    };
    draw();
    const ro = new ResizeObserver(draw);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="plate">
      <canvas
        ref={ref}
        className="plate__grid"
        role="img"
        aria-label="All 1,280 acres, one square each, coloured by what the draft plan puts there"
        onPointerMove={(e) => setHot(zoneAt(e.currentTarget, e.clientX, e.clientY)?.id ?? null)}
        onPointerLeave={() => setHot(null)}
      />
      <ul className="plate__list">
        {LEDGER.map((z) => (
          <li key={z.id} className={hot === z.id ? "is-hot" : undefined}>
            <span className="plate__sw" style={{ background: z.color }} aria-hidden="true" />
            <span className="plate__name">{z.name}</span>
            <span className="plate__ac num">{z.acres}</span>
          </li>
        ))}
        <li className="plate__total">
          <span className="plate__name">Total</span>
          <span className="plate__ac num">{LEDGER_TOTAL.toLocaleString()}</span>
        </li>
      </ul>
    </div>
  );
}
