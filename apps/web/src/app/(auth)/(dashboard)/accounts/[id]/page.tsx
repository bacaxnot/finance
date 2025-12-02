"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "@/hooks/accounts";
import { useAccountTransactions } from "@/hooks/transactions";
import { Button } from "@/components/ui/button";
import { SwipeWrapper } from "@/components/ui/swipe-wrapper";
import { AccountDetailHeader } from "@/components/accounts/AccountDetailHeader";
import { AccountStatistics } from "@/components/transactions/AccountStatistics";
import { TransactionList } from "@/components/transactions/TransactionList";
import { QuickFilters } from "@/components/transactions/QuickFilters";
import type { TransactionFilters as Filters } from "@/mock/types";
import { AlertCircle, ArrowLeft } from "lucide-react";
import AccountDetailLoading from "./loading";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

// Helper function to get date range based on period
function getPeriodDateRange(period: string): { dateFrom?: Date; dateTo?: Date } {
	const now = new Date();

	switch (period) {
		case "this-month": {
			const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
			return { dateFrom: startOfMonth, dateTo: undefined };
		}
		case "last-month": {
			const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
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

export default async function AccountDetailPage({ params }: PageProps) {
	const { id } = await params;
	return <AccountDetailPageClient accountId={id} />;
}

function AccountDetailPageClient({ accountId }: { accountId: string }) {
	const router = useRouter();
	const { data: accountData, isLoading, error } = useAccount(accountId);
	const [selectedPeriod, setSelectedPeriod] = useState<string>("this-month");
	const [filters, setFilters] = useState<Omit<Filters, "accountId">>(() => {
		const periodRange = getPeriodDateRange("this-month");
		return periodRange;
	});

	// Update filters when period changes
	const handlePeriodChange = (period: string) => {
		setSelectedPeriod(period);
		const periodRange = getPeriodDateRange(period);
		setFilters(periodRange);
	};

	// Get first page of transactions for statistics
	const { data: transactionsData } = useAccountTransactions(accountId, filters);
	const statistics = transactionsData?.pages[0]?.statistics;

	// Loading state
	if (isLoading) {
		return <AccountDetailLoading />;
	}

	// Error state
	if (error || !accountData?.account) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<AlertCircle className="size-12 text-muted-foreground mb-4" />
				<h2 className="text-2xl font-bold mb-2">Account not found</h2>
				<p className="text-muted-foreground mb-6 max-w-sm">
					The account you're looking for doesn't exist or has been deleted.
				</p>
				<Button onClick={() => router.push("/dashboard")} variant="outline">
					<ArrowLeft className="mr-2 size-4" />
					Back to Dashboard
				</Button>
			</div>
		);
	}

	const account = accountData.account;

	return (
		<SwipeWrapper onSwipeRight={() => router.push("/dashboard")}>
			<div className="space-y-6">
				{/* Header simplificado */}
				<AccountDetailHeader
					accountName={account.name}
					onSettingsClick={() => {
						// TODO: Implement settings modal
						console.log("Settings for:", account.id);
					}}
				/>

				{/* Statistics con balance y badges */}
				{statistics && (
					<AccountStatistics
						statistics={statistics}
						currency={account.currency}
						balance={account.balance}
					/>
				)}

				{/* Filtros rápidos tipo dropdown */}
				<QuickFilters
					value={selectedPeriod}
					onPeriodChange={handlePeriodChange}
				/>

				{/* Lista de transacciones sin título */}
				<TransactionList accountId={accountId} filters={filters} />
			</div>
		</SwipeWrapper>
	);
}
