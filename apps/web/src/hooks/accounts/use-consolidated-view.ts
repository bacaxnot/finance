"use client";

import { useQuery } from "@tanstack/react-query";
import { accountsApi } from "@/lib/api";

export const CONSOLIDATED_VIEW_QUERY_KEY = "consolidated-view";

export function useConsolidatedView() {
  return useQuery({
    queryKey: [CONSOLIDATED_VIEW_QUERY_KEY],
    queryFn: () => accountsApi.getConsolidatedView(),
  });
}
