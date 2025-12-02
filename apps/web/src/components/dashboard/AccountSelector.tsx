"use client";

import { ChevronDown } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Account } from "@/mock/types";

interface AccountSelectorProps {
	accounts: Account[];
	selectedAccountId: string;
	onAccountChange: (accountId: string) => void;
}

export function AccountSelector({
	accounts,
	selectedAccountId,
	onAccountChange,
}: AccountSelectorProps) {
	return (
		<Select value={selectedAccountId} onValueChange={onAccountChange}>
			<SelectTrigger className="h-9 w-auto gap-1 rounded-full border-border bg-muted/50 px-3 text-sm">
				<SelectValue />
				<ChevronDown className="size-3.5 opacity-50" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="all">All Accounts</SelectItem>
				{accounts.map((account) => (
					<SelectItem key={account.id} value={account.id}>
						{account.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
