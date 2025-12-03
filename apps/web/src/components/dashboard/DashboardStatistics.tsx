"use client";

import type { Currency } from "@/mock/types";
import { Badge } from "@/components/ui/badge";

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
	return (
		<div className="space-y-2">
			{/* Balance Principal */}
			<div>
				<p
					className="font-bold text-foreground tracking-tight"
					style={{ fontSize: "clamp(2.5rem, 14vw, 6rem)" }}
				>
					{formatCurrency(totalBalance, currency)}
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
