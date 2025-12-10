"use client";

import { useQuery } from "@tanstack/react-query";
import { accountsApi } from "@/lib/api";
import type { AccountFilters } from "@/mock/types";

export const ACCOUNTS_QUERY_KEY = "accounts";

export function useAccounts(filters?: AccountFilters) {
  return useQuery({
    queryKey: [ACCOUNTS_QUERY_KEY, filters],
    queryFn: () => accountsApi.getAccounts(filters),
  });
}
