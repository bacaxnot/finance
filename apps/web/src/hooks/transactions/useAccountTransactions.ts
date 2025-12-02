"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import type { TransactionFilters } from "@/mock/types";
import { transactionsApi } from "@/lib/api";

export const ACCOUNT_TRANSACTIONS_QUERY_KEY = "accountTransactions";

export function useAccountTransactions(
	accountId: string,
	additionalFilters?: Omit<TransactionFilters, "accountId">,
) {
	// Serialize dates to timestamps for proper query key comparison
	const serializedFilters = additionalFilters
		? {
				...additionalFilters,
				dateFrom: additionalFilters.dateFrom?.getTime(),
				dateTo: additionalFilters.dateTo?.getTime(),
		  }
		: undefined;

	return useInfiniteQuery({
		queryKey: [ACCOUNT_TRANSACTIONS_QUERY_KEY, accountId, serializedFilters],
		queryFn: ({ pageParam }) =>
			transactionsApi.getAccountTransactions(accountId, {
				limit: 20,
				cursor: pageParam,
				...additionalFilters,
			}),
		initialPageParam: undefined as string | undefined,
		getNextPageParam: (lastPage) => lastPage.nextCursor,
		enabled: !!accountId,
	});
}
