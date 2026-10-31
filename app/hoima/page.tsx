import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HOIMA_FACTS, HOIMA_HERITAGE, HOIMA_MORE } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Why Hoima",
  description: "Hoima is growing fast: a new international airport, the Lake Albert oil projects and an AFCON 2027 stadium. Sourced facts about the city around New Kikwite Town.",
};

export default function HoimaPage() {
  return (
    <>
      <header className="relative isolate overflow-hidden bg-navy-2 text-navy-ink">
        <Image src="/images/bg1.jpeg" alt="Hills around Hoima" fill loading="eager" fetchPriority="high" quality={50} sizes="100vw" className="-z-10 object-cover opacity-30 mix-blend-luminosity" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#14223f] via-[#14223f]/85 to-[#14223f]/40" aria-hidden />
        <div className="wrap grid gap-5 py-20 md:py-28">
          <p className="eyebrow !text-gold-strong">Why Hoima</p>
          <h1 className="max-w-[18ch] text-[clamp(2.5rem,5.4vw,4.4rem)]">The capital of Bunyoro is changing fast</h1>
          <p className="max-w-[58ch] text-[clamp(1.05rem,1.5vw,1.2rem)] text-navy-ink/85">
            Hoima is the main city of the Bunyoro-Kitara kingdom and home to the palace of the Omukama. In the next few years it gains an international
            airport, Uganda's first oil production and a new national stadium. The Foundation's land sits on its southeastern edge, near the road to
            Kampala.
          </p>
        </div>
      </header>

      <section className="wrap py-14" aria-labelledby="num-h">
        <div className="grid gap-2">
          <p className="eyebrow">In numbers</p>
          <h2 id="num-h" className="text-[clamp(2rem,3.6vw,2.8rem)]">Six facts, with their sources</h2>
          <p className="max-w-[62ch] text-muted">Checked on 31 October 2026. Every figure links to where it comes from.</p>
        </div>
        <ul className="mt-8 grid gap-px overflow-hidden rounded-[14px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {HOIMA_FACTS.map((f) => (
            <li key={f.label} className="grid content-start gap-2 bg-card p-6">
              <p className="flex flex-wrap items-baseline gap-x-2">
                <span className="num font-display text-[3rem] font-semibold leading-none text-royal">{f.figure}</span>
                <span className="text-[12.5px] font-bold uppercase tracking-[0.08em] text-muted">{f.label}</span>
              </p>
              <p className="text-[15.5px]">{f.text}</p>
              <p className="text-[13px] text-muted">
                Source: <a href={f.source.url} target="_blank" rel="noopener noreferrer">{f.source.title}</a>, {f.source.date}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-paper-2" aria-labelledby="more-h">
        <div className="wrap grid gap-10 py-14 md:grid-cols-2">
          <div className="grid content-start gap-4">
            <h2 id="more-h" className="text-[clamp(1.8rem,3vw,2.4rem)]">Roads, rooms and refining</h2>
            <ul className="grid gap-4">
              {HOIMA_MORE.map((m) => (
                <li key={m.text} className="grid gap-1 border-l-2 border-line pl-4">
                  <span>{m.text}</span>
                  <span className="text-[13px] text-muted">
                    <a href={m.source.url} target="_blank" rel="noopener noreferrer">{m.source.title}</a>, {m.source.date}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid content-start gap-4">
            <h2 className="text-[clamp(1.8rem,3vw,2.4rem)]">Heritage and nature nearby</h2>
            <ul className="grid gap-2">
              {HOIMA_HERITAGE.map((h) => (
                <li key={h} className="flex gap-3"><span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-strong" />{h}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="wrap py-14" aria-labelledby="fit-h">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr] md:gap-10">
          <h2 id="fit-h" className="text-[clamp(2rem,3.6vw,2.8rem)]">What this means for New Kikwite Town</h2>
          <div className="prose-ymf text-muted">
            <p>
              A growing city needs homes, schools, care, places to stay and food that is processed close to where it is grown. Most of that has to be built
              by someone, and the Foundation's land is large enough, and close enough to town, to hold it in one planned place.
            </p>
            <p>
              Growth also brings risks: land pressure, rising prices, and jobs that skip local people. Planning the whole town at once, with farmers,
              schools and training at its centre, is how the family intends to make sure the people of Hoima share in it.
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/explore" className="btn btn-primary">See the plan in 3D</Link>
          <Link href="/partner" className="btn">Partner with us</Link>
        </div>
      </section>
    </>
  );
}
