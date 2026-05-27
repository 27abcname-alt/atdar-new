import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ChevronRight, Users, Star, MapPin, Clock, Eye, CheckCircle2, AlertCircle } from "lucide-react";
import { PhoneNumberDisplay } from "./phone-number-display";
import { ProductGallery } from "./product-gallery";
import { LiveViewerBadge } from "./live-viewer-badge";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { VerifiedByAtdarBadge } from "@/components/verified-badge";
import { CurrencyDisplay } from "@/components/currency-display";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ id: string }> };

async function getProduct(id: string) {
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("listings")
    .select("*, images(*), profiles:user_id(*), moderator:moderator_id(full_name)")
    .eq("id", id)
    .single();

  if (product) {
    // Increment views count in the background
    await supabase
      .from("listings")
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

import { ReviewForm } from "./review-form";

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const p = await getProduct(id);
  if (!p) notFound();

  const supabase = await createClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, profiles:author_id(full_name)")
    .eq("listing_id", id)
    .order("created_at", { ascending: false });

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
            images={p.images && p.images.length > 0 ? p.images : [{ url: p.image_url || "", display_order: 0 }]}
            isPremium={p.is_premium}
            isVerified={p.is_verified}
            productName={p.name}
          />
        </div>

        {/* Right Column: Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 items-center">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1 text-xs font-bold uppercase tracking-wider h-fit">
                {p.category}
              </Badge>
              <VerifiedByAtdarBadge 
                compact 
                isPending={!p.is_verified} 
                moderatorName={p.moderator?.full_name} 
              />
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

          {/* Seller Section */}
          <Card className="rounded-[24px] border-slate-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 p-6 pb-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-500 uppercase tracking-widest">
                <Users className="h-4 w-4" />
                Sotuvchi ma&apos;lumotlari
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {p.profiles?.full_name?.[0] || "?"}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{p.profiles?.full_name || "Ismi ko'rsatilmagan"}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-slate-600">{p.profiles?.rating || "0.0"} reyting</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Count</p>
                  <p className="text-sm font-black text-emerald-600">{p.profiles?.verified_count || 0} ta</p>
                </div>
              </div>
              <PhoneNumberDisplay phoneNumber={p.phone_number || ""} />
            </CardContent>
          </Card>

          {/* Atdar Inspection Section */}
          <Card className={`overflow-hidden rounded-[24px] border-none shadow-md ${p.is_verified ? 'bg-gradient-to-br from-emerald-50 to-teal-50 ring-1 ring-emerald-100' : 'bg-slate-50 ring-1 ring-slate-200'}`}>
            <CardHeader className="pb-3 pt-5 px-6">
              <CardTitle className={`flex items-center gap-2 text-lg font-bold ${p.is_verified ? 'text-emerald-900' : 'text-slate-800'}`}>
                {p.is_verified ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <AlertCircle className="h-5 w-5 text-slate-400" />}
                Atdar Inspection natijalari
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-5 px-6">
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
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest pt-2">
                    Verified by {p.moderator?.full_name || "Atdar"}
                  </p>
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
        </div>
      </div>

      <Separator className="my-12 opacity-50" />

      <div className="grid gap-12 lg:grid-cols-3">
        {/* Description Section */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-6">Mahsulot tavsifi</h2>
            <div className="rounded-[32px] bg-white p-8 shadow-sm border border-slate-100">
              <p className="whitespace-pre-line text-lg leading-relaxed text-slate-600">
                {p.description || "Ushbu mahsulot uchun qo'shimcha tavsif berilmagan."}
              </p>
            </div>
          </div>

          {/* Reviews Section */}
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-6">Fikr-mulohazalar</h2>
            
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-6">
                <ReviewForm listingId={id} />
              </div>

              <div className="space-y-4">
                {reviews && reviews.length > 0 ? (
                  reviews.map((r) => (
                    <Card key={r.id} className="rounded-[24px] border-slate-100 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold uppercase">
                              {r.profiles?.full_name?.[0] || "A"}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{r.profiles?.full_name || "Anonim"}</p>
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-3 w-3 ${i < r.stars ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {new Date(r.created_at).toLocaleDateString("uz-UZ")}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {r.comment || "Izoh qoldirilmagan."}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="rounded-[32px] bg-slate-50/50 border-2 border-dashed border-slate-200 p-12 text-center h-full flex items-center justify-center">
                    <p className="text-slate-400 font-medium">Hozircha hech qanday fikr qoldirilmagan.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Safety Tips or something else */}
        <div className="space-y-8">
          <Card className="rounded-[32px] bg-primary text-white border-none p-8 shadow-xl shadow-primary/20">
            <h3 className="text-xl font-black mb-4 flex items-center gap-2">
              <ShieldCheck className="h-6 w-6" />
              Xavfsiz savdo
            </h3>
            <ul className="space-y-4">
              {[
                "Pulni oldindan bermang",
                "Mahsulotni shaxsan ko'rib tekshiring",
                "Jamoat joylarida uchrashing",
                "Atdar Verification xizmatidan foydalaning"
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-medium text-white/90">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-white/50" />
                  {tip}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
