'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Settings, 
  ShoppingBag, 
  CheckCircle2, 
  Eye, 
  Edit, 
  Trash2,
  PlusCircle,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { deleteProduct, updateProfile } from './actions'

type Listing = {
  id: string
  name: string
  price: number
  is_verified: boolean
  views_count: number
  image_url: string | null
  category: string
}

type DashboardClientProps = {
  listings: Listing[]
  profile: {
    full_name: string
    phone_number: string
  } | null
  stats: {
    total: number
    verified: number
    views: number
  }
}

export function DashboardClient({ listings, profile, stats }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'listings' | 'settings'>('listings')
  const [isPending, startTransition] = useTransition()

  const handleDelete = async (id: string, imageUrl: string | null) => {
    if (confirm('Haqiqatdan ham o\'chirmoqchimisiz?')) {
      startTransition(async () => {
        await deleteProduct(id, imageUrl)
      })
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  }

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-3"
      >
        <motion.div variants={item}>
          <Card className="rounded-[24px] border-slate-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">E&apos;lonlarim</p>
                  <p className="text-2xl font-black text-slate-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="rounded-[24px] border-slate-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Tasdiqlangan</p>
                  <p className="text-2xl font-black text-slate-900">{stats.verified}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="rounded-[24px] border-slate-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                  <Eye className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Ko&apos;rilishlar</p>
                  <p className="text-2xl font-black text-slate-900">{stats.views}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('listings')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-colors ${
            activeTab === 'listings' 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          E&apos;lonlar boshqaruvi
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-colors ${
            activeTab === 'settings' 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Settings className="h-4 w-4" />
          Sozlamalar
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'listings' ? (
          <motion.div
            key="listings"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {listings.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {listings.map((p) => (
                  <Card key={p.id} className="overflow-hidden rounded-[24px] border-slate-200 shadow-sm transition-all hover:shadow-md">
                    <div className="relative aspect-video">
                      <Image 
                        src={p.image_url || '/placeholder.png'} 
                        alt={p.name} 
                        fill 
                        className="object-cover" 
                      />
                      <div className="absolute right-2 top-2">
                        {p.is_verified ? (
                          <Badge className="bg-emerald-500 text-white border-none">Tasdiqlangan</Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">Kutilmoqda</Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="line-clamp-1 font-bold text-slate-900">{p.name}</h3>
                      <p className="mt-1 text-lg font-black text-primary">{formatCurrency(p.price, "UZS")}</p>
                      
                      <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <Eye className="h-3 w-3" />
                        {p.views_count} marta ko&apos;rildi
                      </div>

                      <div className="mt-6 flex gap-2">
                        <Button variant="outline" className="flex-1 rounded-xl" asChild>
                          <Link href={`/dashboard/edit/${p.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Tahrirlash
                          </Link>
                        </Button>
                        <Button 
                          variant="destructive" 
                          className="rounded-xl px-3" 
                          onClick={() => handleDelete(p.id, p.image_url)}
                          disabled={isPending}
                        >
                          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-slate-200 bg-slate-50 py-20 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <ShoppingBag className="h-10 w-10" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-slate-900">Hali e&apos;lonlaringiz yo&apos;q</h3>
                <p className="mt-2 text-slate-500">Birinchi e&apos;loningizni joylashtiring va soting!</p>
                <Button className="mt-8 rounded-2xl h-12 px-8 font-bold shadow-lg shadow-primary/20" asChild>
                  <Link href="/add-listing">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    E&apos;lon qo&apos;shish
                  </Link>
                </Button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="settings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-2xl"
          >
            <Card className="rounded-[32px] border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50/50 pb-6 pt-8 px-8">
                <CardTitle className="text-2xl font-black text-slate-900">Profil sozlamalari</CardTitle>
                <CardDescription>Shaxsiy ma&apos;lumotlaringizni yangilang</CardDescription>
              </CardHeader>
              <form action={updateProfile}>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">To&apos;liq ism</label>
                    <input 
                      name="full_name"
                      type="text" 
                      defaultValue={profile?.full_name || ''} 
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Telefon raqami</label>
                    <input 
                      name="phone_number"
                      type="text" 
                      defaultValue={profile?.phone_number || ''} 
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20 mt-4">
                    O&apos;zgarishlarni saqlash
                  </Button>
                </CardContent>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
