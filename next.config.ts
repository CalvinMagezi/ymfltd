import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // AVIF first, WebP as the fallback; both far smaller than the source JPEGs.
    formats: ["image/avif", "image/webp"],
    qualities: [50, 60, 75],
    deviceSizes: [640, 750, 828, 1080, 1280, 1600, 1920],
  },
  // experimental.inlineCss was tried and left off: Next copies the inlined CSS into the RSC payload too,
  // which made every page's HTML about 110 KB larger and scored worse than two small cached stylesheets.
};

export default nextConfig;
