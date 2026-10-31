"use client";

import { useEffect, useRef, useState } from "react";
import { PHASE_ACRES, LEDGER_TOTAL } from "@/lib/content/ledger";
import { drawBar, drawGrid, zoneAt } from "./ledger-draw";

import { filmPhase } from "./film-timing";

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

type Chapter = { num: string; title: string };

/**
 * The margin folio: chapter number and title, with the acre ledger beneath it.
 * Desktop: a column in the left margin. Phones: a small plate in the bottom corner.
 */
export default function Folio() {
  const grid = useRef<HTMLCanvasElement>(null);
  const bar = useRef<HTMLCanvasElement>(null);
  const [ch, setCh] = useState<Chapter | null>(null);
  const [tip, setTip] = useState<string | null>(null);
  const [filled, setFilled] = useState(0);

  useEffect(() => {
    let raf = 0, lastFilled = -1, lastKey = "";
    const empty = () => getComputedStyle(document.documentElement).getPropertyValue("--ledger-empty").trim() || "rgba(128,128,128,.25)";

    const read = () => {
      raf = 0;
      const vh = window.innerHeight;
      // current chapter
      const chapters = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));
      let cur: HTMLElement | null = null;
      for (const el of chapters) if (el.getBoundingClientRect().top <= vh * 0.45) cur = el;
      const key = cur?.dataset.chapter ?? "";
      if (key !== lastKey) {
        lastKey = key;
        setCh(cur && cur.dataset.num ? { num: cur.dataset.num, title: cur.dataset.title ?? "" } : null);
      }

      // ledger: today's acres fill through chapter I, the phases fill with the film in chapter III
      let n = 0;
      const today = document.querySelector<HTMLElement>("[data-ledger='today']");
      if (today) {
        const r = today.getBoundingClientRect();
        n += PHASE_ACRES[0] * clamp01((vh * 0.75 - r.top) / Math.max(r.height * 0.8, 1));
      }
      const film = document.querySelector<HTMLElement>("[data-ledger='film']");
      if (film) {
        const r = film.getBoundingClientRect();
        // follow the film player's eased playhead, so the ledger fills with the picture, not ahead of it
        const eased = (window as unknown as { __ymfFilmP?: number }).__ymfFilmP;
        const p = eased ?? clamp01(-r.top / Math.max(r.height - vh, 1));
        const f = filmPhase(p);
        for (let k = 1; k <= 3; k++) n += PHASE_ACRES[k] * clamp01(f - (k - 1));
        if (r.bottom < 0) n = LEDGER_TOTAL;
      }
      const whole = Math.round(n);
      if (whole !== lastFilled) {
        lastFilled = whole;
        setFilled(whole);
        const e = empty();
        if (grid.current) drawGrid(grid.current, whole, e);
        if (bar.current) drawBar(bar.current, whole, e);
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(read); };
    const onResize = () => { lastFilled = -1; onScroll(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("ymf:film", onScroll);
    window.addEventListener("resize", onResize);
    read();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("ymf:film", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const z = zoneAt(e.currentTarget, e.clientX, e.clientY);
    setTip(z ? `${z.name}, ${z.acres} acres` : null);
  };

  return (
    <aside className={`folio ${ch ? "is-on" : ""}`} aria-label="Where you are in the story">
      <a href="#contents" className="folio__head no-underline">
        <span className="folio__num">{ch?.num ?? ""}</span>
        <span className="folio__title">{ch?.title ?? ""}</span>
      </a>
      <div className="folio__ledger">
        <canvas
          ref={grid}
          className="folio__grid"
          onPointerMove={onMove}
          onPointerLeave={() => setTip(null)}
          role="img"
          aria-label={`Acre ledger: ${filled.toLocaleString()} of ${LEDGER_TOTAL.toLocaleString()} acres accounted for so far`}
        />
        <canvas ref={bar} className="folio__bar" aria-hidden="true" />
        <p className="folio__count num">
          <span>{filled.toLocaleString()}</span> of {LEDGER_TOTAL.toLocaleString()} acres
        </p>
        <p className="folio__tip" aria-live="polite">{tip ?? " "}</p>
      </div>
    </aside>
  );
}
