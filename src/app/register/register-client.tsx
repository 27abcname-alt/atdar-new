"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { signup } from "../auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Phone, Mail, Lock, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const registerSchema = z.object({
  full_name: z.string().min(3, "Ism kamida 3 ta harfdan iborat bo'lishi kerak"),
  phone_number: z.string().regex(/^\+998\d{9}$/, "Telefon raqami noto'g'ri (+998XXXXXXXXX)"),
  email: z.string().email("Iltimos, to'g'ri email manzil kiriting"),
  password: z.string().min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak"),
});

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterPageClient({ error }: { error?: string }) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterValues) => {
    setLoading(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    try {
      await signup(formData);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12 bg-slate-50/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="rounded-[40px] border-none shadow-2xl shadow-slate-200/50 overflow-hidden bg-white">
          <CardHeader className="space-y-3 pt-10 pb-6 px-10">
            <CardTitle className="text-3xl font-black tracking-tight text-slate-900 text-center">
              Ro&apos;yxatdan o&apos;tish
            </CardTitle>
            <CardDescription className="text-center text-slate-500 font-medium">
              Platformamizga a&apos;zo bo&apos;ling va savdoni boshlang
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 px-10">
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-2xl bg-destructive/10 p-4 text-sm font-bold text-destructive border border-destructive/10"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-sm font-bold text-slate-700 ml-1">
                  To&apos;liq ism
                </Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="full_name"
                    placeholder="Ali Valiyev"
                    className={`rounded-2xl border-slate-200 h-14 pl-12 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-base ${
                      errors.full_name ? "border-destructive focus:border-destructive" : ""
                    }`}
                    {...register("full_name")}
                  />
                </div>
                {errors.full_name && (
                  <p className="text-xs font-bold text-destructive ml-1">{errors.full_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number" className="text-sm font-bold text-slate-700 ml-1">
                  Telefon raqami
                </Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="phone_number"
                    placeholder="+998901234567"
                    className={`rounded-2xl border-slate-200 h-14 pl-12 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-base ${
                      errors.phone_number ? "border-destructive focus:border-destructive" : ""
                    }`}
                    {...register("phone_number")}
                  />
                </div>
                {errors.phone_number && (
                  <p className="text-xs font-bold text-destructive ml-1">{errors.phone_number.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-bold text-slate-700 ml-1">
                  Email manzil
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className={`rounded-2xl border-slate-200 h-14 pl-12 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-base ${
                      errors.email ? "border-destructive focus:border-destructive" : ""
                    }`}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs font-bold text-destructive ml-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-bold text-slate-700 ml-1">
                  Parol
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className={`rounded-2xl border-slate-200 h-14 pl-12 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-base ${
                      errors.password ? "border-destructive focus:border-destructive" : ""
                    }`}
                    {...register("password")}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs font-bold text-destructive ml-1">{errors.password.message}</p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-6 pt-6 pb-10 px-10">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Ro'yxatdan o'tish"}
              </Button>
              <p className="text-center text-sm text-slate-500 font-medium">
                Hisobingiz bormi?{" "}
                <Link href="/login" className="font-bold text-slate-900 hover:underline">
                  Kirish
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
