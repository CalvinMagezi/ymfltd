import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROJECTS, THEMES, STATUS_NOTE, projectBySlug } from "@/lib/content/projects";
import { ZONE_SHORT } from "@/lib/content/zones";
import { ProjectCard, StatusChip, conceptImage } from "@/components/ProjectBits";
import { sceneForProject } from "@/lib/content/scenes";
import plan from "@/public/explore/plan.json";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) return {};
  const scene = sceneForProject(p.slug);
  return { title: p.name, description: p.summary, openGraph: { images: [scene ? scene.src : conceptImage(p.zone)] } };
}

const PHASE_NAME = ["Today", "Phase 1", "Phase 2", "Phase 3"];

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) notFound();
  const zone = (plan.zones as { id: string; acres: number }[]).find((z) => z.id === p.zone);
  const shared = PROJECTS.filter((q) => q.zone === p.zone && q.slug !== p.slug);
  const related = PROJECTS.filter((q) => q.theme === p.theme && q.slug !== p.slug).slice(0, 3);
  const scene = sceneForProject(p.slug);

  return (
    <article>
      <header className="bg-navy-2 text-navy-ink">
        <div className="wrap grid gap-8 py-10 md:py-14 lg:grid-cols-[1fr_1.15fr] lg:items-center">
          <div className="grid content-start gap-4">
            <nav aria-label="Breadcrumb" className="text-[14px] text-navy-ink/70">
              <Link href="/projects" className="no-underline hover:underline">Projects</Link>
              <span aria-hidden> / </span>
              <span>{THEMES[p.theme].name}</span>
            </nav>
            <div className="flex flex-wrap items-center gap-2">
              <StatusChip status={p.status} />
              <span className="chip" style={{ ["--dot" as string]: "transparent" }}>{PHASE_NAME[p.phase]}</span>
            </div>
            <h1 className="text-[clamp(2.4rem,5vw,4rem)]">{p.name}</h1>
            <p className="max-w-[52ch] text-[clamp(1.05rem,1.5vw,1.2rem)] text-navy-ink/85">{p.summary}</p>
            <p className="text-[14px] text-navy-ink/65">{STATUS_NOTE[p.status]}.</p>
          </div>
          <figure className="grid gap-2">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[14px] ring-1 ring-gold-strong/40">
              <Image
                src={scene ? scene.src : conceptImage(p.zone)}
                alt={scene ? scene.alt : `Concept view of the ${p.name.toLowerCase()} area`}
                fill
                priority
                sizes="(min-width: 1024px) 640px, 100vw"
                className="object-cover"
              />
              <span className="aimp">{scene ? "Artist's impression" : "3D concept model"}</span>
            </div>
            <figcaption className="text-[13.5px] text-navy-ink/65">
              {scene ? `${scene.caption} Made with AI image tools; not a design.` : "Concept view from the 3D model. Not a final design."}
            </figcaption>
          </figure>
        </div>
      </header>

      <div className="wrap grid gap-12 pt-14 pb-8 lg:grid-cols-[1fr_320px]">
        <div className="prose-ymf grid content-start gap-0 text-[18px]">
          {p.body.map((para) => <p key={para}>{para}</p>)}
          {p.milestones && (
            <section className="mt-10" aria-labelledby="ms-h">
              <h2 id="ms-h" className="text-[1.9rem]">Milestones</h2>
              <ol className="mt-4 grid gap-3 border-l-2 border-line pl-5">
                {p.milestones.map((m) => (
                  <li key={m.date} className="grid gap-0.5">
                    <span className="num text-[13px] font-bold text-gold">{m.date}</span>
                    <span className="text-[16px]">{m.text}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>

        <aside className="grid content-start gap-4">
          <div className="grid gap-3 rounded-[14px] border border-line bg-card p-5">
            <p className="eyebrow">In the 3D model</p>
            {scene && (
              <div className="relative aspect-[16/10] overflow-hidden rounded-[10px] bg-paper-2">
                <Image src={conceptImage(p.zone)} alt={`Concept view of the ${p.name.toLowerCase()} area in the 3D model`} fill sizes="320px" className="object-cover" />
              </div>
            )}
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[15px]">
              <dt className="text-muted">Area</dt>
              <dd>{ZONE_SHORT[p.zone]}</dd>
              {zone && (
                <>
                  <dt className="text-muted">Draft size</dt>
                  <dd className="num">{zone.acres.toLocaleString()} acres</dd>
                </>
              )}
              <dt className="text-muted">Phase</dt>
              <dd>{PHASE_NAME[p.phase]}</dd>
            </dl>
            {shared.length > 0 && (
              <p className="text-[14px] text-muted">
                Shares this area with {shared.map((s, i) => (
                  <span key={s.slug}>{i > 0 && " and "}<Link href={`/projects/${s.slug}`}>{s.name.toLowerCase()}</Link></span>
                ))}.
              </p>
            )}
            <Link href={`/explore?zone=${p.zone}`} className="btn btn-royal justify-center">See it in 3D</Link>
            <p className="text-[13px] text-muted">Sizes are a first draft for the family to change.</p>
          </div>
          <div className="grid gap-3 rounded-[14px] bg-navy p-5 text-navy-ink">
            <p className="eyebrow !text-gold-strong">Interested in this project?</p>
            <p className="text-[15px] text-navy-ink/80">We are looking for partners for every part of the town.</p>
            <Link href={`/partner?project=${p.slug}`} className="btn btn-primary justify-center">Talk to the family</Link>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="wrap py-10" aria-labelledby="rel-h">
          <h2 id="rel-h" className="border-b border-line pb-3 text-[2rem]">More in {THEMES[p.theme].name.toLowerCase()}</h2>
          <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((q) => <ProjectCard key={q.slug} p={q} />)}
          </ul>
        </section>
      )}
    </article>
  );
}
