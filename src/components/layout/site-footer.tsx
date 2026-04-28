import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-md space-y-2">
            <p className="font-semibold text-foreground">Atdar.uz</p>
            <p className="text-sm text-muted-foreground">
              Qurilish materiallari va texnika vositalarini halol va shaffof
              qayta sotish bozori. Tekshirilgan e&apos;lonlar — ishonchli
              bitimlar.
            </p>
            <p className="flex items-center gap-2 text-sm font-medium text-primary">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              Verified by Atdar — mahsulot sifati va e&apos;lon haqiqiyligi
            </p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="space-y-2">
              <p className="font-medium text-foreground">Bo&apos;limlar</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>
                  <Link href="/products" className="hover:text-foreground">
                    Mahsulotlar
                  </Link>
                </li>
                <li>
                  <Link href="/add-listing" className="hover:text-foreground">
                    E&apos;lon joylashtirish
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-foreground">Aloqa</p>
              <p className="text-muted-foreground">info@atdar.uz</p>
              <p className="text-muted-foreground">+998 XX XXX XX XX</p>
            </div>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-muted-foreground sm:text-left">
          © {new Date().getFullYear()} Atdar.uz. Barcha huquqlar himoyalangan.
        </p>
      </div>
    </footer>
  );
}
