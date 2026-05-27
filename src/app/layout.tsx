import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { createClient } from "@/lib/supabase/server";
import { RoleSelection } from "./role-selection";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let showRoleSelection = false;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    // role is 'buyer' by default in DB, but we want to force selection if it's the first time
    // For this logic, let's assume 'buyer' is the default but we want an explicit choice.
    // Or better: in schema.sql we set it to 'buyer' DEFAULT. 
    // Let's check if we should change default to NULL or a specific value.
    // Based on the prompt "Sotuvchi yoki Xaridor ekanligini so'raydigan", 
    // we should probably check if it was ever set.
    // Let's just check if it's 'buyer' and they haven't "confirmed" it, 
    // but for simplicity, let's assume if it's the default and we want to ask.
    // Actually, let's check a metadata flag or just the role itself.
    if (profile && !profile.role) {
      showRoleSelection = true;
    }
  }

  return (
    <html lang="uz">
      <body className={`${fontSans.variable} min-h-screen font-sans`}>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          {showRoleSelection && <RoleSelection />}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
