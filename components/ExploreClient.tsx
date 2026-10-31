"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Explorer, Zone } from "@/lib/explore/engine";
import { PHASES, TOUR, ZONE_INFO, ZONE_PROJECT } from "@/lib/content/zones";

type Card =
  | { kind: "intro" }
  | { kind: "zone"; zone: Zone }
  | { kind: "tour"; i: number }
  | null;

const PHASE_LABEL = ["Today", "Phase 1", "Phase 2", "Phase 3"];

export default function ExploreClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const exRef = useRef<Explorer | null>(null);
  const demoRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const params = useSearchParams();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhaseState] = useState(3);
  const [card, setCard] = useState<Card>({ kind: "intro" });
  const [zones, setZones] = useState<Zone[]>([]);
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [labels, setLabels] = useState(true);
  const selectedId = card?.kind === "zone" ? card.zone.id : card?.kind === "tour" ? TOUR[card.i].zone : null;

  const setPhase = useCallback((p: number, animate = true) => {
    setPhaseState(p);
    exRef.current?.setPhase(p, animate);
  }, []);

  const openZone = useCallback((z: Zone, fly: boolean) => {
    if (demoRef.current) clearTimeout(demoRef.current);
    setCard({ kind: "zone", zone: z });
    exRef.current?.select(z.id, fly);
  }, []);

  const goTour = useCallback((i: number) => {
    const ex = exRef.current;
    if (!ex) return;
    if (demoRef.current) clearTimeout(demoRef.current);
    const stop = TOUR[i];
    setCard({ kind: "tour", i });
    if (stop.phaseDemo) {
      setPhase(0, false);
      let k = 0;
      const step = () => { k++; if (k > 3) return; setPhase(k, true); demoRef.current = setTimeout(step, 1700); };
      demoRef.current = setTimeout(step, 1300);
    } else if (phase !== 3) setPhase(3, true);
    ex.select(stop.zone, true);
  }, [phase, setPhase]);

  useEffect(() => {
    let disposed = false;
    const canvas = canvasRef.current!, labelsEl = labelsRef.current!;
    const sky = getComputedStyle(document.documentElement).getPropertyValue("--sky").trim() || "#d7e3e6";
    const small = Math.min(window.innerWidth, window.innerHeight) < 700 || (navigator.hardwareConcurrency || 8) <= 4;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    import("@/lib/explore/engine")
      .then(({ createExplorer }) => createExplorer(canvas, labelsEl, { base: "/explore", sky, small, reduceMotion }))
      .then((ex) => {
        if (disposed) { ex.dispose(); return; }
        exRef.current = ex;
        (window as unknown as { __ymf: Explorer }).__ymf = ex;
        setZones(ex.zones);
        ex.onPick((z) => {
          if (!z) return;
          if (demoRef.current) clearTimeout(demoRef.current);
          setCard({ kind: "zone", zone: z });
          ex.select(z.id, false);
        });
        setReady(true);
        const zid = new URLSearchParams(window.location.search).get("zone");
        const z = zid ? ex.zones.find((q) => q.id === zid) : null;
        if (z) { setCard({ kind: "zone", zone: z }); ex.select(z.id, true); }
      })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => {
      const c = getComputedStyle(document.documentElement).getPropertyValue("--sky").trim();
      (exRef.current as unknown as { setSky?: (c: string) => void })?.setSky?.(c);
    };
    mq.addEventListener("change", onScheme);
    return () => {
      disposed = true;
      mq.removeEventListener("change", onScheme);
      if (demoRef.current) clearTimeout(demoRef.current);
      exRef.current?.dispose();
      exRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const zid = params.get("zone");
    const z = zid ? zones.find((q) => q.id === zid) : null;
    if (z) openZone(z, true);
  }, [params, ready, zones, openZone]);

  useEffect(() => { exRef.current?.showLabels(labels); }, [labels]);
  useEffect(() => { setBudgetOpen(window.matchMedia("(min-width: 1024px)").matches); }, []);

  const closeCard = () => {
    if (demoRef.current) clearTimeout(demoRef.current);
    setCard(null);
    exRef.current?.select(null, false);
  };

  const order = [...zones].sort((a, b) => a.phase - b.phase || b.acres - a.acres);
  const total = zones.reduce((s, z) => s + z.acres, 0);

  return (
    <div className="relative h-[calc(100dvh-74px-env(safe-area-inset-top,0px))] min-h-[520px] overflow-hidden bg-[var(--sky)]">
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full touch-none" aria-label="3D concept model of New Kikwite Town. Drag to turn, scroll or pinch to zoom." />
      <div ref={labelsRef} className="pointer-events-none absolute inset-0 overflow-hidden" />

      {!ready && (
        <div className="absolute inset-0 grid place-items-center bg-paper">
          <p className="font-mono text-sm text-muted">{error ? `The model could not load (${error}). Reload the page to try again.` : "Loading the terrain model…"}</p>
        </div>
      )}

      {/* Phase control */}
      <div className="absolute left-4 top-4 z-10 grid w-[min(330px,calc(100%-2rem))] gap-2 rounded-[14px] border border-line bg-card/95 p-3 shadow-lg backdrop-blur" style={{ left: "max(16px, env(safe-area-inset-left, 0px))" }}>
        <div className="grid grid-cols-4 overflow-hidden rounded-lg border border-line" role="group" aria-label="Show the town at">
          {PHASE_LABEL.map((l, i) => (
            <button
              key={l}
              type="button"
              aria-pressed={phase === i}
              onClick={() => { if (demoRef.current) clearTimeout(demoRef.current); setPhase(i); }}
              className={`border-r border-line px-1 py-2 text-[13px] font-semibold last:border-r-0 ${phase === i ? "bg-gold-strong text-gold-ink" : "hover:bg-paper-2"}`}
            >
              {l}
            </button>
          ))}
        </div>
        <p className="text-[13px] leading-snug text-muted">{PHASES[phase].note}</p>
      </div>

      {/* Land budget */}
      <aside
        aria-label="Draft land budget"
        hidden={!budgetOpen}
        className="absolute right-4 top-4 z-20 flex max-h-[calc(100%-2rem)] w-[min(320px,calc(100%-2rem))] flex-col rounded-[14px] border border-line bg-card/95 shadow-lg backdrop-blur max-lg:bottom-[4.25rem] max-lg:top-auto max-lg:max-h-[55%]"
        style={{ right: "max(16px, env(safe-area-inset-right, 0px))" }}
      >
        <header className="flex items-baseline justify-between gap-2 border-b border-line px-4 py-3">
          <h2 className="text-[15px] font-semibold">Land budget, draft</h2>
          <span className="num font-mono text-[12px] text-muted">{total.toLocaleString()} acres</span>
          <button type="button" className="text-muted lg:hidden" onClick={() => setBudgetOpen(false)} aria-label="Close land budget">×</button>
        </header>
        <ol className="overflow-y-auto p-1.5">
          {order.map((z) => (
            <li key={z.id}>
              <button
                type="button"
                onClick={() => { openZone(z, true); if (!window.matchMedia("(min-width: 1024px)").matches) setBudgetOpen(false); }}
                aria-current={selectedId === z.id}
                className={`grid w-full grid-cols-[12px_1fr_auto] items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-[13.5px] leading-tight hover:bg-paper-2 aria-[current=true]:bg-paper-2 ${z.phase > phase ? "text-muted" : ""}`}
              >
                <span className="h-3 w-3 rounded-[3px] ring-1 ring-black/15" style={{ background: z.color }} />
                <span>{z.name}</span>
                <span className="num font-mono text-[11.5px] text-muted">{z.acres} ac · {z.phase === 0 ? "Today" : `P${z.phase}`}</span>
              </button>
            </li>
          ))}
        </ol>
        <p className="border-t border-line px-4 py-2.5 text-[12px] leading-snug text-muted">A starting allocation for the family to change. Lighter rows are not yet built at the selected phase.</p>
      </aside>

      {/* Info card */}
      {card && (
        <section aria-live="polite" className="absolute bottom-16 left-1/2 z-10 grid w-[min(560px,calc(100%-2rem))] -translate-x-1/2 gap-2 rounded-[14px] border border-line bg-card/95 p-4 pr-10 shadow-lg backdrop-blur max-sm:bottom-[4.25rem] max-sm:max-h-[42%] max-sm:overflow-y-auto">
          <button type="button" onClick={closeCard} className="absolute right-2 top-2 rounded px-2 py-1 text-lg leading-none text-muted hover:bg-paper-2" aria-label="Close">×</button>
          {card.kind === "intro" && (
            <>
              <p className="eyebrow !text-gold">Concept model</p>
              <h2 className="text-lg font-semibold">Walk the plan for the Foundation land</h2>
              <p className="text-[15px] leading-snug">Drag to turn, scroll or pinch to zoom, and tap any area to read about it. The tour visits each part of the town in eight short stops.</p>
              <div className="mt-1"><button type="button" className="btn btn-primary" onClick={() => goTour(0)}>Start the tour</button></div>
            </>
          )}
          {card.kind === "zone" && (
            <>
              <p className="eyebrow !text-gold">Area · {card.zone.acres} acres · {PHASE_LABEL[card.zone.phase]}</p>
              <h2 className="text-lg font-semibold">{card.zone.name}</h2>
              <p className="text-[15px] leading-snug">{ZONE_INFO[card.zone.id]}</p>
              {ZONE_PROJECT[card.zone.id] && (
                <div className="mt-1"><Link href={`/projects/${ZONE_PROJECT[card.zone.id]}`} className="btn">Read about this project</Link></div>
              )}
            </>
          )}
          {card.kind === "tour" && (
            <>
              <p className="eyebrow flex justify-between !text-gold"><span>Guided tour</span><span className="num">{card.i + 1} of {TOUR.length}</span></p>
              <h2 className="text-lg font-semibold">{TOUR[card.i].title}</h2>
              <p className="text-[15px] leading-snug">{TOUR[card.i].text}</p>
              <div className="mt-1 flex justify-end gap-2">
                <button type="button" className="btn" disabled={card.i === 0} onClick={() => goTour(card.i - 1)}>Back</button>
                {card.i < TOUR.length - 1 ? (
                  <button type="button" className="btn btn-primary" onClick={() => goTour(card.i + 1)}>Next</button>
                ) : (
                  <button type="button" className="btn btn-primary" onClick={() => { closeCard(); setPhase(3); exRef.current?.overview(); }}>Finish</button>
                )}
              </div>
            </>
          )}
        </section>
      )}

      {/* Tools */}
      <div className="absolute bottom-4 z-10 flex max-w-[calc(100%-2rem)] gap-2 overflow-x-auto max-sm:[&_.btn]:px-3 max-sm:[&_.btn]:text-[14px]" style={{ left: "max(16px, env(safe-area-inset-left, 0px))" }}>
        <button type="button" className="btn btn-primary !py-2.5 shadow" onClick={() => goTour(0)}>Tour</button>
        <button type="button" className="btn !py-2.5 shadow lg:hidden" aria-expanded={budgetOpen} onClick={() => setBudgetOpen((o) => !o)}>Land budget</button>
        <button type="button" className="btn !py-2.5 shadow" onClick={() => exRef.current?.overview()}>Reset view</button>
        <button type="button" className="btn !py-2.5 shadow" aria-pressed={labels} onClick={() => setLabels((l) => !l)}>Labels</button>
      </div>
    </div>
  );
}
