"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AccountSelector } from "@/components/dashboard/AccountSelector";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStatistics } from "@/components/dashboard/DashboardStatistics";
import { InfiniteTransactionList } from "@/components/transactions/InfiniteTransactionList";
import { QuickFilters } from "@/components/transactions/QuickFilters";
import { TransactionList } from "@/components/transactions/TransactionList";
import { CreateTransactionModal } from "@/components/transactions/CreateTransactionModal";
import { SwipeWrapper } from "@/components/ui/swipe-wrapper";
import { Button } from "@/components/ui/button";
import { useAccounts, useConsolidatedView } from "@/hooks/accounts";
import { useConsolidatedTransactions } from "@/hooks/transactions";
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
  const consolidatedQueryResult = useConsolidatedTransactions(filters);
  const { data: transactionsData } = consolidatedQueryResult;

  const statistics = transactionsData?.pages[0]?.statistics;

  if (isLoadingView) {
    return <DashboardLoadingSkeleton />;
  }

  if (!consolidatedData) return null;

  const accounts = accountsData?.accounts || [];

  return (
    <SwipeWrapper onSwipeRight={() => {}}>
      <div className="space-y-6 relative">
        {/* Header simplificado */}
        <DashboardHeader />

        {/* Statistics con balance y badges */}
        {statistics && (
          <DashboardStatistics
            totalBalance={consolidatedData.totalBalance}
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
          <InfiniteTransactionList
            queryResult={consolidatedQueryResult}
            filters={filters}
            emptyMessage={{
              noTransactions: "You don't have any transactions yet.",
              noResults:
                "No transactions match your current filters. Try adjusting your search criteria.",
            }}
          />
        ) : (
          <TransactionList accountId={selectedAccountId} filters={filters} />
        )}

        {/* Floating New Transaction Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <CreateTransactionModal>
            <Button
              size="lg"
              className="size-14 rounded-full shadow-lg"
              aria-label="New Transaction"
            >
              <Plus className="size-6" />
            </Button>
          </CreateTransactionModal>
        </div>
      </div>
    </SwipeWrapper>
  );
}

function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <header className="flex items-start justify-between">
        <div className="h-5 w-16 bg-muted animate-pulse rounded" />
        <div className="size-11 bg-muted animate-pulse rounded" />
      </header>

      {/* Balance skeleton */}
      <div className="space-y-4">
        <div className="h-16 w-64 bg-muted animate-pulse rounded" />
        <div className="flex items-center gap-2">
          <div className="h-10 w-32 bg-muted animate-pulse rounded-full" />
          <div className="h-10 w-32 bg-muted animate-pulse rounded-full" />
        </div>
      </div>

      {/* Quick filters skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-9 w-28 bg-muted animate-pulse rounded-full" />
        <div className="h-4 w-6 bg-muted animate-pulse rounded" />
        <div className="h-9 w-36 bg-muted animate-pulse rounded-full" />
      </div>

      {/* Transactions skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-20 bg-muted animate-pulse rounded" />
        ))}
      </div>
    </div>
  );
}
