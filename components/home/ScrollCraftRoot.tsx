"use client";

import { useEffect, useRef, type ReactNode } from "react";

type SCApi = { destroy: () => void; layout: () => void };
type SCGlobal = { mount: (root: Element, opts?: object) => SCApi };

const SRC = "/vendor/scrollcraft/scrollcraft.js";

function loadEngine(): Promise<SCGlobal> {
  const w = window as unknown as { ScrollCraft?: SCGlobal; __scLoading?: Promise<SCGlobal> };
  if (w.ScrollCraft) return Promise.resolve(w.ScrollCraft);
  if (w.__scLoading) return w.__scLoading;
  w.__scLoading = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SRC;
    s.async = true;
    s.onload = () => (w.ScrollCraft ? resolve(w.ScrollCraft) : reject(new Error("engine missing")));
    s.onerror = () => reject(new Error("engine failed to load"));
    document.head.appendChild(s);
  });
  return w.__scLoading;
}

/**
 * Mounts the vendored scroll-craft engine on the home page and tears it down on navigation.
 * The engine is untouched; this only chooses the phone or desktop frame set before mounting.
 */
export default function ScrollCraftRoot({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    let api: SCApi | null = null;
    let dead = false;

    const small = window.matchMedia("(max-width: 860px)").matches;
    const sequences: string[] = [];
    root.querySelectorAll<HTMLCanvasElement>("canvas[data-seq-desktop]").forEach((c) => {
      const tpl = small ? c.dataset.seqMobile : c.dataset.seqDesktop;
      if (tpl) { c.setAttribute("data-sc-sequence", tpl); sequences.push(tpl); }
    });

    // The engine fetches the film frames about three screens before chapter III. On slow connections
    // that is not enough, so warm the browser cache quietly, one frame at a time, from chapter I on.
    let warmed = false;
    const warm = () => {
      if (warmed) return;
      warmed = true;
      const urls: string[] = [];
      for (const spec of sequences) {
        const [tpl, n, s] = spec.split(":");
        for (let i = 0; i < (parseInt(n, 10) || 0); i++) urls.push(tpl.replace("{ii}", String((parseInt(s, 10) || 0) + i).padStart(2, "0")));
      }
      const next = () => {
        if (dead || !urls.length) return;
        const img = new Image();
        (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = "low";
        img.onload = img.onerror = next;
        img.src = urls.shift()!;
      };
      next(); next();
    };
    const first = root.querySelector("#ch-i");
    const io = first && "IntersectionObserver" in window
      ? new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { warm(); io?.disconnect(); } }, { rootMargin: "0px 0px -35% 0px" })
      : null;
    if (io && first) io.observe(first);

    loadEngine()
      .then((SC) => {
        if (dead) return;
        api = SC.mount(root);
        document.documentElement.classList.add("ymf-sc");
      })
      .catch(() => {
        // Without the engine every reveal would stay hidden, so show everything as plain content.
        document.documentElement.classList.add("ymf-sc-fallback");
      });

    return () => {
      dead = true;
      io?.disconnect();
      api?.destroy();
      document.documentElement.classList.remove("ymf-sc");
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
