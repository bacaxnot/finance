"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { transactionsApi } from "@/lib/api";
import type { CreateTransactionInput } from "@/mock/types";
import { ACCOUNT_TRANSACTIONS_QUERY_KEY } from "./use-account-transactions";
import { CONSOLIDATED_TRANSACTIONS_QUERY_KEY } from "./use-consolidated-transactions";
import { ACCOUNTS_QUERY_KEY } from "@/hooks/accounts/use-accounts";
import { CONSOLIDATED_VIEW_QUERY_KEY } from "@/hooks/accounts/use-consolidated-view";

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTransactionInput) =>
      transactionsApi.createTransaction(input),
    onSuccess: (newTransaction) => {
      // Invalidate transaction queries
      queryClient.invalidateQueries({
        queryKey: [ACCOUNT_TRANSACTIONS_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [CONSOLIDATED_TRANSACTIONS_QUERY_KEY],
      });

      // Invalidate account queries (balances change)
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [CONSOLIDATED_VIEW_QUERY_KEY],
      });

      toast.success("Transacción creada", {
        description: newTransaction.description,
      });
    },
    onError: (error) => {
      toast.error("Error al crear transacción", {
        description:
          error instanceof Error ? error.message : "Ocurrió un error",
      });
    },
  });
}
