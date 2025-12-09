"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/mock/types";
import { type TransactionCategory, TransactionType } from "@/mock/types";
import { TransactionCategoryIcon } from "./TransactionCategoryIcon";

interface TransactionTableProps {
  transactions: Transaction[];
  onTransactionClick?: (transaction: Transaction) => void;
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
    year: "numeric",
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

const getTypeLabel = (type: TransactionType): string => {
  const labels: Record<TransactionType, string> = {
    income: "Income",
    expense: "Expense",
    transfer: "Transfer",
  };
  return labels[type] || type;
};

export function TransactionTable({
  transactions,
  onTransactionClick,
}: TransactionTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="w-[140px]">Category</TableHead>
            <TableHead className="w-[100px]">Type</TableHead>
            <TableHead className="w-[120px] text-right">Amount</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => {
            const isIncome = transaction.type === TransactionType.INCOME;
            const isExpense = transaction.type === TransactionType.EXPENSE;
            const isTransfer = transaction.type === TransactionType.TRANSFER;

            return (
              <TableRow
                key={transaction.id}
                className={cn(
                  "transition-colors",
                  onTransactionClick && "cursor-pointer hover:bg-accent/50",
                )}
                onClick={() => onTransactionClick?.(transaction)}
              >
                <TableCell className="font-medium">
                  {formatDate(transaction.date)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                      <TransactionCategoryIcon
                        category={transaction.category}
                        size="sm"
                      />
                    </div>
                    <span className="truncate">{transaction.description}</span>
                  </div>
                </TableCell>
                <TableCell>{getCategoryLabel(transaction.category)}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn(
                      isIncome && "bg-green-100 text-green-700",
                      isExpense && "bg-red-100 text-red-700",
                      isTransfer && "bg-blue-100 text-blue-700",
                    )}
                  >
                    {getTypeLabel(transaction.type)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={cn(
                      "font-semibold",
                      isIncome && "text-green-600",
                      isExpense && "text-red-600",
                      isTransfer && "text-blue-600",
                    )}
                  >
                    {isExpense && "-"}
                    {isIncome && "+"}
                    {formatCurrency(transaction.amount)}
                  </span>
                </TableCell>
                <TableCell>
                  {transaction.status !== "completed" && (
                    <Badge variant="secondary">{transaction.status}</Badge>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
