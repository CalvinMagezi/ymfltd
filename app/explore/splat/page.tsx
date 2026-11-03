import type { Metadata } from "next";
import SplatClient from "@/components/SplatClient";

// An unlisted experiment (YMF-3D-004): kept out of search and the sitemap until the family decides on it.
export const metadata: Metadata = {
  title: "Splat experiment",
  description: "An experimental Gaussian-splat view of the concept model around the hospital district.",
  robots: { index: false, follow: false },
};

export default function SplatPage() {
  return (
    <>
      <h1 className="sr-only">Gaussian splat experiment</h1>
      <SplatClient />
    </>
  );
}
