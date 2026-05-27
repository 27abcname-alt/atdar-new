"use client";

import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Filter, RotateCcw, Crown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, convertUZStoUSD } from "@/lib/utils";
import { VerifiedByAtdarBadge } from "@/components/verified-badge";
import { SearchBar } from "@/components/features/search-bar";
import { useProducts } from "@/hooks/use-products";
import { motion, AnimatePresence } from "framer-motion";

export type DbProduct = {
  id: string;
  name: string | null;
  price: number | null;
  category: string | null;
  condition: string | null;
  image_url: string | null;
  is_verified: boolean | null;
  is_premium: boolean | null;
  phone_number: string | null;
  moderator?: { full_name: string | null } | null;
};

function formatPrice(n: number) {
  return `${new Intl.NumberFormat("ru-RU").format(n)} so'm`;
}

export function ProductsClient({ list: initialList }: { list: DbProduct[] }) {
  const { list, loading, filters } = useProducts(initialList);

  return (
    <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
      <aside className="sticky top-24 self-start space-y-6">
        <Card className="overflow-hidden border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50/50 pb-4 pt-5">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-bold text-slate-900">
                <Filter className="h-4 w-4 text-primary" />
                Filtrlar
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs text-muted-foreground hover:text-primary"
                onClick={() => {
                  filters.setQuery("");
                  filters.setCategory("hammasi");
                  filters.setCondition("hammasi");
                  filters.setMinPrice(filters.initialMin);
                  filters.setMaxPrice(filters.initialMax);
                  filters.setIsVerifiedOnly(false);
                }}
              >
                <RotateCcw className="mr-1 h-3 w-3" />
                Tozalash
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-5">
            <div className="space-y-3">
              <Label htmlFor="category" className="text-sm font-semibold text-slate-700">Kategoriya</Label>
              <Select value={filters.category} onValueChange={filters.setCategory}>
                <SelectTrigger id="category" className="rounded-xl border-slate-200">
                  <SelectValue placeholder="Barchasi" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="hammasi">Barchasi</SelectItem>
                  <SelectItem value="qurilish">Qurilish</SelectItem>
                  <SelectItem value="texnika">Texnika</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-slate-100" />

            <div className="space-y-3">
              <Label htmlFor="condition" className="text-sm font-semibold text-slate-700">Holati</Label>
              <Select value={filters.condition} onValueChange={filters.setCondition}>
                <SelectTrigger id="condition" className="rounded-xl border-slate-200">
                  <SelectValue placeholder="Barchasi" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="hammasi">Barchasi</SelectItem>
                  <SelectItem value="yangi">Yangi</SelectItem>
                  <SelectItem value="ishlatilgan">Ishlatilgan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-slate-100" />

            <div className="space-y-4">
              <Label className="text-sm font-semibold text-slate-700">Narx oralig&apos;i</Label>
              <div className="space-y-4 rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                  <span>{formatPrice(filters.minPrice)}</span>
                  <span>{formatPrice(filters.maxPrice)}</span>
                </div>
                <div className="space-y-2">
                  <Input
                    type="range"
                    min={filters.initialMin}
                    max={filters.initialMax}
                    step={50_000}
                    value={filters.minPrice}
                    onChange={(e) => filters.setMinPrice(Math.min(Number(e.target.value), filters.maxPrice))}
                    className="h-1.5 cursor-pointer appearance-none rounded-lg bg-slate-200 accent-primary"
                  />
                  <Input
                    type="range"
                    min={filters.initialMin}
                    max={filters.initialMax}
                    step={50_000}
                    value={filters.maxPrice}
                    onChange={(e) => filters.setMaxPrice(Math.max(Number(e.target.value), filters.minPrice))}
                    className="h-1.5 cursor-pointer appearance-none rounded-lg bg-slate-200 accent-primary"
                  />
                </div>
              </div>
            </div>

            <Separator className="bg-slate-100" />

            <div className="flex items-center space-x-3 rounded-xl border border-emerald-100 bg-emerald-50/30 p-3 transition-colors hover:bg-emerald-50/50">
              <Checkbox
                id="verified"
                checked={filters.isVerifiedOnly}
                onCheckedChange={(checked) => filters.setIsVerifiedOnly(checked === true)}
                className="h-5 w-5 rounded-md border-emerald-300 data-[state=checked]:bg-emerald-600"
              />
              <Label
                htmlFor="verified"
                className="flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-emerald-800"
              >
                <ShieldCheck className="h-4 w-4" />
                Faqat Tasdiqlangan
              </Label>
            </div>
          </CardContent>
        </Card>
      </aside>

      <div className="space-y-6">
        <SearchBar 
          onSearch={filters.setQuery} 
          isLoading={loading} 
          placeholder="Qidiruv: mahsulot nomini kiriting..."
          initialValue={filters.query}
        />

        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">
            {list.length} ta mahsulot topildi
          </p>
        </div>

        <motion.ul 
          layout
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
              <motion.li 
                key={p.id} 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="group"
              >
                <Link href={`/products/${p.id}`} className="block h-full">
                  <Card className={`h-full overflow-hidden rounded-[24px] border-2 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] ${p.is_premium ? 'border-amber-400' : 'border-slate-200'}`}>
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {p.image_url ? (
                        <Image
                          src={p.image_url}
                          alt={p.name ?? "Mahsulot rasmi"}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-slate-50 text-sm text-muted-foreground">
                          Rasm mavjud emas
                        </div>
                      )}

                      <div className="absolute right-3 top-3 z-10 flex flex-col items-end gap-2">
                        {p.is_premium && (
                          <div className="flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1.5 text-[11px] font-black text-white shadow-lg ring-2 ring-amber-400/50">
                            <Crown className="h-3.5 w-3.5 fill-white" />
                            <span>VIP</span>
                          </div>
                        )}
                        <VerifiedByAtdarBadge 
                          compact 
                          isPending={!p.is_verified} 
                          moderatorName={p.moderator?.full_name} 
                          className="shadow-lg backdrop-blur-sm ring-1 ring-emerald-500/20"
                        />
                      </div>

                      <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                        {p.category && (
                          <Badge className="bg-slate-900/60 text-white backdrop-blur-md hover:bg-slate-900/80 capitalize border-none">
                            {p.category}
                          </Badge>
                        )}
                        {p.condition && (
                          <Badge variant="secondary" className="bg-white/90 text-slate-900 backdrop-blur-md hover:bg-white capitalize border-none">
                            {p.condition}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <CardHeader className="space-y-1 p-5 pb-2">
                      <h2 className="line-clamp-2 min-h-[3rem] text-lg font-bold leading-tight text-slate-900 group-hover:text-primary transition-colors">
                        {p.name ?? "Nomsiz mahsulot"}
                      </h2>
                    </CardHeader>

                    <CardContent className="space-y-4 p-5 pt-0">
                      <div className="flex flex-col">
                        <span className="text-xl font-black tracking-tight text-primary">
                          {formatCurrency(p.price ?? 0, "UZS")}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          ≈ {formatCurrency(convertUZStoUSD(p.price ?? 0), "USD")}
                        </span>
                      </div>

                      <Button variant="outline" className="w-full rounded-xl border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
                        Batafsil ko&apos;rish
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </div>
  );
}
