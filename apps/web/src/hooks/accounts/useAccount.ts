"use client";

import { useQuery } from "@tanstack/react-query";
import { accountsApi } from "@/lib/api";

export const ACCOUNT_QUERY_KEY = "account";

export function useAccount(accountId: string) {
	return useQuery({
		queryKey: [ACCOUNT_QUERY_KEY, accountId],
		queryFn: () => accountsApi.getAccount(accountId),
		enabled: !!accountId,
	});
}
