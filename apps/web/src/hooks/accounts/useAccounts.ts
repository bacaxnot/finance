"use client";

import { useQuery } from "@tanstack/react-query";
import type { AccountFilters } from "@/mock/types";
import { accountsApi } from "@/lib/api";

export const ACCOUNTS_QUERY_KEY = "accounts";

export function useAccounts(filters?: AccountFilters) {
	return useQuery({
		queryKey: [ACCOUNTS_QUERY_KEY, filters],
		queryFn: () => accountsApi.getAccounts(filters),
	});
}
