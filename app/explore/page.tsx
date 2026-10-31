import type { Metadata } from "next";
import { Suspense } from "react";
import ExploreClient from "@/components/ExploreClient";

export const metadata: Metadata = {
  title: "Explore in 3D",
  description: "A 3D concept model of New Kikwite Town on the real terrain southeast of Hoima, with a guided tour and the town at each phase.",
};

export default function ExplorePage() {
  return (
    <>
      <h1 className="sr-only">Explore New Kikwite Town in 3D</h1>
      <Suspense fallback={<div className="h-[calc(100dvh-4rem)] bg-paper" />}>
        <ExploreClient />
      </Suspense>
      <section id="credits" className="wrap grid gap-3 pt-12 text-[14.5px] text-muted">
        <h2 className="text-lg font-semibold text-ink">About this model</h2>
        <p className="max-w-[75ch]">
          This is a concept for discussion, not an approved design. The layout is a first draft of how the projects could fit on the land, drawn on
          the real terrain. The edges of the site are shown loosely because the land has not yet been surveyed for this model. Heights are
          exaggerated 1.5 times so the hills read clearly.
        </p>
        <p className="max-w-[75ch]">
          Terrain: SRTM elevation data via AWS Terrain Tiles. Land cover generalised from Sentinel-2 cloudless 2016 by EOX IT Services GmbH
          (contains modified Copernicus Sentinel data 2016), licensed CC BY 4.0. Roads and places: © OpenStreetMap contributors, available under
          the Open Database Licence.
        </p>
      </section>
    </>
  );
}
