"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Crown, ShieldCheck } from "lucide-react";

type ImageType = {
  url: string;
  display_order: number;
};

type ProductGalleryProps = {
  images: ImageType[];
  isPremium?: boolean;
  isVerified?: boolean;
  productName: string;
};

export function ProductGallery({ images, isPremium, isVerified, productName }: ProductGalleryProps) {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % images.length);
  const prev = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] w-full rounded-[32px] bg-slate-100 flex items-center justify-center text-slate-400">
        Rasm mavjud emas
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={`group relative aspect-[4/3] overflow-hidden rounded-[32px] border-4 bg-white shadow-xl ${isPremium ? 'border-amber-400' : 'border-white'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="relative h-full w-full"
          >
            <Image
              src={images[index].url}
              alt={productName}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Badges */}
        <div className="absolute right-6 top-6 z-10 flex flex-col items-end gap-3">
          {isPremium && (
            <div className="flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-sm font-black text-white shadow-2xl ring-2 ring-amber-400/50">
              <Crown className="h-5 w-5 fill-white" />
              <span>VIP PREMIUM</span>
            </div>
          )}
          {isVerified && (
            <div className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-emerald-700 shadow-2xl backdrop-blur-md ring-1 ring-emerald-500/20">
              <ShieldCheck className="h-5 w-5" />
              <span>VERIFIED BY ATDAR</span>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 flex items-center justify-center rounded-full bg-white/80 text-slate-900 shadow-lg backdrop-blur-md hover:bg-white transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 flex items-center justify-center rounded-full bg-white/80 text-slate-900 shadow-lg backdrop-blur-md hover:bg-white transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-md">
            {index + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                index === i ? 'border-primary shadow-md scale-105' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <Image
                src={img.url}
                alt={`${productName} thumbnail ${i}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
