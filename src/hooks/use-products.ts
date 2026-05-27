"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { DbProduct } from "@/app/products/products-client";

export function useProducts(initialList: DbProduct[]) {
  const supabase = createClient();
  const [list, setList] = useState(initialList);
  const [loading, setLoading] = useState(false);

  const prices = initialList.map((p) => p.price ?? 0);
  const initialMin = prices.length ? Math.min(...prices) : 0;
  const initialMax = prices.length ? Math.max(...prices) : 10_000_000;

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("hammasi");
  const [condition, setCondition] = useState("hammasi");
  const [minPrice, setMinPrice] = useState(initialMin);
  const [maxPrice, setMaxPrice] = useState(initialMax);
  const [isVerifiedOnly, setIsVerifiedOnly] = useState(false);

  useEffect(() => {
    const fetchFuzzy = async () => {
      if (!query.trim()) {
        setList(initialList);
        return;
      }
      
      setLoading(true);
      const { data, error } = await supabase.rpc("search_products_fuzzy", {
        search_text: query,
      });

      if (!error && data) {
        setList(data as DbProduct[]);
      }
      setLoading(false);
    };

    const timer = setTimeout(fetchFuzzy, 500);
    return () => clearTimeout(timer);
  }, [query, initialList, supabase]);

  const filtered = list.filter((p) => {
    const price = p.price ?? 0;
    const categoryOk = category === "hammasi" || p.category === category;
    const conditionOk = condition === "hammasi" || p.condition === condition;
    const priceOk = price >= minPrice && price <= maxPrice;
    const verifiedOk = !isVerifiedOnly || p.is_verified === true;
    return categoryOk && conditionOk && priceOk && verifiedOk;
  });

  return {
    list: filtered,
    loading,
    filters: {
      query,
      setQuery,
      category,
      setCategory,
      condition,
      setCondition,
      minPrice,
      setMinPrice,
      maxPrice,
      setMaxPrice,
      isVerifiedOnly,
      setIsVerifiedOnly,
      initialMin,
      initialMax,
    },
  };
}
