"use client";

import type { Currency } from "@/mock/types";
import { Badge } from "@/components/ui/badge";
import { useFitText } from "@/hooks/useFitText";

interface DashboardStatisticsProps {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  currency: Currency;
}

const formatCurrency = (
  amount: number,
  currency: Currency,
  showSign = false,
) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    signDisplay: showSign ? "always" : "auto",
  }).format(amount);
};

export function DashboardStatistics({
  totalBalance,
  totalIncome,
  totalExpense,
  currency,
}: DashboardStatisticsProps) {
  const formattedBalance = formatCurrency(totalBalance, currency);
  const { ref: balanceRef, scale: balanceScale } =
    useFitText<HTMLParagraphElement>(formattedBalance);

  return (
    <div className="space-y-2">
      {/* Balance Principal */}
      <div className="max-w-full">
        <p
          ref={balanceRef}
          className="font-bold text-foreground tracking-tight leading-none whitespace-nowrap overflow-hidden text-ellipsis inline-block"
          style={{
            transform: `scale(${balanceScale})`,
            transformOrigin: "left center",
            fontSize: "clamp(2rem, 10vw, 5rem)",
          }}
        >
          {formattedBalance}
        </p>
      </div>

      {/* Income y Expense - Badges prominentes */}
      <div className="flex items-center gap-2">
        <Badge
          variant="secondary"
          className="h-8 px-3 text-xs font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 border-0"
        >
          −{formatCurrency(totalExpense, currency)}
        </Badge>
        <Badge
          variant="secondary"
          className="h-8 px-3 text-xs font-medium bg-green-500/10 text-green-700 hover:bg-green-500/20 border-0"
        >
          +{formatCurrency(totalIncome, currency)}
        </Badge>
      </div>
    </div>
  );
}
