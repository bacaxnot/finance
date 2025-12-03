"use client";

import { useState, useRef, useEffect } from "react";
import { useConsolidatedView, useAccounts } from "@/hooks/accounts";
import { useConsolidatedTransactions } from "@/hooks/transactions";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStatistics } from "@/components/dashboard/DashboardStatistics";
import { QuickFilters } from "@/components/transactions/QuickFilters";
import { AccountSelector } from "@/components/dashboard/AccountSelector";
import { TransactionList } from "@/components/transactions/TransactionList";
import { TransactionCard } from "@/components/transactions/TransactionCard";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { TransactionSkeleton } from "@/components/transactions/TransactionSkeleton";
import { SwipeWrapper } from "@/components/ui/swipe-wrapper";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import type { TransactionFilters } from "@/mock/types";

// Helper function to get date range based on period
function getPeriodDateRange(period: string): {
	dateFrom?: Date;
	dateTo?: Date;
} {
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

	switch (period) {
		case "this-month": {
			const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
			return { dateFrom: startOfMonth, dateTo: undefined };
		}
		case "last-month": {
			const startOfLastMonth = new Date(
				now.getFullYear(),
				now.getMonth() - 1,
				1,
			);
			const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
			return { dateFrom: startOfLastMonth, dateTo: endOfLastMonth };
		}
		case "this-year": {
			const startOfYear = new Date(now.getFullYear(), 0, 1);
			return { dateFrom: startOfYear, dateTo: undefined };
		}
		case "all":
		default:
			return {};
	}
}

export default function DashboardPage() {
	const { data: consolidatedData, isLoading: isLoadingView } =
		useConsolidatedView();
	const { data: accountsData } = useAccounts();
	const [selectedAccountId, setSelectedAccountId] = useState<string>("all");
	const [selectedPeriod, setSelectedPeriod] = useState<string>("this-month");
	const [filters, setFilters] = useState<Omit<TransactionFilters, "accountId">>(
		() => {
			const periodRange = getPeriodDateRange("this-month");
			return periodRange;
		},
	);

	// Update filters when period changes
	const handlePeriodChange = (period: string) => {
		setSelectedPeriod(period);
		const periodRange = getPeriodDateRange(period);
		setFilters(periodRange);
	};

	// Get transactions based on selected account
	const { data: transactionsData } = useConsolidatedTransactions(
		selectedAccountId === "all"
			? filters
			: { ...filters, accountId: selectedAccountId },
	);

	const statistics = transactionsData?.pages[0]?.statistics;

	if (isLoadingView) {
		return <DashboardLoadingSkeleton />;
	}

	if (!consolidatedData) return null;

	const accounts = accountsData?.accounts || [];

	return (
		<SwipeWrapper onSwipeRight={() => {}}>
			<div className="space-y-6">
				{/* Header simplificado */}
				<DashboardHeader />

				{/* Statistics con balance y badges */}
				{statistics && (
					<DashboardStatistics
						/*totalBalance={consolidatedData.totalBalance}*/
						totalBalance={5000}
						totalIncome={statistics.totalIncome}
						totalExpense={statistics.totalExpense}
						currency={consolidatedData.currency}
					/>
				)}

				{/* Filtros rápidos con selector de cuenta */}
				<div className="flex items-center gap-1 text-sm">
					<QuickFilters
						value={selectedPeriod}
						onPeriodChange={handlePeriodChange}
					/>
					<span className="text-muted-foreground">·</span>
					<AccountSelector
						accounts={accounts}
						selectedAccountId={selectedAccountId}
						onAccountChange={setSelectedAccountId}
					/>
				</div>

				{/* Lista de transacciones sin título */}
				{selectedAccountId === "all" ? (
					<ConsolidatedTransactionList filters={filters} />
				) : (
					<TransactionList accountId={selectedAccountId} filters={filters} />
				)}
			</div>
		</SwipeWrapper>
	);
}

function ConsolidatedTransactionList({
	filters,
}: {
	filters: Omit<TransactionFilters, "accountId">;
}) {
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		error,
		refetch,
	} = useConsolidatedTransactions(filters);

	const observerTarget = useRef<HTMLDivElement>(null);

	// Infinite scroll with Intersection Observer
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
					fetchNextPage();
				}
			},
			{ threshold: 0.1 },
		);

		if (observerTarget.current) {
			observer.observe(observerTarget.current);
		}

		return () => observer.disconnect();
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	// Flatten all pages into single array
	const allTransactions =
		data?.pages.flatMap((page) => page.transactions) ?? [];

	// Loading state
	if (isLoading) {
		return (
			<div className="space-y-4">
				<div className="md:hidden space-y-3">
					<TransactionSkeleton variant="card" count={5} />
				</div>
				<div className="hidden md:block">
					<div className="rounded-md border">
						<table className="w-full">
							<thead className="border-b">
								<tr>
									<th className="h-12 px-4 text-left">Date</th>
									<th className="h-12 px-4 text-left">Description</th>
									<th className="h-12 px-4 text-left">Category</th>
									<th className="h-12 px-4 text-left">Type</th>
									<th className="h-12 px-4 text-right">Amount</th>
									<th className="h-12 px-4 text-left">Status</th>
								</tr>
							</thead>
							<tbody>
								<TransactionSkeleton variant="table" count={5} />
							</tbody>
						</table>
					</div>
				</div>
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className="flex flex-col items-center justify-center py-8 text-center">
				<AlertCircle className="size-12 text-muted-foreground mb-4" />
				<h3 className="text-lg font-semibold mb-2">
					Failed to load transactions
				</h3>
				<p className="text-muted-foreground mb-4 max-w-sm">
					There was an error loading your transactions. Please try again.
				</p>
				<Button onClick={() => refetch()} variant="outline">
					Retry
				</Button>
			</div>
		);
	}

	// Empty state
	if (allTransactions.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<div className="rounded-full bg-muted p-6 mb-4">
					<AlertCircle className="size-12 text-muted-foreground" />
				</div>
				<h3 className="text-lg font-semibold mb-2">No transactions found</h3>
				<p className="text-muted-foreground mb-6 max-w-sm">
					{filters?.search ||
					filters?.type ||
					filters?.category ||
					filters?.dateFrom
						? "No transactions match your current filters. Try adjusting your search criteria."
						: "You don't have any transactions yet."}
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4 gap-2">
			{/* Mobile: Card View */}
			<div className="md:hidden border-t border-border">
				{allTransactions.map((transaction) => (
					<TransactionCard key={transaction.id} transaction={transaction} />
				))}
			</div>

			{/* Desktop: Table View */}
			<div className="hidden md:block">
				<TransactionTable transactions={allTransactions} />
			</div>

			{/* Infinite scroll trigger */}
			<div ref={observerTarget} className="flex justify-center py-4">
				{isFetchingNextPage && (
					<div className="flex items-center gap-2 text-muted-foreground">
						<Loader2 className="size-5 animate-spin" />
						<span className="text-sm">Loading more transactions...</span>
					</div>
				)}
				{!hasNextPage && allTransactions.length > 0 && (
					<p className="text-sm text-muted-foreground">
						No more transactions to load
					</p>
				)}
			</div>
		</div>
	);
}

function DashboardLoadingSkeleton() {
	return (
		<div className="space-y-6">
			{/* Header skeleton */}
			<header className="flex items-start justify-between">
				<div className="h-5 w-16 bg-muted/50 animate-pulse rounded" />
				<div className="size-11 bg-muted/50 animate-pulse rounded-lg" />
			</header>

			{/* Balance skeleton */}
			<div className="space-y-2">
				<div className="h-20 w-72 bg-muted/50 animate-pulse rounded-lg" />
				<div className="flex items-center gap-2">
					<div className="h-8 w-28 bg-muted/50 animate-pulse rounded-lg" />
					<div className="h-8 w-28 bg-muted/50 animate-pulse rounded-lg" />
				</div>
			</div>

			{/* Quick filters skeleton */}
			<div className="flex items-center gap-1 text-sm">
				<div className="h-8 w-24 bg-muted/50 animate-pulse rounded-lg" />
				<div className="h-4 w-2 bg-muted/50 animate-pulse rounded" />
				<div className="h-8 w-32 bg-muted/50 animate-pulse rounded-lg" />
			</div>

			{/* Transactions skeleton */}
			<div className="border-t border-border">
				{[1, 2, 3, 4, 5].map((i) => (
					<div
						key={i}
						className="flex items-center gap-3 border-b border-border py-4 px-4"
					>
						{/* Icon skeleton */}
						<div className="size-11 shrink-0 bg-muted/50 animate-pulse rounded-xl" />

						{/* Details skeleton */}
						<div className="flex-1 space-y-2">
							<div className="h-4 w-32 bg-muted/50 animate-pulse rounded" />
							<div className="h-3 w-24 bg-muted/50 animate-pulse rounded" />
						</div>

						{/* Amount skeleton */}
						<div className="h-5 w-20 shrink-0 bg-muted/50 animate-pulse rounded" />
					</div>
				))}
			</div>
		</div>
	);
}
