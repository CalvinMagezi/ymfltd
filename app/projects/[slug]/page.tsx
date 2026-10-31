import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROJECTS, THEMES, STATUS_NOTE, projectBySlug } from "@/lib/content/projects";
import { ZONE_SHORT } from "@/lib/content/zones";
import { ProjectCard, StatusChip, conceptImage } from "@/components/ProjectBits";
import plan from "@/public/explore/plan.json";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) return {};
  return { title: p.name, description: p.summary, openGraph: { images: [conceptImage(p.zone)] } };
}

const PHASE_NAME = ["Today", "Phase 1", "Phase 2", "Phase 3"];

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) notFound();
  const zone = (plan.zones as { id: string; acres: number }[]).find((z) => z.id === p.zone);
  const shared = PROJECTS.filter((q) => q.zone === p.zone && q.slug !== p.slug);
  const related = PROJECTS.filter((q) => q.theme === p.theme && q.slug !== p.slug).slice(0, 3);

  return (
    <article>
      <div className="wrap pt-8">
        <nav aria-label="Breadcrumb" className="text-[14px] text-muted">
          <Link href="/projects" className="no-underline hover:underline">Projects</Link>
          <span aria-hidden> / </span>
          <span>{THEMES[p.theme].name}</span>
        </nav>
      </div>

      <header className="wrap grid gap-8 py-8 lg:grid-cols-[1fr_1.15fr] lg:items-center">
        <div className="grid gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <StatusChip status={p.status} />
            <span className="chip" style={{ ["--dot" as string]: "transparent" }}>{PHASE_NAME[p.phase]}</span>
          </div>
          <h1 className="text-[clamp(2rem,4vw,3rem)] font-bold leading-tight">{p.name}</h1>
          <p className="max-w-[52ch] text-lg text-muted">{p.summary}</p>
          <p className="text-[14px] text-muted">{STATUS_NOTE[p.status]}.</p>
        </div>
        <figure className="grid gap-2">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line bg-paper-2">
            <Image src={conceptImage(p.zone)} alt={`Concept view of the ${p.name.toLowerCase()} area`} fill priority sizes="(min-width: 1024px) 640px, 100vw" className="object-cover" />
          </div>
          <figcaption className="font-mono text-[12px] text-muted">Concept view from the 3D model. Not a final design.</figcaption>
        </figure>
      </header>

      <div className="wrap grid gap-12 py-8 lg:grid-cols-[1fr_320px]">
        <div className="prose-ymf grid gap-0 text-[18px]">
          {p.body.map((para) => <p key={para}>{para}</p>)}
          {p.milestones && (
            <section className="mt-10" aria-labelledby="ms-h">
              <h2 id="ms-h" className="text-xl font-semibold">Milestones</h2>
              <ol className="mt-4 grid gap-3 border-l-2 border-line pl-5">
                {p.milestones.map((m) => (
                  <li key={m.date} className="grid gap-0.5">
                    <span className="font-mono text-[12.5px] text-muted">{m.date}</span>
                    <span className="text-[16px]">{m.text}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>

        <aside className="grid content-start gap-4">
          <div className="grid gap-3 rounded-xl border border-line bg-card p-5">
            <p className="eyebrow">In the 3D model</p>
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
            <Link href={`/explore?zone=${p.zone}`} className="btn btn-primary justify-center">See it in 3D</Link>
            <p className="text-[13px] text-muted">Sizes are a first draft for the family to change.</p>
          </div>
          <div className="grid gap-3 rounded-xl border border-line bg-card p-5">
            <p className="eyebrow">Interested in this project?</p>
            <p className="text-[15px] text-muted">We are looking for partners for every part of the town.</p>
            <Link href={`/partner?project=${p.slug}`} className="btn justify-center">Talk to the family</Link>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="wrap py-10" aria-labelledby="rel-h">
          <h2 id="rel-h" className="border-b border-line pb-3 text-xl font-semibold">More in {THEMES[p.theme].name.toLowerCase()}</h2>
          <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((q) => <ProjectCard key={q.slug} p={q} />)}
          </ul>
        </section>
      )}
    </article>
  );
}
