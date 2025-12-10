"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/mock/types";
import { type TransactionCategory, TransactionType } from "@/mock/types";
import { TransactionCategoryIcon } from "./transaction-category-icon";

interface TransactionCardProps {
  transaction: Transaction;
  onClick?: (transaction: Transaction) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
};

const getCategoryLabel = (category: TransactionCategory): string => {
  const labels: Record<TransactionCategory, string> = {
    // Income
    salary: "Salary",
    freelance: "Freelance",
    investment: "Investment",
    refund: "Refund",
    other_income: "Other Income",
    // Expenses
    groceries: "Groceries",
    dining: "Dining",
    transportation: "Transportation",
    utilities: "Utilities",
    rent: "Rent",
    healthcare: "Healthcare",
    entertainment: "Entertainment",
    shopping: "Shopping",
    education: "Education",
    travel: "Travel",
    insurance: "Insurance",
    other_expense: "Other Expense",
    // Transfer
    transfer: "Transfer",
  };
  return labels[category] || category;
};

export function TransactionCard({
  transaction,
  onClick,
}: TransactionCardProps) {
  const isIncome = transaction.type === TransactionType.INCOME;
  const isExpense = transaction.type === TransactionType.EXPENSE;

  return (
    <div
      className={cn(
        "flex items-center gap-3 border-b border-border py-4 px-4 transition-colors",
        onClick && "cursor-pointer hover:bg-secondary/30",
      )}
      onClick={() => onClick?.(transaction)}
    >
      {/* Icon */}
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary/50">
        <TransactionCategoryIcon category={transaction.category} size="lg" />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-[15px] leading-tight truncate">
          {transaction.description}
        </h3>
        <p className="text-[13px] text-muted-foreground mt-0.5">
          {getCategoryLabel(transaction.category)} •{" "}
          {formatDate(transaction.date)}
        </p>
      </div>

      {/* Amount */}
      <div className="text-right shrink-0">
        <div className="font-semibold text-base tabular-nums">
          {isExpense && "−"}
          {isIncome && "+"}
          {formatCurrency(transaction.amount)}
        </div>
        {transaction.status !== "completed" && (
          <Badge variant="secondary" className="text-xs mt-1">
            {transaction.status}
          </Badge>
        )}
      </div>
    </div>
  );
}
