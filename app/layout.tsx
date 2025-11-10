import type { Metadata } from "next";
import "./globals.css";
import "../styles/globals.css";
import { ChakraProviderWrapper } from "../components/providers/ChakraProvider";
import Layout from "../components/utils/Layout";

export const metadata: Metadata = {
  title: "YMF Limited - Strategic Investment Opportunities",
  description: "Discover transformative investment opportunities in Uganda's emerging markets with YMF Limited. Strategic partnerships, convergence opportunities, and proven track record.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
          integrity="sha512-42kB9yDlYiCEfx2xVwq0q7hT4uf26FUgSIZBK8uiaEnTdShXjwr8Ip1V4xGJMg3mHkUt9nNuTDxunHF0/EgxLQ=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <ChakraProviderWrapper>
          <Layout>
            {children}
          </Layout>
        </ChakraProviderWrapper>
      </body>
    </html>
  );
}
