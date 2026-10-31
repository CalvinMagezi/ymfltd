import Image from "next/image";
import Link from "next/link";
import { CONTACT } from "@/lib/content/site";
import { NAV } from "@/lib/content/nav";

export default function Footer() {
  return (
    <footer className="bg-navy text-navy-ink" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      <div className="kitara-band" aria-hidden="true" />
      <div className="wrap grid gap-10 py-16 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="grid content-start gap-4">
          <div className="flex items-center gap-4">
            <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[#f5efe1] ring-1 ring-gold-strong/60">
              <Image src="/logo.png" alt="" fill sizes="64px" className="object-contain p-[3px]" />
            </span>
            <p className="font-display text-[26px] font-semibold leading-tight">Yesero Mugenyi<br />Foundation Ltd</p>
          </div>
          <p className="max-w-[44ch] text-[15px] text-navy-ink/80">
            A family foundation planning New Kikwite Town on 1,280 acres southeast of Hoima, Uganda. Incorporated in Uganda in 2011.
          </p>
          <p className="max-w-[52ch] text-[13.5px] text-navy-ink/65">
            Plans, layouts and pictures on this site are concepts for discussion. Pictures marked as artist&apos;s impressions were made
            with AI image tools. None of it is an approved design, a surveyed boundary or an offer of investment.
          </p>
        </div>
        <div>
          <p className="eyebrow !text-gold-strong">Pages</p>
          <ul className="mt-4 grid gap-2 text-[15px]">
            <li><Link href="/" className="no-underline hover:underline">Home</Link></li>
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="no-underline hover:underline">{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow !text-gold-strong">Contact</p>
          <ul className="mt-4 grid gap-2 text-[15px]">
            <li className="select-all">{CONTACT.email}</li>
            <li className="select-all num">{CONTACT.phone}</li>
            <li>{CONTACT.address}</li>
            <li className="text-navy-ink/75">Contact person: {CONTACT.person}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="wrap flex flex-wrap justify-between gap-2 py-5 text-[13px] text-navy-ink/65">
          <span>© {new Date().getFullYear()} Yesero Mugenyi Foundation Ltd</span>
          <Link href="/explore#credits" className="no-underline hover:underline">Map, data and image credits</Link>
        </div>
      </div>
    </footer>
  );
}
