"use client";

import { useState } from "react";
import type { Account, AccountFilters as Filters, CreateAccountInput } from "@/mock/types";
import { AccountStatus } from "@/mock/types";
import { useAccounts, useCreateAccount, useArchiveAccount } from "@/hooks/accounts";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Plus } from "lucide-react";
import { AccountCard } from "./AccountCard";
import { AccountTable } from "./AccountTable";
import { AccountForm } from "./AccountForm";
import { AccountFilters } from "./AccountFilters";
import { ArchiveAccountModal } from "./ArchiveAccountModal";
import { AccountSkeleton } from "./AccountSkeleton";

interface AccountListProps {
	hideCreateButton?: boolean;
	filters?: Filters;
	onFiltersChange?: (filters: Filters) => void;
	isFiltersOpen?: boolean;
	onFiltersOpenChange?: (open: boolean) => void;
}

export function AccountList({
	hideCreateButton = false,
	filters: externalFilters,
	onFiltersChange: externalOnFiltersChange,
	isFiltersOpen,
	onFiltersOpenChange,
}: AccountListProps) {
	const [internalFilters, setInternalFilters] = useState<Filters>({
		status: AccountStatus.ACTIVE,
	});

	// Use external filters if provided, otherwise use internal state
	const filters = externalFilters !== undefined ? externalFilters : internalFilters;
	const setFilters = externalOnFiltersChange || setInternalFilters;
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [editingAccount, setEditingAccount] = useState<Account | null>(null);
	const [archivingAccount, setArchivingAccount] = useState<Account | null>(null);

	// Queries and mutations
	const { data, isLoading, error, refetch } = useAccounts(filters);
	const createMutation = useCreateAccount();
	const archiveMutation = useArchiveAccount();

	const handleCreateAccount = (input: CreateAccountInput) => {
		createMutation.mutate(input, {
			onSuccess: () => {
				setIsCreateModalOpen(false);
			},
		});
	};

	const handleArchiveAccount = () => {
		if (!archivingAccount) return;

		archiveMutation.mutate(archivingAccount.id, {
			onSuccess: () => {
				setArchivingAccount(null);
			},
		});
	};

	// Loading state
	if (isLoading) {
		return (
			<div className="space-y-4">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="h-11 w-32 bg-muted animate-pulse rounded" />
					<div className="h-11 w-24 bg-muted animate-pulse rounded" />
				</div>
				<div className="md:hidden space-y-4">
					<AccountSkeleton variant="card" count={4} />
				</div>
				<div className="hidden md:block">
					<div className="rounded-md border">
						<table className="w-full caption-bottom text-sm">
							<thead className="border-b">
								<tr className="border-b transition-colors hover:bg-muted/50">
									<th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-12">Icon</th>
									<th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
									<th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
									<th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Currency</th>
									<th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Balance</th>
									<th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
									<th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground w-16">Actions</th>
								</tr>
							</thead>
							<tbody>
								<AccountSkeleton variant="table" count={4} />
							</tbody>
						</table>
					</div>
				</div>
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<Alert variant="destructive">
				<AlertCircle className="size-4" />
				<AlertDescription className="flex items-center justify-between">
					<span>Failed to load accounts. Please try again.</span>
					<Button variant="outline" size="sm" onClick={() => refetch()}>
						Retry
					</Button>
				</AlertDescription>
			</Alert>
		);
	}

	const accounts = data?.accounts || [];

	// Empty state
	if (accounts.length === 0 && !filters.type && !filters.search) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<div className="rounded-full bg-muted p-6 mb-4">
					<Plus className="size-12 text-muted-foreground" />
				</div>
				<h3 className="text-lg font-semibold mb-2">No accounts yet</h3>
				<p className="text-muted-foreground mb-6 max-w-sm">
					Get started by creating your first account to track your finances.
				</p>
				<Button onClick={() => setIsCreateModalOpen(true)} className="h-11 min-h-[44px]">
					<Plus className="mr-2 size-5" />
					Create Account
				</Button>

				{/* Create Account Modal */}
				<Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Create Account</DialogTitle>
						</DialogHeader>
						<AccountForm
							onSuccess={handleCreateAccount}
							onCancel={() => setIsCreateModalOpen(false)}
							isLoading={createMutation.isPending}
						/>
					</DialogContent>
				</Dialog>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header with optional Create button and Filters */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				{!hideCreateButton && (
					<Button
						onClick={() => setIsCreateModalOpen(true)}
						className="h-11 min-h-[44px] gap-2"
					>
						<Plus className="size-5" />
						Create Account
					</Button>
				)}

				<AccountFilters
					filters={filters}
					onFiltersChange={setFilters}
					className={hideCreateButton ? "sm:ml-auto" : ""}
					isOpen={isFiltersOpen}
					onOpenChange={onFiltersOpenChange}
					triggerHidden={isFiltersOpen !== undefined}
				/>
			</div>

			{/* Accounts List - Mobile: Cards, Desktop: Table */}
			{accounts.length === 0 ? (
				<Alert>
					<AlertCircle className="size-4" />
					<AlertDescription>
						No accounts found matching your filters. Try adjusting your search criteria.
					</AlertDescription>
				</Alert>
			) : (
				<>
					{/* Mobile: Card View */}
					<div className="md:hidden space-y-4">
						{accounts.map((account) => (
							<AccountCard
								key={account.id}
								account={account}
								onEdit={setEditingAccount}
								onArchive={(id) => {
									const account = accounts.find((a) => a.id === id);
									if (account) setArchivingAccount(account);
								}}
							/>
						))}
					</div>

					{/* Desktop: Table View */}
					<div className="hidden md:block">
						<AccountTable
							accounts={accounts}
							onEdit={setEditingAccount}
							onArchive={(id) => {
								const account = accounts.find((a) => a.id === id);
								if (account) setArchivingAccount(account);
							}}
						/>
					</div>
				</>
			)}

			{/* Edit Account Modal */}
			<Dialog open={!!editingAccount} onOpenChange={(open) => !open && setEditingAccount(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Account</DialogTitle>
					</DialogHeader>
					<AccountForm
						account={editingAccount || undefined}
						onSuccess={() => {
							// For now, just close the modal
							// In real implementation, would call updateMutation
							setEditingAccount(null);
						}}
						onCancel={() => setEditingAccount(null)}
					/>
				</DialogContent>
			</Dialog>

			{/* Archive Account Modal */}
			<ArchiveAccountModal
				account={archivingAccount}
				isOpen={!!archivingAccount}
				onConfirm={handleArchiveAccount}
				onCancel={() => setArchivingAccount(null)}
				isLoading={archiveMutation.isPending}
			/>
		</div>
	);
}
