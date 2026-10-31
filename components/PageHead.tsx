import Image from "next/image";
import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  image?: { src: string; alt: string; label?: string };
  children?: ReactNode;
};

/** Royal-navy page opener shared by the inner pages. */
export default function PageHead({ eyebrow, title, lead, image, children }: Props) {
  return (
    <header className="relative isolate overflow-hidden bg-navy-2 text-navy-ink">
      <div className={`wrap grid gap-8 py-14 md:py-20 ${image ? "lg:grid-cols-[1.05fr_1fr] lg:items-center" : ""}`}>
        <div className="grid content-start gap-4">
          <p className="eyebrow !text-gold-strong">{eyebrow}</p>
          <h1 className="max-w-[18ch] text-[clamp(2.5rem,5.4vw,4.4rem)]">{title}</h1>
          {lead ? <div className="max-w-[58ch] text-[clamp(1.05rem,1.5vw,1.2rem)] text-navy-ink/85">{lead}</div> : null}
          {children}
        </div>
        {image ? (
          <figure className="relative aspect-[16/10] overflow-hidden rounded-[14px] ring-1 ring-gold-strong/40">
            <Image src={image.src} alt={image.alt} fill loading="eager" fetchPriority="high" quality={60} sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
            {image.label ? <figcaption className="aimp">{image.label}</figcaption> : null}
          </figure>
        ) : null}
      </div>
    </header>
  );
}
