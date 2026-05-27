"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { loginWithMagicLink, signInWithGoogle, signInWithTelegram } from "../auth/actions";
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
import { Mail, Loader2, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const loginSchema = z.object({
  email: z.string().email("Iltimos, to'g'ri email manzil kiriting"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginPageClient({ error }: { error?: string }) {
  const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isTelegramLoading, setIsTelegramLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onMagicLinkSubmit = async (data: LoginValues) => {
    setIsMagicLinkLoading(true);
    const formData = new FormData();
    formData.append("email", data.email);
    try {
      await loginWithMagicLink(formData);
      setMagicLinkSent(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsMagicLinkLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
      setIsGoogleLoading(false);
    }
  };

  const handleTelegramLogin = async () => {
    setIsTelegramLoading(true);
    try {
      await signInWithTelegram();
    } catch (err) {
      console.error(err);
      setIsTelegramLoading(false);
    }
  };

  if (magicLinkSent) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="rounded-[32px] border-slate-100 p-8 text-center shadow-2xl">
            <div className="flex flex-col items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Send className="h-10 w-10" />
              </div>
              <h2 className="mt-8 text-3xl font-black text-slate-900">
                Email yuborildi!
              </h2>
              <p className="mt-4 text-lg text-slate-500">
                Kirish havolasini olish uchun pochtangizni tekshiring.
              </p>
              <Button
                variant="outline"
                className="mt-10 rounded-2xl h-12 px-8 font-bold"
                onClick={() => setMagicLinkSent(false)}
              >
                Orqaga qaytish
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

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
              Xush kelibsiz
            </CardTitle>
            <CardDescription className="text-center text-slate-500 font-medium">
              Platformaga o&apos;zingizga qulay usulda kiring
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 px-10">
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

            <div className="grid gap-4">
              <Button
                variant="outline"
                disabled={isGoogleLoading || isTelegramLoading}
                className="h-14 rounded-2xl border-slate-200 font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all gap-3 relative overflow-hidden"
                onClick={handleGoogleLogin}
              >
                {isGoogleLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                Google bilan kirish
              </Button>

              <Button
                variant="outline"
                disabled={isGoogleLoading || isTelegramLoading}
                className="h-14 rounded-2xl border-slate-200 font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all gap-3 relative overflow-hidden"
                onClick={handleTelegramLogin}
              >
                {isTelegramLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <svg className="h-5 w-5 fill-[#0088cc]" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.91-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z" />
                  </svg>
                )}
                Telegram orqali kirish
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-100"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">
                  Yoki
                </span>
              </div>
            </div>

            {/* Magic Link Form */}
            <form
              onSubmit={handleSubmit(onMagicLinkSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-bold text-slate-700 ml-1"
                >
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
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-bold text-destructive ml-1"
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <Button
                type="submit"
                disabled={isMagicLinkLoading}
                className="w-full h-14 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isMagicLinkLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  "Magic Link yuborish"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="pb-10 pt-4 px-10 flex justify-center">
            <p className="text-center text-sm text-slate-500 font-medium">
              Tizimga kirish orqali siz <br />
              <a
                href="/terms"
                className="font-bold text-slate-900 hover:underline"
              >
                Foydalanish shartlariga
              </a>{" "}
              rozilik bildirasiz.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
