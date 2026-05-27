import Link from "next/link";
import { Hammer, LayoutGrid, PlusCircle, User, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";

const nav = [
  { href: "/", label: "Bosh sahifa" },
  { href: "/products", label: "Mahsulotlar" },
];

export async function SiteHeader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold tracking-tight text-slate-900 transition-opacity hover:opacity-90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
            <Hammer className="h-6 w-6" aria-hidden />
          </div>
          <span className="hidden text-xl sm:inline">
            Atdar<span className="text-primary">.uz</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Button key={item.href} variant="ghost" className="rounded-xl font-medium text-slate-600 hover:text-primary" asChild>
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
          {user && (
            <Button variant="ghost" className="rounded-xl font-medium text-slate-600 hover:text-primary" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden rounded-xl" asChild>
            <Link href="/products" aria-label="Mahsulotlar">
              <LayoutGrid className="h-5 w-5" />
            </Link>
          </Button>

          {user ? (
            <div className="flex items-center gap-2">
              <Button size="sm" className="hidden sm:inline-flex rounded-xl font-bold shadow-lg shadow-primary/20" asChild>
                <Link href="/add-listing">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  E&apos;lon joylashtirish
                </Link>
              </Button>
              <form action={signOut}>
                <Button size="icon" variant="ghost" className="rounded-xl text-slate-500 hover:text-destructive" type="submit">
                  <LogOut className="h-5 w-5" />
                </Button>
              </form>
              <Link href="/dashboard" className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                <User className="h-5 w-5" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="rounded-xl font-bold text-slate-600" asChild>
                <Link href="/login">Kirish</Link>
              </Button>
              <Button size="sm" className="rounded-xl font-bold shadow-lg shadow-primary/20" asChild>
                <Link href="/register">Ro&apos;yxatdan o&apos;tish</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
