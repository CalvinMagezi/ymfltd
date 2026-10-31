import Image from "next/image";
import Link from "next/link";
import type { Project, Status } from "@/lib/content/projects";
import { STATUS_NOTE } from "@/lib/content/projects";
import { sceneForProject } from "@/lib/content/scenes";

const STATUS_DOT: Record<Status, string> = {
  Operating: "var(--ok)",
  Underway: "var(--ok)",
  "In review": "var(--info)",
  "In planning": "var(--info)",
  Research: "var(--warn)",
  Planned: "var(--muted)",
};

export function StatusChip({ status }: { status: Status }) {
  return (
    <span className="chip" style={{ ["--dot" as string]: STATUS_DOT[status] }} title={STATUS_NOTE[status]}>
      {status}
    </span>
  );
}

export const conceptImage = (zone: string) => `/images/concept/${zone}.jpg`;

export function ProjectCard({ p }: { p: Project }) {
  const scene = sceneForProject(p.slug);
  return (
    <li className="min-w-0">
      <Link
        href={`/projects/${p.slug}`}
        className="group grid h-full grid-rows-[auto_1fr] overflow-hidden rounded-[14px] border border-line bg-card no-underline transition-[border-color,box-shadow] hover:border-gold-strong hover:shadow-[0_10px_30px_-18px_rgba(20,34,63,.5)]"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-paper-2">
          <Image
            src={scene ? scene.src : conceptImage(p.zone)}
            alt={scene ? scene.alt : `Concept view of the ${p.name.toLowerCase()} area in the 3D model`}
            fill
            quality={60}
            sizes="(min-width: 1024px) 290px, (min-width: 640px) 50vw, calc(100vw - 40px)"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <span className="aimp !left-2 !bottom-2 !px-2 !py-1 !text-[9.5px]">{scene ? "Artist's impression" : "3D concept model"}</span>
        </div>
        <div className="grid content-start gap-2 p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-[21px] leading-[1.1]">{p.name}</h3>
            <StatusChip status={p.status} />
          </div>
          <p className="text-[15px] leading-snug text-muted">{p.summary}</p>
        </div>
      </Link>
    </li>
  );
}
