"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  ShoppingBag, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  X
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { uzbekistanLocations, uzbekistanRegions } from "@/data/locations";
import { createClient } from "@/lib/supabase/client";

const CATEGORY_SLOTS: Record<string, string[]> = {
  kvartira: ["Zal", "Oshxona", "Yotoqxona"],
  qurilish: ["Asosiy"],
  texnika: ["Asosiy"],
};

const listingSchema = z.object({
  name: z.string().min(3, "Nomi kamida 3 ta harfdan iborat bo'lishi kerak"),
  description: z.string().min(10, "Tavsif kamida 10 ta harfdan iborat bo'lishi kerak"),
  price: z.preprocess((val) => Number(val), z.number().min(1000, "Narxi 1000 so'mdan kam bo'lmasligi kerak")),
  category: z.string().min(1, "Kategoriyani tanlang"),
  condition: z.string().min(1, "Holatni tanlang"),
  usage_duration: z.string().min(1, "Ishlatilganlik muddatini kiriting"),
  phone_number: z.string().regex(/^\+998\d{9}$/, "Telefon raqami noto'g'ri (+998XXXXXXXXX)"),
  region: z.string().min(1, "Viloyatni tanlang"),
  district: z.string().min(1, "Tumanni tanlang"),
});

type ListingValues = z.infer<typeof listingSchema>;

export function AddListingForm() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  
  const [imagesBySlot, setImagesBySlot] = useState<Record<string, File[]>>({});
  const [previewsBySlot, setPreviewsBySlot] = useState<Record<string, string[]>>({});

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ListingValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      category: "qurilish",
      condition: "ishlatilgan",
      region: uzbekistanRegions[0],
      district: uzbekistanLocations[uzbekistanRegions[0]][0],
    }
  });

  const kategoriya = watch("category");
  const region = watch("region");
  const district = watch("district");
  const holati = watch("condition");

  const currentSlots = CATEGORY_SLOTS[kategoriya] || ["Asosiy"];

  const handleImageChange = (slot: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentSlotImages = imagesBySlot[slot] || [];
    
    if (files.length + currentSlotImages.length > 5) {
      alert("Har bir bo'lim uchun maksimal 5 ta rasm yuklash mumkin");
      return;
    }
    
    const newImages = [...currentSlotImages, ...files];
    setImagesBySlot(prev => ({ ...prev, [slot]: newImages }));
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewsBySlot(prev => ({ ...prev, [slot]: [...(prev[slot] || []), ...newPreviews] }));
  };

  const removeImage = (slot: string, index: number) => {
    setImagesBySlot(prev => ({
      ...prev,
      [slot]: prev[slot].filter((_, i) => i !== index)
    }));
    setPreviewsBySlot(prev => ({
      ...prev,
      [slot]: prev[slot].filter((_, i) => i !== index)
    }));
  };

  const isFormValid = () => {
    if (kategoriya === "kvartira") {
      return currentSlots.every(slot => (imagesBySlot[slot] || []).length >= 2);
    }
    return Object.values(imagesBySlot).some(files => files.length > 0);
  };

  async function compressImage(file: File): Promise<Blob> {
    const bitmap = await createImageBitmap(file);
    const maxSide = 1200;
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas error");
    ctx.drawImage(bitmap, 0, 0, width, height);

    return await new Promise((resolve, reject) => {
      canvas.toBlob(b => b ? resolve(b) : reject(new Error("Compression error")), "image/jpeg", 0.7);
    });
  }

  const onSubmit = async (data: ListingValues) => {
    if (!isFormValid()) {
      setServerError("Iltimos, barcha bo'limlar uchun yetarli miqdorda rasm yuklang");
      return;
    }
    setLoading(true);
    setServerError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Tizimga kiring");

      const uploadedUrls: string[] = [];
      const bucketName = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "products";

      for (const slot of currentSlots) {
        const slotFiles = imagesBySlot[slot] || [];
        for (const file of slotFiles) {
          const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
          const path = `products/${fileName}`;
          const compressed = await compressImage(file);
          
          const { error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(path, compressed);
            
          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(path);
            
          uploadedUrls.push(publicUrl);
        }
      }

      const { data: product, error: insertError } = await supabase.from("listings").insert({
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        condition: data.condition,
        usage_duration: data.usage_duration,
        location: `${data.region}, ${data.district}`,
        phone_number: data.phone_number,
        image_url: uploadedUrls[0],
        user_id: user.id,
        is_verified: false,
        is_premium: false,
        views_count: 0
      }).select().single();

      if (insertError) throw insertError;

      if (product) {
        const imagesToInsert = uploadedUrls.map((url, index) => ({
          listing_id: product.id,
          url: url,
          display_order: index
        }));

        await supabase.from("images").insert(imagesToInsert);

        try {
          await fetch("/api/telegram/notify", {
            method: "POST",
            body: JSON.stringify({
              name: data.name,
              price: data.price,
              category: data.category,
              location: `${data.region}, ${data.district}`,
              phone: data.phone_number
            }),
          });
        } catch (tgErr) {
          console.error("Telegram notification error:", tgErr);
        }
      }

      setSuccess(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="mx-auto max-w-2xl rounded-[32px] border-slate-100 p-12 text-center shadow-xl">
          <div className="flex flex-col items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="mt-8 text-3xl font-black text-slate-900">Muvaffaqiyatli!</h2>
            <p className="mt-4 text-lg text-slate-500">E&apos;loningiz muvaffaqiyatli joylashtirildi va tez orada ko&apos;rib chiqiladi.</p>
            <div className="mt-10 flex gap-4">
              <Button className="rounded-2xl h-12 px-8 font-bold shadow-lg shadow-primary/20" asChild>
                <a href="/dashboard">Dashboardga o&apos;tish</a>
              </Button>
              <Button variant="outline" className="rounded-2xl h-12 px-8 font-bold" onClick={() => window.location.reload()}>
                Yana qo&apos;shish
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-4xl space-y-8 pb-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Yangi e&apos;lon</h1>
        <p className="text-lg text-slate-500">Mahsulotingiz haqida ma&apos;lumotlarni kiriting</p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-[32px] border-slate-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 p-8 pb-6">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Asosiy ma&apos;lumotlar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-bold text-slate-700">Mahsulot nomi</Label>
                <Input id="name" {...register("name")} placeholder="Masalan: Armatura 12mm" className={`rounded-xl h-12 border-slate-200 ${errors.name ? 'border-destructive' : ''}`} />
                {errors.name && <p className="text-xs text-destructive font-bold">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-bold text-slate-700">Tavsif</Label>
                <Textarea id="description" {...register("description")} placeholder="Mahsulot holati va xususiyatlari haqida batafsil..." className={`rounded-xl min-h-[150px] border-slate-200 ${errors.description ? 'border-destructive' : ''}`} />
                {errors.description && <p className="text-xs text-destructive font-bold">{errors.description.message}</p>}
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-bold text-slate-700">Narxi (so&apos;m)</Label>
                  <Input id="price" type="number" {...register("price")} placeholder="1500000" className={`rounded-xl h-12 border-slate-200 ${errors.price ? 'border-destructive' : ''}`} />
                  {errors.price && <p className="text-xs text-destructive font-bold">{errors.price.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">Kategoriya</Label>
                  <Select value={kategoriya} onValueChange={(val) => {
                    setValue("category", val);
                    setImagesBySlot({});
                    setPreviewsBySlot({});
                  }}>
                    <SelectTrigger className="rounded-xl h-12 border-slate-200">
                      <SelectValue placeholder="Tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="qurilish">Qurilish</SelectItem>
                      <SelectItem value="texnika">Texnika</SelectItem>
                      <SelectItem value="kvartira">Kvartira</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">Holati</Label>
                  <Select value={holati} onValueChange={(val) => setValue("condition", val)}>
                    <SelectTrigger className="rounded-xl h-12 border-slate-200">
                      <SelectValue placeholder="Tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yangi">Yangi</SelectItem>
                      <SelectItem value="ishlatilgan">Ishlatilgan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {currentSlots.map((slot) => (
            <Card key={slot} className="rounded-[32px] border-slate-100 shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50/50 p-8 pb-6">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  {slot} rasmlari {kategoriya === "kvartira" && "(kamida 2 ta)"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-3 gap-4">
                  {(previewsBySlot[slot] || []).map((src, i) => (
                    <motion.div 
                      key={i} 
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 group"
                    >
                      <Image src={src} alt={`${slot} preview`} fill className="object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeImage(slot, i)}
                        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 text-destructive flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                  {(imagesBySlot[slot] || []).length < 5 && (
                    <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group">
                      <Upload className="h-8 w-8 text-slate-400 group-hover:text-primary transition-colors" />
                      <span className="text-xs font-bold text-slate-500 group-hover:text-primary">Rasm qo&apos;shish</span>
                      <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleImageChange(slot, e)} />
                    </label>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right Column: Details */}
        <div className="space-y-6">
          <Card className="rounded-[32px] border-slate-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 p-8 pb-6">
              <CardTitle className="text-xl font-bold">Aloqa va joylashuv</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="usage_duration" className="text-sm font-bold text-slate-700">Ishlatilganlik muddati</Label>
                <Input id="usage_duration" {...register("usage_duration")} placeholder="Yangi / 1 yil" className={`rounded-xl h-12 border-slate-200 ${errors.usage_duration ? 'border-destructive' : ''}`} />
                {errors.usage_duration && <p className="text-xs text-destructive font-bold">{errors.usage_duration.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700">Viloyat</Label>
                <Select value={region} onValueChange={val => { 
                  setValue("region", val); 
                  setValue("district", uzbekistanLocations[val][0]);
                }}>
                  <SelectTrigger className="rounded-xl h-12 border-slate-200">
                    <SelectValue placeholder="Tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {uzbekistanRegions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700">Tuman</Label>
                <Select value={district} onValueChange={(val) => setValue("district", val)}>
                  <SelectTrigger className="rounded-xl h-12 border-slate-200 bg-white">
                    <SelectValue placeholder="Tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {uzbekistanLocations[region].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number" className="text-sm font-bold text-slate-700">Telefon raqami</Label>
                <Input id="phone_number" {...register("phone_number")} placeholder="+998XXXXXXXXX" className={`rounded-xl h-12 border-slate-200 ${errors.phone_number ? 'border-destructive' : ''}`} />
                {errors.phone_number && <p className="text-xs text-destructive font-bold">{errors.phone_number.message}</p>}
              </div>
            </CardContent>
          </Card>

          <AnimatePresence>
            {serverError && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-2xl bg-destructive/10 p-4 flex items-start gap-3 text-destructive border border-destructive/20"
              >
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <p className="text-sm font-bold">{serverError}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <Button 
            type="submit" 
            disabled={loading || !isFormValid()}
            className="w-full h-16 rounded-[24px] text-lg font-black shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
                <span className="animate-pulse">E&apos;lon yuklanmoqda...</span>
              </div>
            ) : (
              "E'lonni joylashtirish"
            )}
          </Button>
          {!isFormValid() && !loading && (
            <p className="text-center text-xs text-slate-400 mt-2">
              Barcha bo&apos;limlarga rasm yuklangandan so&apos;ng tugma faollashadi.
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
