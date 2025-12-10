"use client";

import { useAccountTransactions } from "@/hooks/transactions";
import type { TransactionFilters } from "@/mock/types";
import { InfiniteTransactionList } from "./infinite-transaction-list";

interface TransactionListProps {
  accountId: string;
  filters?: Omit<TransactionFilters, "accountId">;
}

export function TransactionList({ accountId, filters }: TransactionListProps) {
  const queryResult = useAccountTransactions(accountId, filters);

  return (
    <InfiniteTransactionList
      queryResult={queryResult}
      filters={filters}
      emptyMessage={{
        noTransactions: "This account doesn't have any transactions yet.",
        noResults:
          "No transactions match your current filters. Try adjusting your search criteria.",
      }}
    />
  );
}
