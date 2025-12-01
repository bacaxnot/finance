"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AccountList } from "@/components/accounts/AccountList";
import { SwipeWrapper } from "@/components/ui/swipe-wrapper";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AccountForm } from "@/components/accounts/AccountForm";
import { useCreateAccount } from "@/hooks/accounts";
import type { CreateAccountInput, AccountFilters } from "@/mock/types";
import { AccountStatus } from "@/mock/types";

export default function AccountsPage() {
	const router = useRouter();
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isFiltersOpen, setIsFiltersOpen] = useState(false);
	const [filters, setFilters] = useState<AccountFilters>({
		status: AccountStatus.ACTIVE,
	});
	const createMutation = useCreateAccount();

	const handleCreateAccount = (input: CreateAccountInput) => {
		createMutation.mutate(input, {
			onSuccess: () => {
				setIsCreateModalOpen(false);
			},
		});
	};

	// Count active filters (excluding default status filter)
	const activeFilterCount = [
		filters.type,
		filters.search,
	].filter(Boolean).length;

	return (
		<div className="space-y-6">
			{/* Header with Back Button, Filter Button, Create Button, and Title */}
			<header className="space-y-4">
				{/* Button Row */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Link href="/dashboard">
							<Button variant="ghost" size="icon" className="size-11 min-h-[44px] min-w-[44px]">
								<ArrowLeft className="size-5" />
								<span className="sr-only">Back to Dashboard</span>
							</Button>
						</Link>

						<h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
					</div>

					<div className="flex items-center gap-2">
						{/* Filter Button - Mobile Only */}
						<Button
							variant="ghost"
							onClick={() => setIsFiltersOpen(true)}
							size="icon"
							className="size-11 min-h-[44px] min-w-[44px] relative md:hidden"
							aria-label="Open filters"
						>
							<Filter className="size-5" />
							{activeFilterCount > 0 && (
								<Badge
									variant="secondary"
									className="absolute -top-1 -right-1 size-5 p-0 flex items-center justify-center rounded-full text-xs"
								>
									{activeFilterCount}
								</Badge>
							)}
						</Button>

						{/* Create Button */}
						<Button
							variant="ghost"
							onClick={() => setIsCreateModalOpen(true)}
							size="icon"
							className="size-11 min-h-[44px] min-w-[44px]"
							aria-label="Create new account"
						>
							<Plus className="size-5" />
						</Button>
					</div>
				</div>

				{/* Description */}
				<div>
					<p className="text-muted-foreground">
						Manage your checking, savings, and credit card accounts
					</p>
				</div>
			</header>

			{/* Swipe Detection Wrapper */}
			<SwipeWrapper onSwipeRight={() => router.push("/dashboard")}>
				<AccountList
					hideCreateButton
					filters={filters}
					onFiltersChange={setFilters}
					isFiltersOpen={isFiltersOpen}
					onFiltersOpenChange={setIsFiltersOpen}
				/>
			</SwipeWrapper>

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
