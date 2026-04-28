"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  defaultQ?: string;
  defaultKategoriya: string;
  defaultHolati: string;
  defaultStatus: string;
  defaultFaqatTasdiqlangan: boolean;
};

function buildQuery(params: Record<string, string | undefined>) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "" && v !== "hammasi") q.set(k, v);
  });
  const s = q.toString();
  return s ? `?${s}` : "";
}

export function ProductFiltersBar({
  defaultQ = "",
  defaultKategoriya,
  defaultHolati,
  defaultStatus,
  defaultFaqatTasdiqlangan,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [q, setQ] = useState(defaultQ);
  const [kategoriya, setKategoriya] = useState(defaultKategoriya);
  const [holati, setHolati] = useState(defaultHolati);
  const [status, setStatus] = useState(defaultStatus);
  const [faqatTasdiqlangan, setFaqatTasdiqlangan] = useState(
    defaultFaqatTasdiqlangan
  );

  const apply = useCallback(() => {
    const query = buildQuery({
      q: q.trim() || undefined,
      kategoriya: kategoriya === "hammasi" ? undefined : kategoriya,
      holati: holati === "hammasi" ? undefined : holati,
      status: status === "hammasi" ? undefined : status,
      faqatTasdiqlangan: faqatTasdiqlangan ? "1" : undefined,
    });
    startTransition(() => {
      router.push(`/products${query}`);
    });
  }, [router, q, kategoriya, holati, status, faqatTasdiqlangan]);

  const reset = useCallback(() => {
    setQ("");
    setKategoriya("hammasi");
    setHolati("hammasi");
    setStatus("hammasi");
    setFaqatTasdiqlangan(false);
    startTransition(() => {
      router.push("/products");
    });
  }, [router]);

  const selectIds = useMemo(
    () => ({
      kat: "filter-kategoriya",
      hol: "filter-holati",
      st: "filter-status",
    }),
    []
  );

  return (
    <div className="space-y-4 rounded-xl border bg-card p-4 shadow-sm sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2 sm:col-span-2 lg:col-span-1">
          <Label htmlFor="filter-q">Qidiruv</Label>
          <Input
            id="filter-q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Nom yoki tavsif"
            onKeyDown={(e) => e.key === "Enter" && apply()}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={selectIds.kat}>Kategoriya</Label>
          <Select value={kategoriya} onValueChange={setKategoriya}>
            <SelectTrigger id={selectIds.kat}>
              <SelectValue placeholder="Tanlang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hammasi">Hammasi</SelectItem>
              <SelectItem value="qurilish">Qurilish</SelectItem>
              <SelectItem value="texnika">Texnika</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor={selectIds.hol}>Holati</Label>
          <Select value={holati} onValueChange={setHolati}>
            <SelectTrigger id={selectIds.hol}>
              <SelectValue placeholder="Tanlang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hammasi">Hammasi</SelectItem>
              <SelectItem value="yangi">Yangi</SelectItem>
              <SelectItem value="ishlatilgan">Ishlatilgan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor={selectIds.st}>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id={selectIds.st}>
              <SelectValue placeholder="Tanlang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hammasi">Hammasi</SelectItem>
              <SelectItem value="kutilmoqda">Kutilmoqda</SelectItem>
              <SelectItem value="tasdiqlangan">Tasdiqlangan</SelectItem>
              <SelectItem value="sotilgan">Sotilgan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            id="verified-only"
            checked={faqatTasdiqlangan}
            onCheckedChange={(c) => setFaqatTasdiqlangan(c === true)}
          />
          <Label htmlFor="verified-only" className="font-normal cursor-pointer">
            Faqat Verified by Atdar
          </Label>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={reset} disabled={isPending}>
            Tozalash
          </Button>
          <Button type="button" onClick={apply} disabled={isPending}>
            {isPending ? "Yuklanmoqda…" : "Filtrlash"}
          </Button>
        </div>
      </div>
    </div>
  );
}
