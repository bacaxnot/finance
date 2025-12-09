"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { accountsApi } from "@/lib/api";
import type { CreateAccountInput } from "@/mock/types";
import { ACCOUNTS_QUERY_KEY } from "./useAccounts";
import { CONSOLIDATED_VIEW_QUERY_KEY } from "./useConsolidatedView";

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAccountInput) => accountsApi.createAccount(input),
    onSuccess: (newAccount) => {
      // Invalidate accounts list and consolidated view
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [CONSOLIDATED_VIEW_QUERY_KEY],
      });

      toast.success("Account created", {
        description: `${newAccount.name} has been created successfully.`,
      });
    },
    onError: (error) => {
      toast.error("Failed to create account", {
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    },
  });
}
