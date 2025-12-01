"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateAccountInput } from "@repo/db";
import { accountsApi } from "@/lib/api";
import { ACCOUNTS_QUERY_KEY } from "./useAccounts";
import { CONSOLIDATED_VIEW_QUERY_KEY } from "./useConsolidatedView";
import { toast } from "sonner";

export function useCreateAccount() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: CreateAccountInput) =>
			accountsApi.createAccount(input),
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
				description: error instanceof Error ? error.message : "An error occurred",
			});
		},
	});
}
