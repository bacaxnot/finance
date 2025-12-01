"use client";

import Link from "next/link";
import { useConsolidatedView } from "@/hooks/accounts";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ChevronRight } from "lucide-react";
import { AccountTypeIcon } from "./AccountTypeIcon";
import { AccountType } from "@/mock/types";

const formatCurrency = (amount: number, currency: string) => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
	}).format(amount);
};

export function ConsolidatedView() {
	const { data, isLoading, error } = useConsolidatedView();

	if (isLoading) {
		return (
			<div className="rounded-xl p-4 space-y-4 bg-muted/20">
				{/* Header Skeleton */}
				<div className="flex items-center justify-between">
					<Skeleton className="h-6 w-32" />
					<Skeleton className="h-5 w-5 rounded" />
				</div>

				{/* Balance Skeleton */}
				<Skeleton className="h-12 w-48" />

				{/* Account Type Skeletons */}
				<div className="space-y-3">
					<Skeleton className="h-20 w-full rounded-lg" />
					<Skeleton className="h-20 w-full rounded-lg" />
					<Skeleton className="h-20 w-full rounded-lg" />
				</div>

				{/* Footer Skeleton */}
				<Skeleton className="h-5 w-40" />
			</div>
		);
	}

	if (error) {
		return (
			<Alert variant="destructive">
				<AlertCircle className="size-4" />
				<AlertDescription>
					Failed to load consolidated view. Please try again.
				</AlertDescription>
			</Alert>
		);
	}

	if (!data) return null;

	return (
		<Link
			href="/accounts"
			className="block group rounded-xl p-6 space-y-6 transition-all hover:bg-accent/30 active:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
			aria-label="View all accounts"
		>
			{/* Header con ChevronRight */}
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold">Total Balance</h2>
				<ChevronRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
			</div>

			{/* Total Balance - Prominent Display */}
			<div className="text-4xl font-bold md:text-5xl">
				{formatCurrency(data.totalBalance, data.currency)}
			</div>

			{/* Breakdown by Type */}
			<div className="space-y-3">
						{/* Checking */}
						{data.accountsByType.checking.length > 0 && (
							<div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 transition-colors group-hover:bg-muted/70">
								<div className="flex items-center gap-3">
									<div className="flex size-10 items-center justify-center rounded-full bg-background">
										<AccountTypeIcon type={AccountType.CHECKING} size="md" />
									</div>
									<div>
										<p className="font-medium">Checking</p>
										<p className="text-sm text-muted-foreground">
											{data.accountsByType.checking.length}{" "}
											{data.accountsByType.checking.length === 1
												? "account"
												: "accounts"}
										</p>
									</div>
								</div>
								<div className="text-right font-mono font-semibold">
									{formatCurrency(
										data.accountsByType.checking.reduce(
											(sum, acc) => sum + acc.balance,
											0,
										),
										data.currency,
									)}
								</div>
							</div>
						)}

						{/* Savings */}
						{data.accountsByType.savings.length > 0 && (
							<div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 transition-colors group-hover:bg-muted/70">
								<div className="flex items-center gap-3">
									<div className="flex size-10 items-center justify-center rounded-full bg-background">
										<AccountTypeIcon type={AccountType.SAVINGS} size="md" />
									</div>
									<div>
										<p className="font-medium">Savings</p>
										<p className="text-sm text-muted-foreground">
											{data.accountsByType.savings.length}{" "}
											{data.accountsByType.savings.length === 1
												? "account"
												: "accounts"}
										</p>
									</div>
								</div>
								<div className="text-right font-mono font-semibold">
									{formatCurrency(
										data.accountsByType.savings.reduce(
											(sum, acc) => sum + acc.balance,
											0,
										),
										data.currency,
									)}
								</div>
							</div>
						)}

						{/* Credit Cards */}
						{data.accountsByType.creditCards.length > 0 && (
							<div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 transition-colors group-hover:bg-muted/70">
								<div className="flex items-center gap-3">
									<div className="flex size-10 items-center justify-center rounded-full bg-background">
										<AccountTypeIcon type={AccountType.CREDIT_CARD} size="md" />
									</div>
									<div>
										<p className="font-medium">Credit Cards</p>
										<p className="text-sm text-muted-foreground">
											{data.accountsByType.creditCards.length}{" "}
											{data.accountsByType.creditCards.length === 1
												? "card"
												: "cards"}
										</p>
									</div>
								</div>
								<div className="text-right font-mono font-semibold">
									{formatCurrency(
										data.accountsByType.creditCards.reduce(
											(sum, acc) => sum + acc.balance,
											0,
										),
										data.currency,
									)}
								</div>
							</div>
						)}
			</div>

			{/* Footer with Account Counts */}
			<div className="text-sm text-muted-foreground">
				{data.accountCount.active} Active • {data.accountCount.archived}{" "}
				Archived
			</div>
		</Link>
	);
}
