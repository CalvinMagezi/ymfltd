"use client";

import { useEffect, useRef } from "react";
import { filmPhase } from "./film-timing";

type Props = { desktop: string; mobile: string; count: number };

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const frameUrl = (tpl: string, i: number) => tpl.replace("{ii}", String(i).padStart(2, "0"));

/**
 * Plays the "land becomes the town" frames under the reader's scroll.
 * The playhead eases toward the scroll position instead of jumping with each wheel notch,
 * and neighbouring frames are cross-faded, so buildings rise and the camera glides.
 * The pin itself is still scroll-craft's (data-sc-act on the section); only the drawing lives here.
 */
export default function FilmPlayer({ desktop, mobile, count }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const section = canvas?.closest<HTMLElement>("[data-ledger='film']");
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tpl = window.matchMedia("(max-width: 860px)").matches ? mobile : desktop;
    const frames: (HTMLImageElement | null)[] = new Array(count).fill(null);
    let dead = false, raf = 0, near = false, loading = false;
    let cur = -1, drawnPos = -1, dirty = true, last = performance.now();

    // ---- loading: start once the reader is into chapter I, or when the film is close
    const load = () => {
      if (loading) return;
      loading = true;
      let next = 0;
      const pump = () => {
        if (dead || next >= count) return;
        const i = next++;
        const img = new Image();
        img.decoding = "async";
        img.src = frameUrl(tpl, i);
        const done = () => { frames[i] = img; dirty = true; if (near) start(); pump(); };
        img.decode().then(done, () => { img.onload = done; img.onerror = () => pump(); if (img.complete) done(); });
      };
      pump(); pump(); pump();
    };
    const first = document.querySelector("#ch-i");
    const warmIO = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { load(); warmIO.disconnect(); } }, { rootMargin: "0px 0px -35% 0px" });
    if (first) warmIO.observe(first);
    const nearIO = new IntersectionObserver((es) => {
      near = es.some((e) => e.isIntersecting);
      if (near) { load(); start(); }
    }, { rootMargin: "100% 0px 100% 0px" });
    nearIO.observe(section);

    // ---- sizing
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
      if (w && h && (canvas.width !== w || canvas.height !== h)) { canvas.width = w; canvas.height = h; dirty = true; }
    };
    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    size();

    const cover = (img: HTMLImageElement, alpha: number) => {
      const cw = canvas.width, ch = canvas.height;
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * s, h = img.naturalHeight * s;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
      ctx.globalAlpha = 1;
    };
    const nearestLoaded = (i: number) => {
      for (let d = 0; d < count; d++) {
        if (frames[i - d]) return i - d;
        if (frames[i + d]) return i + d;
      }
      return -1;
    };

    const progress = () => {
      const r = section.getBoundingClientRect();
      return clamp01(-r.top / Math.max(r.height - window.innerHeight, 1));
    };

    const publish = (p: number) => {
      const f = filmPhase(p);
      const active = f < 0.25 ? 0 : Math.min(3, Math.ceil(f - 0.25));
      if (section.dataset.phase !== String(active)) section.dataset.phase = String(active);
      (window as unknown as { __ymfFilmP?: number }).__ymfFilmP = p;
      window.dispatchEvent(new Event("ymf:film"));
    };

    const tick = (now: number) => {
      raf = 0;
      if (dead) return;
      const dt = Math.min(64, now - last);
      last = now;
      const target = progress();
      if (cur < 0 || reduce) cur = target;
      else cur += (target - cur) * (1 - Math.exp(-dt / 140));
      if (Math.abs(target - cur) < 0.0004) cur = target;

      const pos = cur * (count - 1);
      if (dirty || Math.abs(pos - drawnPos) > 0.002) {
        const i0 = Math.floor(pos), t = pos - i0;
        const a = frames[i0] ? i0 : nearestLoaded(i0);
        if (a >= 0) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          cover(frames[a]!, 1);
          const b = frames[i0 + 1];
          if (a === i0 && b && t > 0.004) cover(b, t);
          drawnPos = a === i0 ? pos : -1;
          dirty = a !== i0;
        }
        publish(cur);
      }
      if (near || cur !== target) raf = requestAnimationFrame(tick);
    };
    const start = () => { if (!raf && !dead) { last = performance.now(); raf = requestAnimationFrame(tick); } };
    const onScroll = () => start();
    window.addEventListener("scroll", onScroll, { passive: true });
    start();

    return () => {
      dead = true;
      if (raf) cancelAnimationFrame(raf);
      warmIO.disconnect(); nearIO.disconnect(); ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      delete (window as unknown as { __ymfFilmP?: number }).__ymfFilmP;
    };
  }, [desktop, mobile, count]);

  return <canvas ref={ref} className="film__canvas" aria-hidden="true" />;
}
