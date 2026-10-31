import Image from "next/image";
import Link from "next/link";
import type { Project, Status } from "@/lib/content/projects";
import { STATUS_NOTE } from "@/lib/content/projects";

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
  return (
    <li className="min-w-0">
      <Link
        href={`/projects/${p.slug}`}
        className="group grid h-full grid-rows-[auto_1fr] overflow-hidden rounded-xl border border-line bg-card no-underline transition-colors hover:border-muted"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-paper-2">
          <Image
            src={conceptImage(p.zone)}
            alt={`Concept view of the ${p.name.toLowerCase()} area in the 3D model`}
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
        <div className="grid content-start gap-2 p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-[17px] font-semibold leading-snug">{p.name}</h3>
            <StatusChip status={p.status} />
          </div>
          <p className="text-[15px] leading-snug text-muted">{p.summary}</p>
        </div>
      </Link>
    </li>
  );
}
