"use client";

import { useState } from "react";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Settings, 
  CheckCircle2, 
  Eye, 
  PlusCircle, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  Loader2,
  AlertCircle,
  Edit
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { deleteListing } from "./actions";
import { Listing } from "@/types/database";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "@/hooks/use-profile";

type DashboardClientProps = {
  listings: Listing[]
  profile: {
    full_name: string
    phone_number: string
    role: string
    experience_years?: number
    successful_reviews_count?: number
  } | null
  stats: {
    total: number
    verified: number
    views: number
  }
}

export function DashboardClient({ listings, profile, stats }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'listings' | 'settings'>('listings');
  const { isPending, error, success, handleUpdateProfile } = useProfile(profile);

  const isModerator = profile?.role === 'moderator';

  const handleDelete = async (id: string) => {
    if (confirm("Ushbu e'lonni o'chirishni xohlaysizmi?")) {
      try {
        await deleteListing(id);
      } catch (err) {
        alert("Xatolik yuz berdi");
      }
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Mening Dashboardim</h1>
          <p className="mt-2 text-slate-500 font-medium">E&apos;lonlaringizni boshqaring va statistikani kuzating</p>
        </motion.div>
        
        <div className="flex flex-wrap gap-3">
          <Button asChild className="rounded-2xl h-12 px-6 font-bold shadow-lg shadow-primary/20">
            <Link href="/add-listing">
              <PlusCircle className="mr-2 h-5 w-5" />
              Yangi e&apos;lon
            </Link>
          </Button>
          {isModerator && (
            <Button asChild variant="secondary" className="rounded-2xl h-12 px-6 font-bold bg-slate-900 text-white hover:bg-slate-800">
              <Link href="/moderator">
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Checker Panel
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-4">
          <Card className="rounded-[32px] border-slate-100 shadow-sm overflow-hidden bg-white">
            <CardContent className="p-3">
              <div className="space-y-1">
                <button
                  onClick={() => setActiveTab('listings')}
                  className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
                    activeTab === 'listings' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <ShoppingBag className="h-5 w-5" />
                  E&apos;lonlarim
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${
                    activeTab === 'settings' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  Sozlamalar
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 gap-4">
            <Card className="rounded-[32px] border-none bg-emerald-50 p-6">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Tasdiqlangan</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-700">{stats.verified}</span>
                <span className="text-xs font-bold text-emerald-600/60">ta</span>
              </div>
            </Card>
            <Card className="rounded-[32px] border-none bg-primary/5 p-6">
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Ko&apos;rishlar</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-primary">{stats.views}</span>
                <span className="text-xs font-bold text-primary/60">marta</span>
              </div>
            </Card>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-9">
          <AnimatePresence mode="wait">
            {activeTab === 'listings' ? (
              <motion.div
                key="listings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {listings.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {listings.map((listing) => (
                      <Card key={listing.id} className="rounded-[32px] border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-300">
                        <div className="relative aspect-video overflow-hidden">
                          <Image src={listing.image_url || "/placeholder.png"} alt={listing.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                          <div className="absolute top-4 right-4 flex gap-2">
                            <Badge className={`${
                              listing.status === 'approved' ? 'bg-emerald-500' : 
                              listing.status === 'rejected' ? 'bg-red-500' : 'bg-amber-500'
                            } text-white border-none font-bold uppercase tracking-widest text-[9px] px-3 py-1 shadow-lg`}>
                              {listing.status === 'approved' ? 'SAYTDA' : 
                               listing.status === 'rejected' ? 'RAD ETILDI' : 'KUTILMOQDA'}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-black text-lg text-slate-900 group-hover:text-primary transition-colors line-clamp-1">{listing.name}</h3>
                              <p className="text-sm font-bold text-primary mt-1">{new Intl.NumberFormat("ru-RU").format(listing.price)} so&apos;m</p>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <Eye className="h-4 w-4" />
                              <span className="text-xs font-bold">{listing.views_count || 0}</span>
                            </div>
                          </div>
                          
                          <Separator className="mb-6 opacity-50" />
                          
                          <div className="flex gap-2">
                            <Button asChild variant="outline" className="flex-1 rounded-xl font-bold h-11 border-slate-200 hover:bg-slate-50">
                              <Link href={`/dashboard/edit/${listing.id}`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Tahrirlash
                              </Link>
                            </Button>
                            <Button 
                              variant="ghost" 
                              onClick={() => handleDelete(listing.id)}
                              className="h-11 w-11 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 p-0"
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                            <Button asChild variant="ghost" className="h-11 w-11 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/5 p-0">
                              <Link href={`/products/${listing.id}`} target="_blank">
                                <ExternalLink className="h-5 w-5" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="rounded-[40px] border-2 border-dashed border-slate-200 bg-slate-50/50 p-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center shadow-sm mb-6">
                        <ShoppingBag className="h-10 w-10 text-slate-200" />
                      </div>
                      <h3 className="text-2xl font-black text-slate-900">Hali e&apos;lonlaringiz yo&apos;q</h3>
                      <p className="text-slate-500 mt-2 max-w-sm font-medium">Sotmoqchi bo&apos;lgan narsangiz bormi? Birinchi e&apos;loningizni hoziroq joylashtiring!</p>
                      <Button asChild className="mt-8 rounded-2xl h-14 px-10 text-lg font-black shadow-xl shadow-primary/20">
                        <Link href="/add-listing">E&apos;lon berish</Link>
                      </Button>
                    </div>
                  </Card>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="rounded-[40px] border-slate-100 shadow-xl overflow-hidden bg-white">
                  <CardHeader className="bg-slate-50/50 p-10 pb-8">
                    <CardTitle className="text-2xl font-black text-slate-900">Profil sozlamalari</CardTitle>
                    <CardDescription className="text-slate-500 font-medium text-base">Shaxsiy ma&apos;lumotlaringizni yangilang</CardDescription>
                  </CardHeader>
                  <form action={handleUpdateProfile}>
                    <CardContent className="p-10 space-y-8">
                      {isModerator && (
                        <div className="grid gap-4 sm:grid-cols-2 mb-2">
                          <div className="rounded-[24px] bg-emerald-50 p-6 border border-emerald-100">
                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Muvaffaqiyatli tekshiruvlar</p>
                            <p className="text-3xl font-black text-emerald-700">{profile?.successful_reviews_count || 0} ta</p>
                          </div>
                          <div className="rounded-[24px] bg-amber-50 p-6 border border-amber-100">
                            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Ish tajribasi</p>
                            <p className="text-3xl font-black text-amber-700">{profile?.experience_years || 0} yil</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label htmlFor="full_name" className="text-sm font-bold text-slate-700 ml-1">To&apos;liq ism</Label>
                          <Input 
                            id="full_name" 
                            name="full_name" 
                            defaultValue={profile?.full_name} 
                            placeholder="Ali Valiyev" 
                            className="rounded-2xl border-slate-200 h-14 pl-6 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-base font-medium" 
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="phone_number" className="text-sm font-bold text-slate-700 ml-1">Telefon raqami</Label>
                          <Input 
                            id="phone_number" 
                            name="phone_number" 
                            defaultValue={profile?.phone_number} 
                            placeholder="+998 90 123 45 67" 
                            className="rounded-2xl border-slate-200 h-14 pl-6 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-base font-medium" 
                          />
                        </div>
                      </div>

                      {error && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-destructive/10 p-4 flex items-center gap-3 text-destructive border border-destructive/10">
                          <AlertCircle className="h-5 w-5" />
                          <p className="text-sm font-bold">{error}</p>
                        </motion.div>
                      )}

                      {success && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-emerald-50 p-4 flex items-center gap-3 text-emerald-600 border border-emerald-100">
                          <CheckCircle2 className="h-5 w-5" />
                          <p className="text-sm font-bold">Profil muvaffaqiyatli yangilandi!</p>
                        </motion.div>
                      )}

                      <Button 
                        type="submit" 
                        disabled={isPending}
                        className="w-full h-14 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : "Saqlash"}
                      </Button>
                    </CardContent>
                  </form>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
