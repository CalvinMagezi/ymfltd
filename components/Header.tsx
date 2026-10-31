"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV } from "@/lib/content/nav";

export default function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 no-underline" aria-label="Yesero Mugenyi Foundation, home">
          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-line">
            <Image src="/logo.png" alt="" fill sizes="40px" className="object-contain" priority />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-[15px] font-semibold">Yesero Mugenyi Foundation</span>
            <span className="block font-mono text-[11px] tracking-wide text-muted">New Kikwite Town · Hoima</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((n) => {
              const active = path === n.href || (n.href !== "/" && path.startsWith(n.href));
              return (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-lg px-3 py-2 text-[15px] font-semibold no-underline transition-colors hover:bg-paper-2 ${
                      n.href === "/partner" ? "text-gold" : ""
                    } ${active ? "bg-paper-2" : ""}`}
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
          className="btn lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      <nav id="mobile-nav" aria-label="Main" hidden={!open} className="border-t border-line lg:hidden">
        <ul className="wrap grid gap-1 py-3">
          {NAV.map((n) => (
            <li key={n.href}>
              <Link href={n.href} className="block rounded-lg px-3 py-3 text-[17px] font-semibold no-underline hover:bg-paper-2">
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
