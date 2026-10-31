import Link from "next/link";
import { CONTACT } from "@/lib/content/site";
import { NAV } from "@/lib/content/nav";

export default function Footer() {
  return (
    <footer className="mt-24 bg-forest text-forest-ink" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="grid gap-3">
          <p className="font-display text-xl font-semibold">Yesero Mugenyi Foundation Ltd</p>
          <p className="max-w-[44ch] text-[15px] opacity-80">
            A family foundation planning New Kikwite Town on 1,280 acres southeast of Hoima, Uganda. Incorporated in Uganda in 2011.
          </p>
          <p className="max-w-[52ch] text-[13.5px] opacity-70">
            Plans, layouts and images on this site are concepts for discussion. They are not approved designs, surveyed boundaries or offers of investment.
          </p>
        </div>
        <div>
          <p className="eyebrow !text-forest-ink/70">Pages</p>
          <ul className="mt-3 grid gap-2 text-[15px]">
            <li><Link href="/" className="no-underline hover:underline">Home</Link></li>
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="no-underline hover:underline">{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow !text-forest-ink/70">Contact</p>
          <ul className="mt-3 grid gap-2 text-[15px]">
            <li className="select-all">{CONTACT.email}</li>
            <li className="select-all num">{CONTACT.phone}</li>
            <li>{CONTACT.address}</li>
            <li className="opacity-80">Contact person: {CONTACT.person}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="wrap flex flex-wrap justify-between gap-2 py-5 text-[13px] opacity-70">
          <span>© {new Date().getFullYear()} Yesero Mugenyi Foundation Ltd</span>
          <Link href="/explore#credits" className="no-underline hover:underline">Map and data credits</Link>
        </div>
      </div>
    </footer>
  );
}
