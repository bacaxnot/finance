"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { transactionsApi } from "@/lib/api";
import type { UpdateTransactionInput } from "@/mock/types";
import { ACCOUNT_TRANSACTIONS_QUERY_KEY } from "./use-account-transactions";
import { CONSOLIDATED_TRANSACTIONS_QUERY_KEY } from "./use-consolidated-transactions";
import { ACCOUNTS_QUERY_KEY } from "@/hooks/accounts/use-accounts";
import { CONSOLIDATED_VIEW_QUERY_KEY } from "@/hooks/accounts/use-consolidated-view";

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTransactionInput }) =>
      transactionsApi.updateTransaction(id, input),
    onSuccess: (updatedTransaction) => {
      // Invalidate transaction queries
      queryClient.invalidateQueries({
        queryKey: [ACCOUNT_TRANSACTIONS_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [CONSOLIDATED_TRANSACTIONS_QUERY_KEY],
      });

      // Invalidate account queries (balances might change)
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [CONSOLIDATED_VIEW_QUERY_KEY],
      });

      toast.success("Transacción actualizada", {
        description: updatedTransaction.description,
      });
    },
    onError: (error) => {
      toast.error("Error al actualizar transacción", {
        description:
          error instanceof Error ? error.message : "Ocurrió un error",
      });
    },
  });
}
