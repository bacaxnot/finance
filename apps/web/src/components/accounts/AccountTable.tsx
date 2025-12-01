"use client";

import type { Account } from "@repo/db";
import { AccountStatus } from "@repo/db";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
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

interface AccountTableProps {
	accounts: Account[];
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

export function AccountTable({
	accounts,
	onEdit,
	onArchive,
}: AccountTableProps) {
	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-12">Icon</TableHead>
						<TableHead>Name</TableHead>
						<TableHead>Type</TableHead>
						<TableHead>Currency</TableHead>
						<TableHead className="text-right">Balance</TableHead>
						<TableHead>Status</TableHead>
						<TableHead className="w-16 text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{accounts.map((account) => (
						<TableRow key={account.id}>
							{/* Icon */}
							<TableCell>
								<div className="flex size-8 items-center justify-center rounded-full bg-muted">
									<AccountTypeIcon type={account.type} size="sm" />
								</div>
							</TableCell>

							{/* Name */}
							<TableCell className="font-medium">{account.name}</TableCell>

							{/* Type */}
							<TableCell>{getAccountTypeLabel(account.type)}</TableCell>

							{/* Currency */}
							<TableCell>{account.currency}</TableCell>

							{/* Balance */}
							<TableCell className="text-right font-mono">
								{formatCurrency(account.balance, account.currency)}
							</TableCell>

							{/* Status */}
							<TableCell>
								<Badge
									variant={
										account.status === AccountStatus.ACTIVE
											? "default"
											: "secondary"
									}
								>
									{account.status === AccountStatus.ACTIVE ? "Active" : "Archived"}
								</Badge>
							</TableCell>

							{/* Actions */}
							<TableCell className="text-right">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="size-8"
										>
											<MoreVertical className="size-4" />
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
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
