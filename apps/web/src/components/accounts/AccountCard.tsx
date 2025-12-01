"use client";

import type { Account } from "@repo/db";
import { AccountStatus } from "@repo/db";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Archive } from "lucide-react";
import { AccountTypeIcon } from "./AccountTypeIcon";

interface AccountCardProps {
	account: Account;
	onEdit: (account: Account) => void;
	onArchive: (accountId: string) => void;
}

const getAccountTypeLabel = (type: string) => {
	const labels: Record<string, string> = {
		checking: "Checking",
		savings: "Savings",
		credit_card: "Credit Card",
	};
	return labels[type] || type;
};

const formatCurrency = (amount: number, currency: string) => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
	}).format(amount);
};

export function AccountCard({ account, onEdit, onArchive }: AccountCardProps) {
	return (
		<Card data-slot="account-card" className="min-h-[80px]">
			<CardHeader>
				<div className="flex items-center gap-3">
					{/* Icon + Name */}
					<div className="flex size-10 items-center justify-center rounded-full bg-muted">
						<AccountTypeIcon type={account.type} size="md" />
					</div>

					{/* Name and Type */}
					<div className="flex-1 min-w-0">
						<h3 className="font-semibold truncate">{account.name}</h3>
						<p className="text-sm text-muted-foreground">
							{getAccountTypeLabel(account.type)} • {account.currency}
						</p>
					</div>

					{/* Actions Menu - Touch target: 44x44px */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="size-11 min-h-[44px] min-w-[44px]"
							>
								<MoreVertical className="size-5" />
								<span className="sr-only">Open menu</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => onEdit(account)}>
								<Edit className="mr-2 size-4" />
								Edit
							</DropdownMenuItem>
							{account.status === AccountStatus.ACTIVE && (
								<DropdownMenuItem onClick={() => onArchive(account.id)}>
									<Archive className="mr-2 size-4" />
									Archive
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</CardHeader>

			<CardContent>
				<div className="flex items-center justify-between">
					{/* Balance */}
					<div className="text-2xl font-bold">
						{formatCurrency(account.balance, account.currency)}
					</div>

					{/* Status Badge */}
					<Badge
						variant={account.status === AccountStatus.ACTIVE ? "default" : "secondary"}
					>
						{account.status === AccountStatus.ACTIVE ? "Active" : "Archived"}
					</Badge>
				</div>
			</CardContent>
		</Card>
	);
}
