"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { transactionsApi } from "@/lib/api";
import type { TransactionFilters } from "@/mock/types";

export const CONSOLIDATED_TRANSACTIONS_QUERY_KEY = "consolidatedTransactions";

export function useConsolidatedTransactions(
  filters?: Omit<TransactionFilters, "accountId">,
) {
  // Serialize dates to timestamps for proper query key comparison
  const serializedFilters = filters
    ? {
        ...filters,
        dateFrom: filters.dateFrom?.getTime(),
        dateTo: filters.dateTo?.getTime(),
      }
    : undefined;

  return useInfiniteQuery({
    queryKey: [CONSOLIDATED_TRANSACTIONS_QUERY_KEY, serializedFilters],
    queryFn: ({ pageParam }) =>
      transactionsApi.getConsolidatedTransactions({
        limit: 20,
        cursor: pageParam,
        ...filters,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}
