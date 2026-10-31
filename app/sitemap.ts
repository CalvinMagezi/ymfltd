import type { MetadataRoute } from "next";
import { PROJECTS } from "@/lib/content/projects";

const BASE = "https://www.ymfltd.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/explore", "/projects", "/story", "/hoima", "/partner"].map((p) => ({ url: `${BASE}${p}` }));
  return [...pages, ...PROJECTS.map((p) => ({ url: `${BASE}/projects/${p.slug}` }))];
}
