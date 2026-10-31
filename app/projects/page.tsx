import type { Metadata } from "next";
import { PROJECTS, THEMES, STATUS_NOTE, type Theme, type Status } from "@/lib/content/projects";
import { ProjectCard, StatusChip } from "@/components/ProjectBits";
import PageHead from "@/components/PageHead";
import { SCENES } from "@/lib/content/scenes";

export const metadata: Metadata = {
  title: "Projects",
  description: "The sixteen projects that make up New Kikwite Town, from the dairy farm running today to the hospital, schools and game reserve.",
};

const THEME_ORDER: Theme[] = ["land", "health", "nature", "town"];
const STATUS_ORDER: Status[] = ["Operating", "Underway", "In review", "In planning", "Research", "Planned"];

export default function ProjectsPage() {
  const count = (s: Status) => PROJECTS.filter((p) => p.status === s).length;
  return (
    <>
    <PageHead
      eyebrow="Projects"
      title="Sixteen projects, one town"
      lead={<p>Some are running today, some are in planning with partners, and most are waiting for the right partners and funding. Each one says plainly where it stands.</p>}
      image={{ src: SCENES.aerial.src, alt: SCENES.aerial.alt, label: "Artist's impression" }}
    />
    <div className="wrap pt-12">
      <section aria-label="What each status means" className="rounded-[14px] border border-line bg-card p-5">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {STATUS_ORDER.map((s) => (
            <li key={s} className="flex items-start gap-3">
              <StatusChip status={s} />
              <span className="text-[14.5px] text-muted">
                {STATUS_NOTE[s]} <span className="num text-[12.5px] font-bold">({count(s)})</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12 grid gap-14">
        {THEME_ORDER.map((t) => (
          <section key={t} aria-labelledby={`t-${t}`} className="grid gap-5">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-line pb-3">
              <h2 id={`t-${t}`} className="text-[2rem]">{THEMES[t].name}</h2>
              <p className="text-[15px] text-muted">{THEMES[t].line}</p>
            </div>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {PROJECTS.filter((p) => p.theme === t).map((p) => <ProjectCard key={p.slug} p={p} />)}
            </ul>
          </section>
        ))}
      </div>
      <p className="mt-12 max-w-[70ch] text-[14px] text-muted">
        Pictures marked &ldquo;Artist&apos;s impression&rdquo; were made with AI image tools to show the feel of a place. Pictures marked
        &ldquo;3D concept model&rdquo; are views of the family&apos;s concept model. Neither is a photograph or a final design.
      </p>
    </div>
    </>
  );
}
