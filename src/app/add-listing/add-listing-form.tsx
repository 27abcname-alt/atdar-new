"use client";

import { useState } from "react";
import { z } from "zod";
import { 
  ShoppingBag, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  X
} from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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

const listingSchema = z.object({
  name: z.string().min(3, "Nomi kamida 3 ta harfdan iborat bo'lishi kerak"),
  description: z.string().min(10, "Tavsif kamida 10 ta harfdan iborat bo'lishi kerak"),
  price: z.number().min(1000, "Narxi 1000 so'mdan kam bo'lmasligi kerak"),
  category: z.string().min(1, "Kategoriyani tanlang"),
  usage_duration: z.string().min(1, "Ishlatilganlik muddatini kiriting"),
  location: z.string().min(1, "Manzilni tanlang"),
  phone_number: z.string().regex(/^\+998\d{9}$/, "Telefon raqami noto'g'ri (+998XXXXXXXXX)"),
});

export function AddListingForm() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setImagesPreviews] = useState<string[]>([]);

  const [region, setRegion] = useState(uzbekistanRegions[0]);
  const [district, setDistrict] = useState(uzbekistanLocations[uzbekistanRegions[0]][0]);
  const [kategoriya, setKategoriya] = useState("qurilish");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 3) {
      alert("Maksimal 3 ta rasm yuklash mumkin");
      return;
    }
    
    setImages(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagesPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagesPreviews(prev => prev.filter((_, i) => i !== index));
  };

  async function compressImage(file: File): Promise<Blob> {
    // browser-image-compression o'rnatishda muammo bo'lsa, canvas orqali siqamiz
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

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const rawData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
      category: kategoriya,
      usage_duration: formData.get("usage_duration") as string,
      location: `${region}, ${district}`,
      phone_number: formData.get("phone_number") as string,
    };

    try {
      // 1. Validation
      const validatedData = listingSchema.parse(rawData);

      if (images.length === 0) {
        throw new Error("Kamida bitta rasm yuklang");
      }

      // 2. Get User
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Tizimga kiring");

      // 3. Upload Images
      const uploadedUrls: string[] = [];
      const bucketName = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "products";

      for (const file of images) {
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
        const path = `products/${fileName}`;
        const compressed = await compressImage(file);
        
        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(path, compressed);
          
        if (uploadError) {
          console.error("Storage error details (Upload):", uploadError);
          throw uploadError;
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(path);
          
        uploadedUrls.push(publicUrl);
      }

      // 4. Insert DB
      const { data: product, error: insertError } = await supabase.from("products").insert({
        ...validatedData,
        image_url: uploadedUrls[0],
        user_id: user.id,
        is_verified: false,
        views_count: 0
      }).select().single();

      if (insertError) throw insertError;

      // 5. Insert Images to separate table
      if (product) {
        const imagesToInsert = uploadedUrls.map((url, index) => ({
          mahsulot_id: product.id,
          url: url,
          tartib: index
        }));

        const { error: imagesError } = await supabase
          .from("images")
          .insert(imagesToInsert);

        if (imagesError) console.error("Images insert error:", imagesError);
      }

      setSuccess(true);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError(err instanceof Error ? err.message : "Xatolik yuz berdi");
      }
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
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
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-4xl space-y-8 pb-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Yangi e&apos;lon</h1>
        <p className="text-lg text-slate-500">Mahsulotingiz haqida ma&apos;lumotlarni kiriting</p>
      </div>

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
                <Input id="name" name="name" required placeholder="Masalan: Armatura 12mm" className="rounded-xl h-12 border-slate-200" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-bold text-slate-700">Tavsif</Label>
                <Textarea id="description" name="description" required placeholder="Mahsulot holati va xususiyatlari haqida batafsil..." className="rounded-xl min-h-[150px] border-slate-200" />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-bold text-slate-700">Narxi (so&apos;m)</Label>
                  <Input id="price" name="price" type="number" required placeholder="1500000" className="rounded-xl h-12 border-slate-200" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">Kategoriya</Label>
                  <Select value={kategoriya} onValueChange={setKategoriya}>
                    <SelectTrigger className="rounded-xl h-12 border-slate-200">
                      <SelectValue placeholder="Tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="qurilish">Qurilish</SelectItem>
                      <SelectItem value="texnika">Texnika</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[32px] border-slate-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 p-8 pb-6">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Rasmlar (maks. 3 ta)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-3 gap-4">
                {previews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 group">
                    <Image src={src} alt="Preview" fill className="object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 text-destructive flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {images.length < 3 && (
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group">
                    <Upload className="h-8 w-8 text-slate-400 group-hover:text-primary transition-colors" />
                    <span className="text-xs font-bold text-slate-500 group-hover:text-primary">Rasm qo&apos;shish</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                  </label>
                )}
              </div>
            </CardContent>
          </Card>
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
                <Input id="usage_duration" name="usage_duration" required placeholder="Yangi / 1 yil" className="rounded-xl h-12 border-slate-200" />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700">Viloyat</Label>
                <Select value={region} onValueChange={val => { setRegion(val); setDistrict(uzbekistanLocations[val][0]) }}>
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
                <Select value={district} onValueChange={setDistrict}>
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
                <Input id="phone_number" name="phone_number" required placeholder="+998XXXXXXXXX" className="rounded-xl h-12 border-slate-200" />
              </div>
            </CardContent>
          </Card>

          {error && (
            <div className="rounded-2xl bg-destructive/10 p-4 flex items-start gap-3 text-destructive border border-destructive/20 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-16 rounded-[24px] text-lg font-black shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="relative flex h-6 w-6 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                  <div className="absolute inset-0 h-6 w-6 animate-ping rounded-full bg-white/20" />
                </div>
                <span className="animate-pulse">E&apos;lon yuklanmoqda...</span>
              </div>
            ) : (
              "E'lonni joylashtirish"
            )}
            {loading && (
              <div className="absolute inset-0 bg-primary/10 backdrop-blur-[1px]" />
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
