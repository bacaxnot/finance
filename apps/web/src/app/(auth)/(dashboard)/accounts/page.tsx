"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccountList } from "@/components/accounts/AccountList";
import { SwipeWrapper } from "@/components/ui/swipe-wrapper";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AccountForm } from "@/components/accounts/AccountForm";
import { useCreateAccount } from "@/hooks/accounts";
import type { CreateAccountInput } from "@repo/db";

export default function AccountsPage() {
	const router = useRouter();
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const createMutation = useCreateAccount();

	const handleCreateAccount = (input: CreateAccountInput) => {
		createMutation.mutate(input, {
			onSuccess: () => {
				setIsCreateModalOpen(false);
			},
		});
	};

	return (
		<div className="space-y-6">
			{/* Header with Back Button, Create Button, and Title */}
			<header className="space-y-4">
				{/* Button Row */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Link href="/dashboard">
							<Button variant="ghost" size="icon" className="size-11 min-h-[44px] min-w-[44px]">
								<ArrowLeft className="size-4" />
								<span className="sr-only">Back to Dashboard</span>
							</Button>
						</Link>

						<h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
					</div>
					<Button
						variant="ghost"
						onClick={() => setIsCreateModalOpen(true)}
						size="icon"
						className="size-4 min-h-[44px] min-w-[44px]"
						aria-label="Create new account"
					>
						<Plus className="size-4" />
					</Button>
				</div>

				{/* Title Section */}
				<div>
					<p className="text-muted-foreground">
						Manage your checking, savings, and credit card accounts
					</p>
				</div>
			</header>

			{/* Swipe Detection Wrapper */}
			<SwipeWrapper onSwipeRight={() => router.push("/dashboard")}>
				<AccountList hideCreateButton />
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
