import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Search, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

export default async function HomePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id,name,price,image_url,is_verified")
    .eq("is_verified", true)
    .order("id", { ascending: false })
    .limit(6);

  const latest = data ?? [];
  return (
    <div className="bg-slate-50">
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-white via-slate-100 to-sky-100">
        <div className="pointer-events-none absolute -left-10 top-10 h-52 w-52 rounded-full bg-cyan-300/30 blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute -right-10 bottom-10 h-56 w-56 rounded-full bg-indigo-300/30 blur-3xl animate-pulse" />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-accent">
              Premium Marketplace
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Xush kelibsiz! Atdar platformasida savdo qilish endi yanada oson
            </h1>
            <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Hamkorlik va xaridlar uchun ishonchli ko‘prik qurdik. Siz ham bizga qo‘shiling! <br />Xaridor bo‘lasizmi yoki tadbirkor – biz sizga xavfsiz, shaffof va maksimal darajada qulay savdo maydonini taklif etamiz. 
            </p>
          </div>

          <form action="/products" method="get" className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="q"
                placeholder="Mahsulot qidirish..."
                className="h-12 rounded-xl border-slate-300 bg-white pl-10"
                aria-label="Qidiruv"
              />
            </div>
            <Button type="submit" size="lg" className="h-12 shrink-0 rounded-xl">
              Qidirish
            </Button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Qanday ishlaydi?
          </h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { n: "1", t: "E'lon berish", d: "Mahsulotingizni bir necha daqiqada joylang." },
            { n: "2", t: "Biz tekshiramiz", d: "Jamoa mahsulot ma'lumotini tekshiradi." },
            { n: "3", t: "Xavfsiz savdo", d: "Xaridor bilan tez va ishonchli bog'laning." },
          ].map((s) => (
            <Card key={s.n} className="rounded-2xl border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardDescription className="text-primary">0{s.n}</CardDescription>
                <CardTitle className="text-xl">{s.t}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{s.d}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="mx-auto max-w-7xl" />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Eng so&apos;nggi e&apos;lonlar</h2>
            <p className="text-muted-foreground">Yangi qo&apos;shilgan mahsulotlar.</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/products">
              Barchasini ko&apos;rish
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((item) => (
            <Link key={item.id} href={`/products/${item.id}`} className="block">
              <Card className="overflow-hidden h-full rounded-2xl border-slate-200 bg-white shadow-sm transition-all hover:scale-[1.02] hover:shadow-md active:scale-[0.98]">
                <div className="relative aspect-[16/10] bg-slate-100">
                  {item.image_url ? (
                    <Image src={item.image_url} alt={item.name ?? "Mahsulot"} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Rasm yo&apos;q</div>
                  )}
                  {item.is_verified && (
                    <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 shadow-sm">
                      <ShieldCheck className="h-3 w-3" />
                      Atdar Verified
                    </div>
                  )}
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="line-clamp-1 text-base text-slate-800">{item.name ?? "Nomsiz"}</CardTitle>
                  <CardDescription className="text-lg font-bold text-primary">
                    {formatCurrency(item.price ?? 0, "UZS")}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="inline-flex items-center gap-2 text-sm text-slate-600">
            <ShieldCheck className="h-4 w-4 text-primary" /> Tekshiruv tizimi
          </div>
          <div className="inline-flex items-center gap-2 text-sm text-slate-600">
            <CheckCircle2 className="h-4 w-4 text-primary" /> Ishonchli listinglar
          </div>
          <div className="inline-flex items-center gap-2 text-sm text-slate-600">
            <ArrowRight className="h-4 w-4 text-primary" /> Tez va qulay savdo
          </div>
        </div>
      </section>
    </div>
  );
}
