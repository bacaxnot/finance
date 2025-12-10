"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { accountsApi } from "@/lib/api";
import type { Account, UpdateAccountInput } from "@/mock/types";
import { ACCOUNT_QUERY_KEY } from "./use-account";
import { ACCOUNTS_QUERY_KEY } from "./use-accounts";
import { CONSOLIDATED_VIEW_QUERY_KEY } from "./use-consolidated-view";

interface UpdateAccountVariables {
  accountId: string;
  input: UpdateAccountInput;
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ accountId, input }: UpdateAccountVariables) =>
      accountsApi.updateAccount(accountId, input),
    onMutate: async ({ accountId, input }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: [ACCOUNT_QUERY_KEY, accountId],
      });

      // Snapshot previous value
      const previousAccount = queryClient.getQueryData<{
        account: Account;
      }>([ACCOUNT_QUERY_KEY, accountId]);

      // Optimistically update
      if (previousAccount) {
        queryClient.setQueryData([ACCOUNT_QUERY_KEY, accountId], {
          account: { ...previousAccount.account, ...input },
        });
      }

      return { previousAccount };
    },
    onError: (error, { accountId }, context) => {
      // Rollback on error
      if (context?.previousAccount) {
        queryClient.setQueryData(
          [ACCOUNT_QUERY_KEY, accountId],
          context.previousAccount,
        );
      }

      toast.error("Failed to update account", {
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    },
    onSuccess: (updatedAccount) => {
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [CONSOLIDATED_VIEW_QUERY_KEY],
      });

      toast.success("Account updated", {
        description: `${updatedAccount.name} has been updated successfully.`,
      });
    },
  });
}
