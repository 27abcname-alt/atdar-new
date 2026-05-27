"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Star, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { submitReview } from "@/app/auth/actions";
import { motion, AnimatePresence } from "framer-motion";

const reviewSchema = z.object({
  stars: z.number().min(1, "Iltimos, reyting tanlang").max(5),
  comment: z.string().min(5, "Sharh kamida 5 ta harfdan iborat bo'lishi kerak"),
});

type ReviewValues = z.infer<typeof reviewSchema>;

export function ReviewForm({ listingId }: { listingId: string }) {
  const [loading, setLoading] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      stars: 0,
      comment: "",
    },
  });

  const selectedStars = watch("stars");

  const onSubmit = async (data: ReviewValues) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("listing_id", listingId);
    formData.append("stars", data.stars.toString());
    formData.append("comment", data.comment);

    try {
      await submitReview(formData);
      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="rounded-[32px] border-slate-100 shadow-sm overflow-hidden">
      <CardHeader className="bg-slate-50/50 p-6 pb-4">
        <CardTitle className="text-lg font-black text-slate-900">Sharh qoldirish</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-bold text-slate-700">Reyting bering</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setValue("stars", star, { shouldValidate: true })}
                  className="transition-transform active:scale-90"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      (hoveredStar || selectedStars) >= star
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200"
                    }`}
                  />
                </button>
              ))}
            </div>
            {errors.stars && (
              <p className="text-xs font-bold text-destructive">{errors.stars.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-bold text-slate-700">Fikringizni yozing</p>
            <Textarea
              {...register("comment")}
              placeholder="Mahsulot va sotuvchi haqida nima deb o'ylaysiz?"
              className={`rounded-2xl border-slate-200 min-h-[100px] focus:ring-primary/10 ${
                errors.comment ? "border-destructive" : ""
              }`}
            />
            {errors.comment && (
              <p className="text-xs font-bold text-destructive">{errors.comment.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-2xl font-black shadow-lg shadow-primary/10 transition-all hover:scale-[1.02]"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                Yuborish
                <Send className="h-4 w-4" />
              </span>
            )}
          </Button>

          <AnimatePresence>
            {success && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center text-sm font-bold text-emerald-600"
              >
                Sharhingiz muvaffaqiyatli qabul qilindi!
              </motion.p>
            )}
          </AnimatePresence>
        </form>
      </CardContent>
    </Card>
  );
}
