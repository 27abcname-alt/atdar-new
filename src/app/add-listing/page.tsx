import type { Metadata } from "next";

import { AddListingForm } from "./add-listing-form";

export const metadata: Metadata = {
  title: "E'lon joylashtirish",
};

export default function AddListingPage() {
  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          E&apos;lon joylashtirish
        </h1>
        <p className="mt-2 text-muted-foreground">
          Mahsulot nomi, narxi, kategoriyasi va rasmini kiriting. &quot;Yuborish&quot;
          bosilganda ma&apos;lumotlar Supabase&apos;ga saqlanadi.
        </p>
        <div className="mt-6 sm:mt-8">
          <AddListingForm />
        </div>
      </div>
    </div>
  );
}
