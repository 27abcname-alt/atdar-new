"use client";

import { useState } from "react";
import { z } from "zod";
import { 
  ShoppingBag, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  X,
  ArrowLeft
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

type EditListingFormProps = {
  initialData: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    usage_duration: string;
    location: string;
    phone_number: string;
    image_url: string;
  };
};

export function EditListingForm({ initialData }: EditListingFormProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Locations parsing
  const initialLocation = initialData.location || "Toshkent shahri, Toshkent";
  const [initialRegion, initialDistrict] = initialLocation.includes(",") 
    ? initialLocation.split(",").map(s => s.trim()) 
    : ["Toshkent shahri", "Toshkent"];

  const [region, setRegion] = useState(initialRegion);
  const [district, setDistrict] = useState(initialDistrict);
  const [kategoriya, setKategoriya] = useState(initialData.category || "qurilish");

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

      // 2. Update DB
      const { error: updateError } = await supabase
        .from("products")
        .update({
          ...validatedData,
          is_verified: false, // Re-verify on edit
        })
        .eq("id", initialData.id);

      if (updateError) throw updateError;

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
          <h2 className="mt-8 text-3xl font-black text-slate-900">Yangilandi!</h2>
          <p className="mt-4 text-lg text-slate-500">E&apos;loningiz muvaffaqiyatli yangilandi va qaytadan ko&apos;rib chiqiladi.</p>
          <div className="mt-10 flex gap-4">
            <Button className="rounded-2xl h-12 px-8 font-bold shadow-lg shadow-primary/20" asChild>
              <Link href="/dashboard">Dashboardga o&apos;tish</Link>
            </Button>
            <Button variant="outline" className="rounded-2xl h-12 px-8 font-bold" asChild>
              <Link href={`/products/${initialData.id}`}>E&apos;lonni ko&apos;rish</Link>
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-4xl space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full h-12 w-12" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-6 w-6" />
          </Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Tahrirlash</h1>
          <p className="text-lg text-slate-500">E&apos;lon ma&apos;lumotlarini o&apos;zgartiring</p>
        </div>
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
                <Input id="name" name="name" required defaultValue={initialData.name} placeholder="Masalan: Armatura 12mm" className="rounded-xl h-12 border-slate-200" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-bold text-slate-700">Tavsif</Label>
                <Textarea id="description" name="description" required defaultValue={initialData.description} placeholder="Mahsulot holati va xususiyatlari haqida batafsil..." className="rounded-xl min-h-[150px] border-slate-200" />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-bold text-slate-700">Narxi (so&apos;m)</Label>
                  <Input id="price" name="price" type="number" required defaultValue={initialData.price} placeholder="1500000" className="rounded-xl h-12 border-slate-200" />
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
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Qo&apos;shimcha ma&apos;lumotlar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="usage_duration" className="text-sm font-bold text-slate-700">Ishlatilgan muddati</Label>
                <Input id="usage_duration" name="usage_duration" required defaultValue={initialData.usage_duration} placeholder="Masalan: 1 yil, yangi..." className="rounded-xl h-12 border-slate-200" />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">Viloyat</Label>
                  <Select value={region} onValueChange={(v) => {
                    setRegion(v);
                    setDistrict(uzbekistanLocations[v][0]);
                  }}>
                    <SelectTrigger className="rounded-xl h-12 border-slate-200">
                      <SelectValue placeholder="Tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {uzbekistanRegions.map(r => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">Tuman/Shahar</Label>
                  <Select value={district} onValueChange={setDistrict}>
                    <SelectTrigger className="rounded-xl h-12 border-slate-200">
                      <SelectValue placeholder="Tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {uzbekistanLocations[region].map(d => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number" className="text-sm font-bold text-slate-700">Telefon raqam</Label>
                <Input id="phone_number" name="phone_number" required defaultValue={initialData.phone_number} placeholder="+998901234567" className="rounded-xl h-12 border-slate-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Preview & Info */}
        <div className="space-y-6">
          <Card className="rounded-[32px] border-slate-100 shadow-sm overflow-hidden sticky top-8">
            <CardHeader className="bg-slate-50/50 p-6 pb-4">
              <CardTitle className="text-lg font-bold">Mahsulot rasmi</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-slate-100">
                <Image src={initialData.image_url} alt="Current" fill className="object-cover" />
              </div>
              <p className="text-xs text-slate-500 italic text-center">
                Eslatma: Hozircha rasmni o&apos;zgartirish imkoniyati yo&apos;q. 
                Rasm o&apos;zgartirish uchun yangi e&apos;lon bering.
              </p>
              
              <div className="pt-4 space-y-3">
                {error && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm font-bold text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}
                
                <Button type="submit" className="w-full rounded-2xl h-14 text-lg font-bold shadow-lg shadow-primary/20" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Saqlanmoqda...
                    </>
                  ) : (
                    "O'zgarishlarni saqlash"
                  )}
                </Button>
                
                <Button type="button" variant="outline" className="w-full rounded-2xl h-12 font-bold" asChild>
                  <Link href="/dashboard">Bekor qilish</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
