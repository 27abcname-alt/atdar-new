import type { Listing } from "@/types/database";

export type ProductFilters = {
  q?: string;
  category?: string;
  condition?: string;
  status?: string;
  isVerifiedOnly?: string;
};

export function filterProducts(
  items: Listing[],
  f: ProductFilters
): Listing[] {
  let out = [...items];

  const q = f.q?.trim().toLowerCase();
  if (q) {
    out = out.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }

  if (f.category && f.category !== "hammasi") {
    out = out.filter((p) => p.category === f.category);
  }

  if (f.condition && f.condition !== "hammasi") {
    out = out.filter((p) => p.condition === f.condition);
  }

  if (f.status && f.status !== "hammasi") {
    out = out.filter((p) => p.status === f.status);
  }

  if (f.isVerifiedOnly === "1") {
    out = out.filter((p) => p.is_verified === true);
  }

  return out;
}
