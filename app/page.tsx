import Image from "next/image";
import Link from "next/link";
import { PROJECTS, THEMES, type Theme } from "@/lib/content/projects";
import { KEY_FACTS } from "@/lib/content/site";
import { PHASES } from "@/lib/content/zones";
import { StatusChip } from "@/components/ProjectBits";

const THEME_ORDER: Theme[] = ["land", "health", "nature", "town"];
const THEME_IMAGE: Record<Theme, string> = { land: "dairy", health: "heritage", nature: "forest", town: "housing" };

export default function Home() {
  return (
    <>
      {/* Hero: the concept model is the picture */}
      <section className="relative isolate overflow-hidden bg-forest text-forest-ink">
        <Image
          src="/images/concept/hero.jpg"
          alt="Concept view of New Kikwite Town on the hills southeast of Hoima, from the 3D model"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-[65%_55%]"
        />
        <div className="absolute inset-0 -z-10 bg-[#0d2418]/70 md:bg-transparent md:bg-gradient-to-r md:from-[#0d2418]/90 md:via-[#0d2418]/55 md:to-transparent" />
        <div className="wrap grid min-h-[min(78vh,720px)] content-center gap-6 py-20">
          <p className="eyebrow !text-forest-ink/80">Yesero Mugenyi Foundation · Hoima, Uganda</p>
          <h1 className="max-w-[17ch] text-[clamp(2.2rem,5.2vw,4.1rem)] font-bold leading-[1.04]">
            A working town on two square miles of family land
          </h1>
          <p className="max-w-[54ch] text-[clamp(1.05rem,1.6vw,1.25rem)] text-forest-ink/90">
            New Kikwite Town is planned on 1,280 acres southeast of Hoima's city centre: farms and food processing, a hospital,
            schools, a forest reserve, homes and places to visit, built in phases by one family over generations.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/explore" className="btn btn-primary">Explore the town in 3D</Link>
            <Link href="/projects" className="btn btn-on-dark">See all 16 projects</Link>
          </div>
          <p className="font-mono text-[12px] text-forest-ink/70">Concept model for discussion, not an approved design.</p>
        </div>
      </section>

      {/* What is real today */}
      <section className="wrap py-16" aria-labelledby="facts-h">
        <div className="grid gap-2">
          <p className="eyebrow">Where things stand</p>
          <h2 id="facts-h" className="text-[clamp(1.6rem,3vw,2.2rem)] font-bold">The land, the farm and the forest are already here</h2>
        </div>
        <dl className="mt-8 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {KEY_FACTS.map((f) => (
            <div key={f.text} className="grid content-start gap-2 bg-card p-5">
              <dt className="flex items-baseline gap-2">
                <span className="num font-display text-4xl font-bold">{f.value}</span>
                <span className="font-mono text-sm text-muted">{f.unit}</span>
              </dt>
              <dd className="text-[15px] leading-snug text-muted">{f.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Explore band */}
      <section className="bg-paper-2" aria-labelledby="explore-h">
        <div className="wrap grid items-center gap-10 py-16 lg:grid-cols-[1.25fr_1fr]">
          <Link href="/explore" className="group relative block aspect-[16/10] overflow-hidden rounded-xl border border-line">
            <Image
              src="/images/concept/hospital.jpg"
              alt="Close view of the gateway area in the 3D concept model, with the hospital and library"
              fill
              sizes="(min-width: 1024px) 640px, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <span className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-3 py-2 font-mono text-[12px] text-white">Open the 3D model</span>
          </Link>
          <div className="grid gap-4">
            <p className="eyebrow">The plan in 3D</p>
            <h2 id="explore-h" className="text-[clamp(1.6rem,3vw,2.2rem)] font-bold">Walk the plan before anything is built</h2>
            <p className="text-muted">
              The model places every project on the real hills and valleys of the land. Turn it, zoom in, tap any area to read about it,
              and switch between today and each phase to watch the town grow.
            </p>
            <p className="text-muted">
              It is a first layout for the family to discuss and change. A surveyed boundary and drone capture of the land come next.
            </p>
            <div><Link href="/explore" className="btn btn-primary">Explore in 3D</Link></div>
          </div>
        </div>
      </section>

      {/* Projects by theme */}
      <section className="wrap py-16" aria-labelledby="projects-h">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="grid gap-2">
            <p className="eyebrow">Projects</p>
            <h2 id="projects-h" className="text-[clamp(1.6rem,3vw,2.2rem)] font-bold">Sixteen projects, one town</h2>
          </div>
          <Link href="/projects" className="btn">All projects</Link>
        </div>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {THEME_ORDER.map((t) => {
            const list = PROJECTS.filter((p) => p.theme === t);
            return (
              <li key={t} className="grid min-w-0 grid-rows-[auto_auto_1fr] overflow-hidden rounded-xl border border-line bg-card">
                <div className="relative aspect-[16/10] bg-paper-2">
                  <Image src={`/images/concept/${THEME_IMAGE[t]}.jpg`} alt="" fill sizes="(min-width: 1024px) 290px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                </div>
                <div className="grid gap-1 px-4 pt-4">
                  <h3 className="text-lg font-semibold">{THEMES[t].name}</h3>
                  <p className="text-[14.5px] leading-snug text-muted">{THEMES[t].line}</p>
                </div>
                <ul className="grid content-start gap-0 p-2 pt-3">
                  {list.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/projects/${p.slug}`} className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 text-[15px] no-underline hover:bg-paper-2">
                        <span className="min-w-0">{p.name}</span>
                        <StatusChip status={p.status} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Phases */}
      <section className="bg-paper-2" aria-labelledby="phases-h">
        <div className="wrap py-16">
          <div className="grid gap-2">
            <p className="eyebrow">How it comes together</p>
            <h2 id="phases-h" className="text-[clamp(1.6rem,3vw,2.2rem)] font-bold">Built in phases, as partners join</h2>
            <p className="max-w-[62ch] text-muted">
              Each phase starts when its partners and funding are in place. The order below is the family's current thinking, not a timetable.
            </p>
          </div>
          <ol className="mt-10 grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-4">
            {PHASES.map((ph, i) => (
              <li key={ph.name} className="grid content-start gap-2 bg-card p-5">
                <span className="font-mono text-[12px] text-muted">{i === 0 ? "Now" : `Step ${i}`}</span>
                <h3 className="text-lg font-semibold">{ph.name}</h3>
                <p className="text-[15px] leading-snug text-muted">{ph.note}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Legacy */}
      <section className="wrap grid items-center gap-10 py-16 md:grid-cols-[minmax(0,320px)_1fr]" aria-labelledby="legacy-h">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[320px] overflow-hidden rounded-xl border border-line bg-paper-2">
          <Image src="/images/team/grandpapa1.jpeg" alt="Mr Yesero Mugenyi, founder of the Foundation" fill sizes="320px" className="object-cover" />
        </div>
        <div className="grid gap-4">
          <p className="eyebrow">A family legacy</p>
          <h2 id="legacy-h" className="text-[clamp(1.6rem,3vw,2.2rem)] font-bold">Founded by Mr Yesero Mugenyi, carried on by his descendants</h2>
          <div className="prose-ymf text-muted">
            <p>
              The Foundation was founded by Mr Yesero Mugenyi, who worked hard to acquire this land for the sake of his children and grandchildren.
              Together the family has committed to build a self-sufficient satellite town on it.
            </p>
            <p>
              The work is led by his youngest daughter, Ms Ada Mugenyi, alongside her siblings, her children, and her nieces and nephews,
              all working hand in hand.
            </p>
          </div>
          <div><Link href="/story" className="btn">Read our story</Link></div>
        </div>
      </section>

      {/* Partner CTA */}
      <section className="wrap" aria-labelledby="partner-h">
        <div className="grid gap-6 rounded-2xl bg-forest p-8 text-forest-ink md:grid-cols-[1fr_auto] md:items-center md:p-12">
          <div className="grid gap-3">
            <h2 id="partner-h" className="text-[clamp(1.5rem,2.8vw,2rem)] font-bold">Build it with us</h2>
            <p className="max-w-[60ch] text-forest-ink/85">
              The Foundation is looking for partners in healthcare, hospitality, education, agriculture and finance. Tell us how you would like to be
              involved, and we will share the detailed plans.
            </p>
          </div>
          <div><Link href="/partner" className="btn btn-primary">Partner with us</Link></div>
        </div>
      </section>
    </>
  );
}
