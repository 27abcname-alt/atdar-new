import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
      <h1 className="text-2xl font-bold">Mahsulot topilmadi</h1>
      <p className="mt-2 text-muted-foreground">
        Havola noto&apos;g&apos;ri yoki e&apos;lon olib tashlangan bo&apos;lishi
        mumkin.
      </p>
      <Button className="mt-8" asChild>
        <Link href="/products">Mahsulotlarga o&apos;tish</Link>
      </Button>
    </div>
  );
}
