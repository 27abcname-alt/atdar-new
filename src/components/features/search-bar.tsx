"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
  isLoading?: boolean;
}

export function SearchBar({
  onSearch,
  placeholder = "Qidiruv...",
  initialValue = "",
  isLoading = false,
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue);

  // Debounced search logic
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, 500);

    return () => clearTimeout(timer);
  }, [value, onSearch]);

  const handleClear = useCallback(() => {
    setValue("");
    onSearch("");
  }, [onSearch]);

  return (
    <div className="relative group w-full max-w-2xl mx-auto">
      <motion.div
        initial={false}
        animate={{ scale: 1 }}
        whileFocus={{ scale: 1.01 }}
        className="relative flex items-center"
      >
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
          )}
        </div>

        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="h-14 w-full rounded-2xl border-slate-200 bg-white pl-12 pr-12 text-base shadow-sm ring-offset-white transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
        />

        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors z-10 p-1 hover:bg-slate-100 rounded-full"
            >
              <X className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Optional: Add search suggestions/history here in Enterprise version */}
    </div>
  );
}
