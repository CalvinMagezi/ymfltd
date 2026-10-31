"use client";

import { useEffect, useRef, type ReactNode } from "react";

type SCApi = { destroy: () => void; layout: () => void };
type SCGlobal = { mount: (root: Element, opts?: object) => SCApi };

function loadEngine(): Promise<SCGlobal> {
  const w = window as unknown as { ScrollCraft?: SCGlobal };
  if (w.ScrollCraft) return Promise.resolve(w.ScrollCraft);
  // The vendored file is imported as-is; the bundler only minifies it. It defines window.ScrollCraft.
  return import("@/public/vendor/scrollcraft/scrollcraft.js").then(() => {
    if (!w.ScrollCraft) throw new Error("engine missing");
    return w.ScrollCraft;
  });
}

/**
 * Mounts the vendored scroll-craft engine on the home page and tears it down on navigation.
 * The engine is untouched. The chapter III film is drawn by FilmPlayer, not by the engine.
 */
export default function ScrollCraftRoot({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    let api: SCApi | null = null;
    let dead = false;

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
