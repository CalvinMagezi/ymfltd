import type { Metadata, Viewport } from "next";
import "@fontsource-variable/epilogue";
import "@fontsource-variable/source-sans-3";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ymfltd.com"),
  title: {
    default: "Yesero Mugenyi Foundation | New Kikwite Town, Hoima",
    template: "%s | Yesero Mugenyi Foundation",
  },
  description:
    "The Yesero Mugenyi Foundation is planning New Kikwite Town, an agro-industrial satellite town on 1,280 acres of family land southeast of Hoima, Uganda. Explore the plan in 3D.",
  openGraph: {
    type: "website",
    siteName: "Yesero Mugenyi Foundation",
    images: ["/images/concept/hero.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f5ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1612" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-dvh flex flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 btn">
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
