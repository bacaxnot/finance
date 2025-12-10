"use client";

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
      <SelectTrigger className="h-8 w-auto gap-1.5 rounded-lg border-0 bg-secondary px-3 text-sm font-medium text-foreground hover:bg-secondary/80 focus:ring-0 focus:ring-offset-0">
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="start" className="min-w-[160px]">
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
