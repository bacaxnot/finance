"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useAccountTransactions } from "@/hooks/transactions";
import type { TransactionFilters } from "@/mock/types";
import { TransactionCard } from "./TransactionCard";
import { TransactionSkeleton } from "./TransactionSkeleton";
import { TransactionTable } from "./TransactionTable";

interface TransactionListProps {
  accountId: string;
  filters?: Omit<TransactionFilters, "accountId">;
}

export function TransactionList({ accountId, filters }: TransactionListProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useAccountTransactions(accountId, filters);

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
            : "This account doesn't have any transactions yet."}
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
