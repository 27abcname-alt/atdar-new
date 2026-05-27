"use client";

import { useState } from "react";
import { Eye, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PhoneNumberDisplay({ phoneNumber }: { phoneNumber: string }) {
  const [show, setShow] = useState(false);

  // Telefon raqamini yashirish (masalan: +998 90 *** ** 12)
  const maskedPhone = phoneNumber ? `${phoneNumber.slice(0, 7)} *** ** ${phoneNumber.slice(-2)}` : "Raqam yo'q";

  if (show) {
    return (
      <Button 
        size="lg" 
        className="h-14 w-full rounded-2xl text-lg font-bold shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02] transition-all active:scale-[0.98]"
        asChild
      >
        <a href={`tel:${phoneNumber}`}>
          <PhoneCall className="mr-2 h-5 w-5" />
          {phoneNumber}
        </a>
      </Button>
    );
  }

  return (
    <Button 
      size="lg" 
      variant="outline"
      className="h-14 w-full rounded-2xl text-lg font-bold border-slate-200 hover:border-primary/50 hover:bg-primary/5 transition-all group"
      onClick={() => setShow(true)}
    >
      <Eye className="mr-2 h-5 w-5 text-slate-400 group-hover:text-primary" />
      <span>{maskedPhone}</span>
      <span className="ml-2 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
        Ko&apos;rish
      </span>
    </Button>
  );
}
