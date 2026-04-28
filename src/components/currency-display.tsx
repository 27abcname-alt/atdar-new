import { formatCurrency, convertUZStoUSD } from "@/lib/utils";

export function CurrencyDisplay({ 
  amount, 
  className 
}: { 
  amount: number; 
  className?: string;
}) {
  const usdAmount = convertUZStoUSD(amount);

  return (
    <div className={className}>
      <p className="text-2xl font-black text-primary tracking-tighter">
        {formatCurrency(amount, "UZS")}
      </p>
      <p className="text-sm font-bold text-slate-400">
        ≈ {formatCurrency(usdAmount, "USD")}
      </p>
    </div>
  );
}
