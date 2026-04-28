import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

import "./globals.css";

const fontSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Atdar.uz - Ishonchli va Tekshirilgan Resale Bozori",
  description:
    "O'zbekistondagi birinchi tekshirilgan qurilish materiallari, texnika va uskunalar bozori. Bizda har bir mahsulot mutaxassislar tomonidan nazorat qilinadi.",
  keywords: "resale uzbekistan, qurilish mollari, ishlatilgan telefonlar, texnika bozor, atdar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body className={`${fontSans.variable} min-h-screen font-sans`}>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
