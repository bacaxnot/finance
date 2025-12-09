"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountsApi } from "@/lib/api";
import { ACCOUNTS_QUERY_KEY } from "./useAccounts";
import { CONSOLIDATED_VIEW_QUERY_KEY } from "./useConsolidatedView";
import { toast } from "sonner";

export function useArchiveAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountId: string) => accountsApi.archiveAccount(accountId),
    onSuccess: (archivedAccount) => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [CONSOLIDATED_VIEW_QUERY_KEY],
      });

      toast.success("Account archived", {
        description: `${archivedAccount.name} has been archived.`,
      });
    },
    onError: (error) => {
      toast.error("Failed to archive account", {
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    },
  });
}
