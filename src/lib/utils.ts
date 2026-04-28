import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const USD_UZS_RATE = 12850; // O'rtacha kurs

export function convertUZStoUSD(uzs: number) {
  return uzs / USD_UZS_RATE;
}

export function convertUSDtoUZS(usd: number) {
  return usd * USD_UZS_RATE;
}

export function formatCurrency(amount: number, currency: "UZS" | "USD") {
  if (currency === "UZS") {
    // 1 000 000 so'm formatida (bo'sh joylar bilan)
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
