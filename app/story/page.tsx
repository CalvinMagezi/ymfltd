import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FAMILY, TIMELINE } from "@/lib/content/site";

export const metadata: Metadata = {
  title: "Our story",
  description: "The Yesero Mugenyi Foundation was founded by Mr Yesero Mugenyi and is carried on by his family, who plan to build New Kikwite Town on his land in Hoima.",
};

const PRINCIPLES = [
  { h: "Build in phases, with partners", p: "Each project starts when the right partner and funding are in place. Nothing is rushed to fill a map." },
  { h: "Keep the forest and the wetland", p: "About 300 acres of forest and the valley wetland stay as nature, for wildlife, water and visitors." },
  { h: "Add value close to home", p: "Farming, processing, schooling and care on the same land, so more of the value created stays with families in and around Hoima." },
  { h: "Say plainly what is real", p: "We mark what is running, what is in planning and what is still an idea. Plans and pictures on this site are concepts." },
];

export default function StoryPage() {
  return (
    <>
      <header className="bg-navy-2 text-navy-ink">
       <div className="wrap grid gap-10 py-14 md:grid-cols-[1fr_minmax(0,380px)] md:items-center md:py-20">
        <div className="grid gap-5">
          <p className="eyebrow !text-gold-strong">Our story</p>
          <h1 className="max-w-[18ch] text-[clamp(2.5rem,5.4vw,4.4rem)]">A grandfather&apos;s land, and a family&apos;s promise to build on it</h1>
          <div className="prose-ymf text-[clamp(1.05rem,1.5vw,1.2rem)] text-navy-ink/85">
            <p>
              The Yesero Mugenyi Foundation was founded by Mr Yesero Mugenyi and shall be carried on by his descendants. Together the family has
              committed to build an entirely self-sufficient satellite town on the two square miles of land he worked so hard to acquire, for the sake of
              his children and grandchildren.
            </p>
            <p>
              The goal is a production satellite town, with room for commercial, industrial, farming and nature reserve activity that is distinct from the
              parent town: a new Kikwite Town in Hoima.
            </p>
          </div>
        </div>
        <figure className="grid gap-3">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[190px] rounded-b-[14px] ring-1 ring-gold-strong/50 bg-navy">
            <Image src="/images/team/grandpapa1.jpeg" alt="Mr Yesero Mugenyi" fill loading="eager" fetchPriority="high" sizes="380px" className="object-cover object-[50%_18%]" />
          </div>
          <figcaption className="text-[14px] text-navy-ink/70">Mr Yesero Mugenyi, founder. A Mubiito, prince of the royal clan of Bunyoro-Kitara.</figcaption>
        </figure>
       </div>
      </header>

      <section className="bg-paper-2" aria-labelledby="founder-h">
        <div className="wrap grid gap-6 py-14 md:grid-cols-[1fr_1fr]">
          <h2 id="founder-h" className="text-[clamp(2rem,3.6vw,2.8rem)]">A family of lawyers, readers and builders</h2>
          <div className="prose-ymf text-muted">
            <p>
              Mr Mugenyi ran his own law firm in Kampala and built a large library, mostly of law books. He was the pillar of his family's education.
              Five of his six children became lawyers, and one became a judge. His youngest daughter, Ada, went into the airline industry and became
              Country Manager for four airlines.
            </p>
            <p>
              Today Ada Mugenyi leads the Foundation as Managing Director, alongside her siblings, her children, and her nieces and nephews.
            </p>
          </div>
        </div>
      </section>

      <section className="wrap py-14" aria-labelledby="family-h">
        <h2 id="family-h" className="text-[clamp(2rem,3.6vw,2.8rem)]">The family</h2>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FAMILY.map((m) => (
            <li key={m.name} className="flex items-center gap-4 rounded-[14px] border border-line bg-card p-4">
              <span className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-paper-2 ring-1 ring-gold-strong/50 ring-offset-2 ring-offset-card">
                <Image src={m.img} alt={`Portrait of ${m.name}`} fill sizes="96px" className="object-cover" />
              </span>
              <span className="grid gap-1">
                <span className="font-display text-[1.4rem] font-semibold leading-tight">{m.name}</span>
                <span className="text-[14.5px] leading-snug text-muted">{m.title}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-paper-2" aria-labelledby="time-h">
        <div className="wrap grid gap-8 py-14 md:grid-cols-[minmax(0,300px)_1fr]">
          <div className="grid content-start gap-2">
            <p className="eyebrow">Milestones</p>
            <h2 id="time-h" className="text-[clamp(2rem,3.6vw,2.8rem)]">What has happened so far</h2>
            <p className="text-[15px] text-muted">Each entry here is backed by a document the Foundation holds.</p>
          </div>
          <ol className="grid gap-5 border-l-2 border-line pl-6">
            {TIMELINE.map((t) => (
              <li key={t.text} className="relative grid gap-1">
                <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-paper-2 bg-gold-strong" aria-hidden />
                <span className="num text-[13px] font-bold text-gold">{t.date}</span>
                <span className="text-[17px]">{t.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="wrap py-14" aria-labelledby="pr-h">
        <h2 id="pr-h" className="text-[clamp(2rem,3.6vw,2.8rem)]">How we work</h2>
        <ul className="mt-8 grid gap-px overflow-hidden rounded-[14px] border border-line bg-line sm:grid-cols-2">
          {PRINCIPLES.map((x) => (
            <li key={x.h} className="grid content-start gap-2 bg-card p-6">
              <h3 className="text-[1.6rem]">{x.h}</h3>
              <p className="text-[15.5px] text-muted">{x.p}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/projects" className="btn btn-primary">See the projects</Link>
          <Link href="/explore" className="btn">Explore in 3D</Link>
        </div>
      </section>
    </>
  );
}
