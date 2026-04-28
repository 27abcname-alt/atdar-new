import type { Metadata } from "next";
import { revalidatePath } from "next/cache";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin Panel",
  robots: {
    index: false,
    follow: false,
  },
};

type UnverifiedProduct = {
  id: string;
  name: string | null;
  price: number | null;
  category: string | null;
  phone_number: string | null;
  image_url: string | null;
  is_verified: boolean;
};

async function verifyProduct(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("products").update({ is_verified: true }).eq("id", id);
  revalidatePath("/admin-panel-atdar");
  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
}

async function unverifyProduct(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("products").update({ is_verified: false }).eq("id", id);
  revalidatePath("/admin-panel-atdar");
  revalidatePath("/products");
  revalidatePath(`/products/${id}`);
}

async function deleteProduct(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "");
  const imageUrl = String(formData.get("image_url") ?? "");
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "products";

  if (!id) return;

  const supabase = await createClient();
  if (imageUrl) {
    try {
      const marker = `/storage/v1/object/public/${bucket}/`;
      const idx = imageUrl.indexOf(marker);
      if (idx !== -1) {
        const filePath = imageUrl.slice(idx + marker.length);
        if (filePath) {
          await supabase.storage.from(bucket).remove([filePath]);
        }
      }
    } catch {
      // Storage o'chirish xatosi bo'lsa ham DB o'chirish davom etadi.
    }
  }

  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/admin-panel-atdar");
  revalidatePath("/products");
}

function formatPrice(n: number) {
  return `${new Intl.NumberFormat("ru-RU").format(n)} so'm`;
}

export default async function AdminPanelAtdarPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id,name,price,category,phone_number,image_url,is_verified")
    .order("id", { ascending: false });

  const products: UnverifiedProduct[] = data ?? [];

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Admin Panel</h1>
        <p className="mt-2 text-muted-foreground">
          Barcha mahsulotlar ro&apos;yxati va ularni tasdiqlash.
        </p>

        {error && (
          <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            Xatolik: {error.message}
          </p>
        )}

        <div className="mt-6 overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-700">Nomi</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Narxi</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Holati</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Telefon</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{p.name ?? "Nomsiz"}</span>
                        <span className="text-xs text-muted-foreground uppercase">{p.category ?? "-"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{formatPrice(p.price ?? 0)}</td>
                    <td className="px-4 py-3">
                      {p.is_verified ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                          Tasdiqlangan
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                          Kutilmoqda
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">{p.phone_number ?? "-"}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {p.is_verified ? (
                          <form action={unverifyProduct}>
                            <input type="hidden" name="id" value={p.id} />
                            <Button type="submit" size="sm" variant="outline" className="h-8">
                              Bekor qilish
                            </Button>
                          </form>
                        ) : (
                          <form action={verifyProduct}>
                            <input type="hidden" name="id" value={p.id} />
                            <Button type="submit" size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-700">
                              Tasdiqlash
                            </Button>
                          </form>
                        )}
                        <form action={deleteProduct}>
                          <input type="hidden" name="id" value={p.id} />
                          <input type="hidden" name="image_url" value={p.image_url ?? ""} />
                          <Button type="submit" size="sm" variant="destructive" className="h-8">
                            O&apos;chirish
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {products.length === 0 && (
          <p className="mt-6 rounded-lg border border-dashed bg-white p-6 text-center text-muted-foreground">
            Mahsulotlar topilmadi.
          </p>
        )}
      </div>
    </div>
  );
}
