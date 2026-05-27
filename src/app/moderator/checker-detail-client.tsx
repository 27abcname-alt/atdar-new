"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, XCircle, MapPin, Clock, Phone, User, Tag, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Listing, ProductImage } from "@/types/database";
import { useModerator } from "@/hooks/use-moderator";
import { motion, AnimatePresence } from "framer-motion";

export function CheckerDetailClient({ listing, images }: { listing: Listing, images: ProductImage[] }) {
  const {
    loading,
    isRejecting,
    setIsRejecting,
    handleApprove,
    handleReject,
    rejectionForm: { register, errors }
  } = useModerator(listing.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8 flex items-center gap-4"
      >
        <Button variant="ghost" size="icon" asChild className="rounded-full h-12 w-12">
          <Link href="/moderator">
            <ArrowLeft className="h-6 w-6" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-black text-slate-900">E&apos;lonni tekshirish</h1>
          <p className="text-slate-500 font-medium">Barcha ma&apos;lumotlarni diqqat bilan ko&apos;rib chiqing</p>
        </div>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left: Content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Images Section */}
          <Card className="rounded-[32px] border-slate-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 p-8 pb-6">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                Mahsulot rasmlari ({images.length} ta)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                {images.map((img, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative aspect-video rounded-2xl overflow-hidden border border-slate-100 shadow-sm"
                  >
                    <Image src={img.url} alt={`Image ${i+1}`} fill className="object-cover" />
                    <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                      {i + 1}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Details Section */}
          <Card className="rounded-[32px] border-slate-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 p-8 pb-6">
              <CardTitle className="text-xl font-bold">Asosiy ma&apos;lumotlar</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid gap-8 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nomi</p>
                  <p className="text-xl font-bold text-slate-900">{listing.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Narxi</p>
                  <p className="text-xl font-black text-primary">{formatCurrency(listing.price, "UZS")}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kategoriya</p>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-bold uppercase tracking-wider">
                    {listing.category}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Holati</p>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none font-bold uppercase tracking-wider">
                    {listing.condition || "Ma'lumot yo'q"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tavsif</p>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  {listing.description || "Tavsif berilmagan."}
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <MapPin className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Manzil</p>
                    <p className="text-sm font-bold text-slate-700">{listing.location || "Toshkent shahri"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <Clock className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ishlatilgan muddati</p>
                    <p className="text-sm font-bold text-slate-700">{listing.usage_duration || "Noma'lum"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <Phone className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Telefon</p>
                    <p className="text-sm font-bold text-slate-700">{listing.phone_number || "Ma'lumot yo'q"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <User className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sotuvchi ID</p>
                    <p className="text-sm font-bold text-slate-700">{listing.user_id.slice(0, 12)}...</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Actions */}
        <div className="lg:col-span-4">
          <Card className="rounded-[32px] border-none shadow-xl overflow-hidden sticky top-8">
            <CardHeader className="bg-slate-900 p-8">
              <CardTitle className="text-xl font-bold text-white">Qaror qabul qiling</CardTitle>
              <CardDescription className="text-slate-400">E&apos;lonni tasdiqlang yoki rad eting</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <Button 
                  onClick={handleApprove}
                  disabled={loading}
                  className="w-full h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-lg font-black shadow-lg shadow-emerald-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading && !isRejecting ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                    <>
                      <CheckCircle2 className="mr-2 h-6 w-6" />
                      Tasdiqlash
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-100"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">yoki</span>
                  </div>
                </div>

                {!isRejecting ? (
                  <Button 
                    onClick={() => setIsRejecting(true)}
                    variant="outline"
                    className="w-full h-14 rounded-2xl border-slate-200 text-slate-600 font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all"
                  >
                    <XCircle className="mr-2 h-5 w-5" />
                    Rad etish
                  </Button>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        Rad etish sababi
                      </p>
                      <Textarea 
                        placeholder="Masalan: Rasmlar sifati past yoki ma'lumotlar noto'g'ri..."
                        className={`rounded-xl border-slate-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/5 min-h-[120px] ${
                          errors.reason ? "border-destructive" : ""
                        }`}
                        {...register("reason")}
                      />
                      {errors.reason && (
                        <p className="text-xs font-bold text-destructive">{errors.reason.message}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        onClick={() => setIsRejecting(false)}
                        className="flex-1 rounded-xl font-bold"
                      >
                        Bekor qilish
                      </Button>
                      <Button 
                        onClick={handleReject}
                        disabled={loading}
                        variant="destructive"
                        className="flex-[2] rounded-xl font-black bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200"
                      >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Rad etish"}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 text-amber-800 text-xs leading-relaxed font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  Eslatma: Qaror qabul qilingandan so&apos;ng foydalanuvchiga bildirishnoma yuboriladi.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
