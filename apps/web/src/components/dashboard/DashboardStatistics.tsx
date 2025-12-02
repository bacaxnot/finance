"use client";

import type { Currency } from "@/mock/types";
import { Badge } from "@/components/ui/badge";

interface DashboardStatisticsProps {
	totalBalance: number;
	totalIncome: number;
	totalExpense: number;
	currency: Currency;
}

const formatCurrency = (amount: number, currency: Currency) => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
	}).format(amount);
};

export function DashboardStatistics({
	totalBalance,
	totalIncome,
	totalExpense,
	currency,
}: DashboardStatisticsProps) {
	return (
		<div className="space-y-4">
			{/* Balance Principal */}
			<div>
				<p className="text-6xl md:text-7xl font-bold text-foreground tracking-tight">
					{formatCurrency(totalBalance, currency)}
				</p>
			</div>

			{/* Income y Expense - Badges prominentes */}
			<div className="flex items-center gap-2">
				<Badge
					variant="secondary"
					className="h-10 px-4 text-sm font-semibold bg-destructive/10 text-destructive hover:bg-destructive/20 border-0"
				>
					{formatCurrency(totalExpense, currency)}
				</Badge>
				<Badge variant="outline" className="h-10 px-4 text-sm font-semibold">
					{formatCurrency(totalIncome, currency)}
				</Badge>
			</div>
		</div>
	);
}
