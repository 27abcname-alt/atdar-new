import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";
import { ProductsClient, type DbProduct } from "./products-client";

export const metadata: Metadata = {
  title: "Mahsulotlar",
};

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select("id,name,price,category,condition,image_url,is_verified,is_premium,phone_number,moderator:moderator_id(full_name)")
    .order("id", { ascending: false });

  const list: DbProduct[] = (data as unknown as DbProduct[]) ?? [];

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Mahsulotlar</h1>
        <p className="mt-2 text-muted-foreground">
          Tezkor qidiruv va chap panel orqali mahsulotlarni aniq filtrlang.
        </p>
      </div>

      {error && (
        <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          Xatolik: {error.message}
        </p>
      )}

      <div className="mt-6">
        <ProductsClient list={list} />
      </div>

      {list.length === 0 && (
        <p className="mt-10 rounded-lg border border-dashed bg-muted/30 p-8 text-center text-muted-foreground">
          Hozircha mahsulot topilmadi.
        </p>
      )}
      </div>
    </div>
  );
}
