import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Eye, Phone, MapPin, Clock, Info, CheckCircle2, AlertCircle, ShieldCheck, ChevronRight, Crown, PhoneCall, Users } from "lucide-react";
import { PhoneNumberDisplay } from "./phone-number-display";
import { ProductGallery } from "./product-gallery";
import { LiveViewerBadge } from "./live-viewer-badge";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { VerifiedByAtdarBadge } from "@/components/verified-badge";
import { CurrencyDisplay } from "@/components/currency-display";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ id: string }> };

async function getProduct(id: string) {
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*, images(*)")
    .eq("id", id)
    .single();

  if (product) {
    // Increment views count in the background
    await supabase
      .from("products")
      .update({ views_count: (product.views_count || 0) + 1 })
      .eq("id", id);
  }

  return product;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const p = await getProduct(id);
  if (!p) return { title: "Mahsulot topilmadi | Atdar.uz" };
  
  const priceText = `${new Intl.NumberFormat("uz-UZ").format(p.price)} so'm`;
  const description = p.description 
    ? `${p.description.slice(0, 150)}...` 
    : `${p.name} - ${priceText}. Atdar.uz platformasida sotilmoqda.`;

  return {
    title: `${p.name} - ${priceText} | Atdar.uz`,
    description: description,
    openGraph: {
      title: p.name,
      description: description,
      images: p.image_url ? [p.image_url] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const p = await getProduct(id);
  if (!p) notFound();

  const imageUrl = p.image_url || `https://picsum.photos/seed/atdar-${id}/800/600`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 min-h-screen bg-slate-50/30">
      <div className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
        <Link href="/" className="hover:text-primary transition-colors">Asosiy</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="hover:text-primary transition-colors">Mahsulotlar</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-900 truncate max-w-[200px]">{p.name}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7">
          <ProductGallery 
            images={p.images && p.images.length > 0 ? p.images : [{ url: p.image_url || "", tartib: 0 }]}
            isPremium={p.is_premium}
            isVerified={p.is_verified}
            productName={p.name}
          />
        </div>

        {/* Right Column: Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1 text-xs font-bold uppercase tracking-wider">
                {p.category}
              </Badge>
              {p.is_verified ? (
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  Tasdiqlangan
                </Badge>
              ) : (
                <Badge variant="outline" className="border-slate-200 text-slate-500 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  Kutilmoqda
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl leading-tight">
              {p.name}
            </h1>

            <div className="pt-2">
              <LiveViewerBadge />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="h-5 w-5 text-slate-400" />
                <span className="text-sm font-medium">{p.location || "Toshkent shahri"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="h-5 w-5 text-slate-400" />
                <span className="text-sm font-medium">Ishlatilgan muddati: {p.usage_duration || "Ma'lumot berilmagan"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Eye className="h-5 w-5 text-slate-400" />
                <span className="text-sm font-bold uppercase tracking-wider">{p.views_count || 0} marta ko&apos;rildi</span>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] bg-white p-6 shadow-sm border border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Hozirgi narxi</p>
            <CurrencyDisplay amount={p.price} />
          </div>

          {/* Atdar Inspection Section */}
          <Card className={`overflow-hidden rounded-[24px] border-none shadow-md ${p.is_verified ? 'bg-gradient-to-br from-emerald-50 to-teal-50 ring-1 ring-emerald-100' : 'bg-slate-50 ring-1 ring-slate-200'}`}>
            <CardHeader className="pb-3 pt-5">
              <CardTitle className={`flex items-center gap-2 text-lg font-bold ${p.is_verified ? 'text-emerald-900' : 'text-slate-800'}`}>
                {p.is_verified ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <AlertCircle className="h-5 w-5 text-slate-400" />}
                Atdar Inspection natijalari
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-5">
              {p.is_verified ? (
                <div className="space-y-3">
                  <p className="text-sm text-emerald-800/80 leading-relaxed font-medium">
                    Ushbu mahsulot Atdar mutaxassislari tomonidan to&apos;liq tekshiruvdan o&apos;tgan.
                  </p>
                  <ul className="grid grid-cols-1 gap-2">
                    {['Haqiqiyligi tasdiqlangan', 'Holati tavsifga mos', 'Sotuvchi tekshirilgan'].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5 fill-emerald-100" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Ushbu mahsulot hali Atdar jamoasi tomonidan rasman tekshirilmagan.
                  </p>
                  <p className="text-xs font-medium text-slate-500 italic">
                    Xarid qilishdan oldin mahsulotni shaxsan tekshirishingizni tavsiya qilamiz.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <PhoneNumberDisplay phoneNumber={p.phone_number || ""} />
            <p className="text-center text-[10px] text-slate-400 font-medium">
              Bog&apos;lanish orqali siz foydalanish shartlariga rozilik bildirasiz.
            </p>
          </div>
        </div>
      </div>

      <Separator className="my-12 opacity-50" />

      {/* Description Section */}
      <div className="max-w-3xl">
        <h2 className="text-2xl font-black text-slate-900 mb-6">Mahsulot tavsifi</h2>
        <div className="rounded-[32px] bg-white p-8 shadow-sm border border-slate-100">
          <p className="whitespace-pre-line text-lg leading-relaxed text-slate-600">
            {p.description || "Ushbu mahsulot uchun qo'shimcha tavsif berilmagan."}
          </p>
        </div>
      </div>
    </div>
  );
}
