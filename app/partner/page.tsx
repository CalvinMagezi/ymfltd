import type { Metadata } from "next";
import PageHead from "@/components/PageHead";
import { SCENES } from "@/lib/content/scenes";
import { Suspense } from "react";
import { CONTACT } from "@/lib/content/site";
import EnquiryForm from "@/components/EnquiryForm";

export const metadata: Metadata = {
  title: "Partner with us",
  description: "The Yesero Mugenyi Foundation welcomes partners and investors for New Kikwite Town in Hoima. Tell us how you would like to be involved.",
};

const WHO = [
  { h: "Investors and lenders", p: "For the first phase: the hospital, golf course, hotel and first homes." },
  { h: "Healthcare", p: "Hospital operators, specialists, and suppliers of equipment and medicines." },
  { h: "Hospitality and sport", p: "Hotel brands, golf course developers and sports event organisers." },
  { h: "Education", p: "Universities, school operators and vocational trainers." },
  { h: "Farming and food", p: "Processors, cooperatives, and research partners in dairy, bamboo and crops." },
  { h: "Conservation", p: "Wildlife and eco-tourism specialists for the forest reserve and wetland." },
];

const STEPS = [
  { h: "Tell us about you", p: "Use the form or write to us. Say which project interests you and how you work." },
  { h: "We share the plans", p: "We send the detailed plans and figures that fit your interest, and agree on confidentiality where needed." },
  { h: "Visit the land", p: "We host you in Hoima to walk the land, see the dairy farm and meet the family." },
];

export default function PartnerPage() {
  return (
    <>
      <PageHead
        eyebrow="Partner with us"
        title="Help build a town that Hoima's families share in"
        lead={
          <p>
            The Foundation brings the land, the family&apos;s commitment and the plans. We are looking for partners who bring experience, operations and
            funding to each part of the town. Detailed figures are shared directly with serious partners, not published here.
          </p>
        }
        image={{ src: SCENES.agro.src, alt: SCENES.agro.alt, label: "Artist's impression" }}
      />

      <section className="wrap pt-14" aria-labelledby="who-h">
        <h2 id="who-h" className="text-[clamp(2rem,3.6vw,2.8rem)]">Who we would like to hear from</h2>
        <ul className="mt-5 grid gap-px overflow-hidden rounded-[14px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {WHO.map((w) => (
            <li key={w.h} className="grid content-start gap-1.5 bg-card p-5">
              <h3 className="text-[1.45rem] leading-tight">{w.h}</h3>
              <p className="text-[15px] text-muted">{w.p}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="wrap py-14" aria-labelledby="how-h">
        <h2 id="how-h" className="text-[clamp(2rem,3.6vw,2.8rem)]">How it works</h2>
        <ol className="mt-5 grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.h} className="grid content-start gap-2 border-t-2 border-gold-strong pt-4">
              <span className="num text-[13px] font-bold text-gold">Step {i + 1}</span>
              <h3 className="text-[1.45rem] leading-tight">{s.h}</h3>
              <p className="text-[15px] text-muted">{s.p}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-paper-2" aria-labelledby="form-h">
        <div className="wrap grid gap-10 py-14 lg:grid-cols-[1fr_minmax(0,340px)]">
          <div className="grid content-start gap-5">
            <h2 id="form-h" className="text-[clamp(2rem,3.6vw,2.8rem)]">Send us a message</h2>
            <Suspense fallback={null}>
              <EnquiryForm />
            </Suspense>
          </div>
          <aside className="grid content-start gap-3 rounded-[14px] border border-line bg-card p-6">
            <p className="eyebrow">Or contact us directly</p>
            <p className="text-[17px] font-semibold">{CONTACT.person}</p>
            <p className="select-all">{CONTACT.email}</p>
            <p className="num select-all">{CONTACT.phone}</p>
            <p className="text-muted">{CONTACT.address}</p>
          </aside>
        </div>
      </section>
    </>
  );
}
