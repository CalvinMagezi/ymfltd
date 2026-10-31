import Image from "next/image";
import Link from "next/link";
import "./home.css";
import { projectBySlug } from "@/lib/content/projects";
import { CONTACT, HOIMA_FACTS } from "@/lib/content/site";
import { SCENES, type SceneKey } from "@/lib/content/scenes";
import { PHASE_ACRES, LEDGER_TOTAL } from "@/lib/content/ledger";
import { StatusChip } from "@/components/ProjectBits";
import ScrollCraftRoot from "@/components/home/ScrollCraftRoot";
import Folio from "@/components/home/Folio";
import LedgerPlate from "@/components/home/LedgerPlate";
import FilmPlayer from "@/components/home/FilmPlayer";
import BackToTop from "@/components/home/BackToTop";

const CONTENTS = [
  { id: "ch-i", num: "I", title: "The land today" },
  { id: "ch-ii", num: "II", title: "A grandfather's promise" },
  { id: "ch-iii", num: "III", title: "The land becomes the town" },
  { id: "ch-iv", num: "IV", title: "What will stand here" },
  { id: "ch-v", num: "V", title: "Hoima is rising" },
  { id: "colophon", num: "", title: "Build it with us" },
];

const FILM_PHASES = [
  { name: "Today", note: "The dairy farm, the forest and the wetland." },
  { name: "Phase 1", note: "The hospital, golf course, hotel, solar farm and the first homes." },
  { name: "Phase 2", note: "Schools and university, the sports arena, library and museum, eco-lodge and bamboo." },
  { name: "Phase 3", note: "The agro-industrial park and the town centre." },
];

/** A picture spread in chapter IV: one generated scene tied to one project. */
function Spread({ scene, slug, size = "lg", className = "" }: { scene: SceneKey; slug: string; size?: "lg" | "md" | "sm"; className?: string }) {
  const s = SCENES[scene];
  const p = projectBySlug(slug)!;
  const sizes = size === "lg" ? "(min-width: 1100px) 760px, 100vw" : size === "md" ? "(min-width: 1100px) 560px, 100vw" : "(min-width: 1100px) 420px, 100vw";
  return (
    <figure className={`spread spread--${size} ${className}`} data-sc-in>
      <div className="spread__frame" data-sc-act="flow">
        <div className="spread__par" data-sc-parallax="-0.7">
          <Image src={s.src} alt={s.alt} fill quality={60} sizes={sizes} className="object-cover" />
        </div>
        <span className="aimp">Artist&apos;s impression</span>
      </div>
      <figcaption className="spread__cap">
        <span className="spread__head">
          <Link href={`/projects/${p.slug}`}>{p.name}</Link>
          <StatusChip status={p.status} />
        </span>
        <span className="spread__text">{p.summary}</span>
      </figcaption>
    </figure>
  );
}

const countable = (f: string) => /^[\d,]+$/.test(f);

export default function Home() {
  const hoima = HOIMA_FACTS.filter((f) => ["people in Hoima City", "Kabalega airport opens", "seats at Hoima City Stadium", "Ugandans working directly in oil", "beds at the regional referral hospital"].includes(f.label));

  return (
    <ScrollCraftRoot className="home-root no-foot-gap">
      <noscript>
        <style>{`[data-sc-in],[data-sc-stagger]>*{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      <Folio />
      <BackToTop />

      {/* Title page: type on its own ground, the seal, no pictures above the fold */}
      <section className="ch ch--title" data-chapter="title" aria-labelledby="title-h">
        <div className="title__sky" aria-hidden="true">
          <Image src="/images/hill-sky.jpg" alt="" fill loading="eager" fetchPriority="high" sizes="100vw" quality={50} className="object-cover object-[62%_38%]" />
        </div>
        <div className="hwrap title">
          <div className="title__text">
            <p className="eyebrow title__eyebrow">The Yesero Mugenyi Foundation · Hoima, Bunyoro-Kitara</p>
            <h1 id="title-h" className="title__h" tabIndex={-1}>New Kikwite Town</h1>
            <p className="title__sub">
              A grandfather&apos;s land southeast of Hoima, planned as a working town for the families who will live and work there.
            </p>
            <p className="title__ded">For Mr Yesero Mugenyi, who gathered this land for his children and grandchildren.</p>
          </div>
          <div className="title__seal" aria-hidden="true">
            <span className="title__disc">
              <Image src="/logo.png" alt="" fill sizes="(min-width: 1100px) 340px, 200px" className="object-contain" loading="eager" />
            </span>
          </div>
        </div>
        <nav id="contents" className="hwrap contents" aria-label="Contents">
          <p className="eyebrow contents__h">Contents</p>
          <ol className="contents__list">
            {CONTENTS.map((c) => (
              <li key={c.id}>
                <a href={`#${c.id}`}>
                  <span className="contents__num">{c.num || "·"}</span>
                  <span className="contents__t">{c.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </section>

      {/* I. The land today */}
      <section id="ch-i" className="ch ch--paper" data-chapter="i" data-num="I" data-title="The land today" data-ledger="today" aria-labelledby="ch-i-h">
        <div className="hwrap">
          <header className="inter">
            <span className="inter__num" aria-hidden="true">I</span>
            <h2 id="ch-i-h" className="inter__h">The land today</h2>
          </header>
          <div className="spread-row spread-row--text-first">
            <div className="prose">
              <p className="prose__lead">
                The Foundation&apos;s land is <span className="num fig" data-sc-count="0 1,280">1,280</span> acres of rolling hills, about two
                square miles, on the southeastern edge of Hoima between Kibati and Kinubi.
              </p>
              <p>
                It is already working. The Kikwite dairy farm runs here today, with a herd of about{" "}
                <span className="num fig" data-sc-count="0 126">126</span> Friesian cross cows, and it sells milk.
              </p>
              <p>
                To the south, <span className="num fig" data-sc-count="0 300">300</span> acres of forest will stay forest, kept as a game reserve
                and conservation area. The valley wetland stays as it is, for water, papyrus and birds.
              </p>
              <p className="prose__aside">Everything in the chapters that follow starts from what is here today.</p>
            </div>
            <figure className="spread spread--md spread--land">
              <div className="spread__frame" data-sc-act="flow">
                <div className="spread__par" data-sc-parallax="-0.8">
                  <Image src={SCENES.land.src} alt={SCENES.land.alt} fill quality={60} sizes="(min-width: 1100px) 640px, 100vw" className="object-cover" />
                </div>
                <span className="aimp">Artist&apos;s impression</span>
              </div>
              <figcaption className="spread__cap">
                <span className="spread__text">
                  The feel of the land: pasture, the forest valley and the dairy. Made with AI image tools, not a photograph of the site.
                  Photographs and a drone survey of the land come next.
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* II. A grandfather's promise */}
      <section id="ch-ii" className="ch ch--navy" data-chapter="ii" data-num="II" data-title="A grandfather's promise" aria-labelledby="ch-ii-h">
        <div className="hwrap">
          <header className="inter inter--on-dark">
            <span className="inter__num" aria-hidden="true">II</span>
            <h2 id="ch-ii-h" className="inter__h">A grandfather&apos;s promise</h2>
          </header>
          <div className="spread-row spread-row--portrait" data-sc-act="flow">
            <figure className="portrait">
              <div className="portrait__frame" data-sc-reveal="iris" data-sc-reveal-at="0.12 0.42">
                <Image src="/images/team/grandpapa1.jpeg" alt="Mr Yesero Mugenyi" fill quality={60} sizes="(min-width: 1100px) 420px, 80vw" className="object-cover object-[50%_18%]" />
              </div>
              <figcaption className="portrait__cap">Mr Yesero Mugenyi, founder. A Mubiito, prince of the royal clan of Bunyoro-Kitara.</figcaption>
            </figure>
            <div className="prose prose--on-dark">
              <blockquote className="pull">
                <p>
                  The Yesero Mugenyi Foundation was founded by Mr Yesero Mugenyi and shall be carried on by his descendants.
                </p>
              </blockquote>
              <p>
                He ran his own law firm in Kampala and built a large library, mostly of law books. He was the pillar of his family&apos;s education:
                five of his six children became lawyers.
              </p>
              <p>
                Together the family has committed to build a self-sufficient town on the two square miles he worked so hard to acquire, for the sake
                of his children and grandchildren. The work is led by his youngest daughter, Ada Mugenyi, with her siblings, her children, and her
                nieces and nephews.
              </p>
              <p>
                <Link href="/story" className="run-link">Read the family&apos;s story</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* III. The land becomes the town: the one scrub on the page */}
      <section id="ch-iii" className="ch ch--deep ch--intertitle" data-chapter="iii" data-num="III" data-title="The land becomes the town" aria-labelledby="ch-iii-h">
        <div className="hwrap">
          <header className="inter inter--on-dark inter--solo">
            <span className="inter__num" aria-hidden="true">III</span>
            <h2 id="ch-iii-h" className="inter__h">The land becomes the town</h2>
            <p className="inter__lead">
              This is the family&apos;s 3D concept model, set on the real hills of the land. It starts with what is there today, and the town rises
              phase by phase as you read on.
            </p>
          </header>
        </div>
      </section>
      <section className="ch ch--deep ch--film" data-sc-act="scrub" data-sc-span="3.6" data-ledger="film" data-phase="0" aria-label="The town rising, phase by phase">
        <div className="film" data-sc-stage>
          <div className="hwrap film__grid">
            <div className="film__legend">
              <ol className="film__phases">
                {FILM_PHASES.map((ph, i) => (
                  <li key={ph.name} data-ph={i}>
                    <span className="film__ph-name">{ph.name}</span>
                    <span className="film__ph-ac num">{PHASE_ACRES[i]} acres</span>
                    <span className="film__ph-note">{ph.note}</span>
                  </li>
                ))}
              </ol>
              <p className="film__note">
                Draft layout on real terrain, not an approved design or a surveyed boundary.{" "}
                <Link href="/explore" className="run-link">Explore the model yourself</Link>
              </p>
            </div>
            <figure className="film__frame">
              <picture>
                <source media="(max-width: 860px)" srcSet="/film/m/00.webp" />
                <img className="film__poster" src="/film/d/00.webp" alt="The land today in the concept model: forest, wetland and the dairy on green hills" loading="lazy" decoding="async" width={1440} height={810} />
              </picture>
              <FilmPlayer desktop="/film/d/{ii}.webp" mobile="/film/m/{ii}.webp" count={72} />
            </figure>
          </div>
        </div>
      </section>

      {/* IV. What will stand here */}
      <section id="ch-iv" className="ch ch--paper" data-chapter="iv" data-num="IV" data-title="What will stand here" aria-labelledby="ch-iv-h">
        <div className="hwrap">
          <header className="inter">
            <span className="inter__num" aria-hidden="true">IV</span>
            <h2 id="ch-iv-h" className="inter__h">What will stand here</h2>
            <p className="inter__lead inter__lead--ink">
              Sixteen projects in four groups. These pictures are artist&apos;s impressions, made with AI image tools to show how each place could
              feel. They are not designs, and each project says plainly where it stands.
            </p>
          </header>

          <figure className="pano" data-sc-in>
            <div className="pano__frame" data-sc-act="flow">
              <div className="spread__par" data-sc-parallax="-0.9">
                <Image src={SCENES.aerial.src} alt={SCENES.aerial.alt} fill quality={60} sizes="(min-width: 1100px) 1170px, 100vw" className="object-cover" />
              </div>
              <span className="aimp">Artist&apos;s impression</span>
            </div>
            <figcaption className="spread__cap">
              <span className="spread__text">{SCENES.aerial.caption} A picture of the ambition, not the plan: the 3D model in chapter III shows where things go.</span>
            </figcaption>
          </figure>

          <h3 className="group-h">Care and learning</h3>
          <div className="spreads spreads--a">
            <Spread scene="hospital" slug="hospital-project" size="lg" />
            <Spread scene="school" slug="education-project" size="sm" className="spread--drop" />
          </div>
          <div className="spreads spreads--pair">
            <Spread scene="library" slug="library-project" size="md" />
            <Spread scene="museum" slug="museum-project" size="md" className="spread--drop-sm" />
          </div>

          <h3 className="group-h">Land and food</h3>
          <div className="spreads spreads--a spreads--flip">
            <Spread scene="agro" slug="agro-industrial-park" size="lg" />
            <Spread scene="dairy" slug="agri-tourism-project" size="sm" className="spread--drop" />
          </div>
          <div className="spreads spreads--pair">
            <Spread scene="bamboo" slug="bamboo-project" size="md" />
            <Spread scene="hemp" slug="hemp-project" size="md" className="spread--drop-sm" />
          </div>

          <h3 className="group-h">Town life</h3>
          <div className="spreads spreads--a">
            <Spread scene="town" slug="shopping-center-project" size="lg" />
            <Spread scene="homes" slug="housing-project" size="sm" className="spread--drop" />
          </div>
          <div className="spreads spreads--pair">
            <Spread scene="arena" slug="sports-arena-project" size="md" />
            <Spread scene="solar" slug="technology-projects" size="md" className="spread--drop-sm" />
          </div>

          <h3 className="group-h">Nature and visitors</h3>
          <div className="spreads spreads--a spreads--flip">
            <Spread scene="reserve" slug="animal-conservation-project" size="lg" />
            <Spread scene="ecolodge" slug="eco-tourism-project" size="sm" className="spread--drop" />
          </div>
          <div className="spreads spreads--pair">
            <Spread scene="golf" slug="golf-course-project" size="md" />
            <Spread scene="hotel" slug="hotel-project" size="md" className="spread--drop-sm" />
          </div>

          <p className="run-out">
            Every picture here is an artist&apos;s impression of what the family hopes to build with partners.{" "}
            <Link href="/projects" className="run-link">See all sixteen projects and where each one stands</Link>.
          </p>
        </div>
      </section>

      {/* V. Hoima is rising */}
      <section id="ch-v" className="ch ch--gold" data-chapter="v" data-num="V" data-title="Hoima is rising" aria-labelledby="ch-v-h">
        <div className="hwrap">
          <header className="inter inter--on-gold">
            <span className="inter__num" aria-hidden="true">V</span>
            <h2 id="ch-v-h" className="inter__h">Hoima is rising</h2>
            <p className="inter__lead inter__lead--ink">
              Hoima is the capital of Bunyoro-Kitara. In the next few years it gains an international airport, Uganda&apos;s first oil production and
              a new national stadium. The land sits on its southeastern edge, near the road to Kampala.
            </p>
          </header>
          <ul className="figs" data-sc-in data-sc-stagger="70">
            {hoima.map((f) => (
              <li key={f.label} className="figs__item">
                <span className="figs__n num">
                  {countable(f.figure) ? <span data-sc-count={`0 ${f.figure}`}>{f.figure}</span> : f.figure}
                </span>
                <span className="figs__l">{f.label}</span>
                <span className="figs__t">{f.text}</span>
                <a className="figs__s" href={f.source.url} target="_blank" rel="noopener noreferrer">
                  {f.source.title.split(",")[0]}, {f.source.date}
                </a>
              </li>
            ))}
          </ul>
          <p className="run-out run-out--ink">
            <Link href="/hoima" className="run-link">Why Hoima, with every source</Link>
          </p>
        </div>
      </section>

      {/* Colophon: the close, with the ask as running text and every acre accounted for */}
      <section id="colophon" className="ch ch--navy ch--colophon" data-chapter="colophon" aria-labelledby="colo-h">
        <div className="kitara-band" aria-hidden="true" />
        <div className="hwrap colophon" data-sc-act="flow">
          <div className="colophon__ask" data-sc-reveal="up" data-sc-reveal-at="0.05 0.32">
            <p className="eyebrow colophon__eyebrow">Colophon</p>
            <h2 id="colo-h" className="colophon__h">Build it with us</h2>
            <p className="colophon__run">
              The Foundation brings the land, the family&apos;s commitment and the plans. If you work in healthcare, hospitality, education,
              agriculture or finance and would like to build part of this town, write to Ada Mugenyi, our Managing Director, at{" "}
              <a href={`mailto:${CONTACT.email}`} className="run-link">{CONTACT.email}</a>, call{" "}
              <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="run-link num">{CONTACT.phone}</a>, or{" "}
              <Link href="/partner" className="run-link">leave a note on the partner page</Link>. Detailed plans are shared directly with
              serious partners, not published here.
            </p>
          </div>
          <div className="colophon__ledger">
            <p className="eyebrow colophon__eyebrow">Every acre, accounted for</p>
            <LedgerPlate />
            <p className="colophon__small">
              One square for each of the {LEDGER_TOTAL.toLocaleString()} acres, sized from the draft land budget in the concept model. A first
              draft for the family to change, not a survey.
            </p>
          </div>
        </div>
        <div className="hwrap colophon__foot">
          <div className="colophon__mast">
            <span className="colophon__seal">
              <Image src="/logo.png" alt="" fill sizes="56px" className="object-contain" />
            </span>
            <p>
              <strong>Yesero Mugenyi Foundation Ltd</strong>, incorporated in Uganda in 2011. {CONTACT.address}.
            </p>
          </div>
          <nav aria-label="Pages" className="colophon__nav">
            <Link href="/projects">Projects</Link>
            <Link href="/explore">Explore in 3D</Link>
            <Link href="/story">Our story</Link>
            <Link href="/hoima">Why Hoima</Link>
            <Link href="/partner">Partner with us</Link>
          </nav>
          <p className="colophon__small">
            Set in Cormorant Garamond and Nunito. The sky behind the title page was photographed from the hill on the land in April 2020.
            Pictures marked as artist&apos;s impressions were made with AI image tools (Google Gemini) in October 2026. The 3D model is built on open terrain and map data, see the{" "}
            <Link href="/explore#credits">credits</Link>. Plans, layouts and pictures on this site are concepts for discussion, not approved
            designs, surveyed boundaries or offers of investment. © {new Date().getFullYear()} Yesero Mugenyi Foundation Ltd.
          </p>
        </div>
      </section>
    </ScrollCraftRoot>
  );
}
