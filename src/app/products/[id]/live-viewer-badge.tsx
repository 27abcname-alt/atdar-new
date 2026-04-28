"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { motion } from "framer-motion";

export function LiveViewerBadge() {
  const [viewers, setViewers] = useState(1);

  useEffect(() => {
    // Tasodifiy ko'ruvchilar soni (simulatsiya)
    const interval = setInterval(() => {
      setViewers((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
        return Math.max(1, Math.min(10, prev + delta));
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center gap-2 rounded-xl bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700 ring-1 ring-sky-100 shadow-sm"
    >
      <div className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
        <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
      </div>
      <Users className="h-4 w-4" />
      <span>Hozirda {viewers} kishi ko&apos;rmoqda</span>
    </motion.div>
  );
}
