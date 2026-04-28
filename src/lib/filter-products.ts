import type { Product } from "@/types/database";

export type ProductFilters = {
  q?: string;
  kategoriya?: string;
  holati?: string;
  status?: string;
  faqatTasdiqlangan?: string;
};

export function filterProducts(
  items: Product[],
  f: ProductFilters
): Product[] {
  let out = [...items];

  const q = f.q?.trim().toLowerCase();
  if (q) {
    out = out.filter(
      (p) =>
        p.nomi.toLowerCase().includes(q) ||
        p.tavsifi.toLowerCase().includes(q)
    );
  }

  if (f.kategoriya && f.kategoriya !== "hammasi") {
    out = out.filter((p) => p.kategoriya === f.kategoriya);
  }

  if (f.holati && f.holati !== "hammasi") {
    out = out.filter((p) => p.holati === f.holati);
  }

  if (f.status && f.status !== "hammasi") {
    out = out.filter((p) => p.status === f.status);
  }

  if (f.faqatTasdiqlangan === "1") {
    out = out.filter((p) => p.atdar_tasdiqlangan === true);
  }

  return out;
}
