"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV } from "@/lib/content/nav";

export default function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  useEffect(() => setOpen(false), [path]);

  // Tuck the bar away while reading down the page, bring it back as soon as the reader scrolls up.
  useEffect(() => {
    let last = window.scrollY, raf = 0;
    const read = () => {
      raf = 0;
      const y = window.scrollY, dy = y - last;
      if (y < 120) setHidden(false);
      else if (dy > 6) setHidden(true);
      else if (dy < -6) setHidden(false);
      if (Math.abs(dy) > 6 || y < 120) last = y;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(read); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 bg-navy text-navy-ink transition-transform duration-300 ease-out motion-reduce:transition-none ${
        hidden && !open ? "-translate-y-full" : "translate-y-0"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      onFocusCapture={() => setHidden(false)}
    >
      <div className="wrap flex h-[68px] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 no-underline" aria-label="Yesero Mugenyi Foundation, home">
          <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[#f5efe1] ring-1 ring-gold-strong/60">
            <Image src="/logo.png" alt="" fill sizes="44px" className="object-contain p-[2px]" priority />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-[19px] font-semibold tracking-[0.01em]">Yesero Mugenyi Foundation</span>
            <span className="block text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-gold-strong">New Kikwite Town · Hoima</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((n) => {
              const active = path === n.href || (n.href !== "/" && path.startsWith(n.href));
              const cta = n.href === "/partner";
              return (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    aria-current={active ? "page" : undefined}
                    className={
                      cta
                        ? "ml-2 inline-flex rounded-full bg-gold-strong px-4 py-2 text-[14.5px] font-extrabold text-gold-ink no-underline transition-colors hover:bg-gold-soft"
                        : `relative px-3 py-2 text-[15px] font-bold no-underline opacity-90 transition-opacity hover:opacity-100 after:absolute after:inset-x-3 after:-bottom-[2px] after:h-[2px] after:bg-gold-strong after:transition-transform ${
                            active ? "opacity-100 after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
                          }`
                    }
                  >
                    {n.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          className="btn btn-on-dark !px-4 !py-2.5 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      <div className="kitara-band" aria-hidden="true" />
      <nav id="mobile-nav" aria-label="Main" hidden={!open} className="border-t border-white/10 lg:hidden">
        <ul className="wrap grid gap-1 py-3">
          {NAV.map((n) => (
            <li key={n.href}>
              <Link href={n.href} className="block rounded-lg px-3 py-3 text-[17px] font-bold no-underline hover:bg-white/5">
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
