"use client";

import type { Transaction } from "@/mock/types";
import { TransactionType, TransactionCategory } from "@/mock/types";
import { Badge } from "@/components/ui/badge";
import { TransactionCategoryIcon } from "./TransactionCategoryIcon";
import { cn } from "@/lib/utils";

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

export function TransactionCard({
	transaction,
	onClick,
}: TransactionCardProps) {
	const isIncome = transaction.type === TransactionType.INCOME;
	const isExpense = transaction.type === TransactionType.EXPENSE;
	const isTransfer = transaction.type === TransactionType.TRANSFER;

	return (
		<div
			className={cn(
				"relative min-h-[88px] border-b border-border py-4 pl-5 pr-4 transition-shadow",
				onClick && "cursor-pointer hover:bg-accent/50",
			)}
			onClick={() => onClick?.(transaction)}
		>
			{/* Color indicator bar */}
			<div
				className={cn(
					"absolute left-0 top-0 bottom-0 w-1",
					isIncome && "bg-green-500",
					isExpense && "bg-red-500",
					isTransfer && "bg-blue-500",
				)}
			/>

			<div className="flex items-center gap-3">
				{/* Icon */}
				<div className="flex size-10 items-center justify-center rounded-full bg-muted">
					<TransactionCategoryIcon category={transaction.category} />
				</div>

				{/* Details */}
				<div className="flex-1 min-w-0">
					<h3 className="font-semibold truncate">{transaction.description}</h3>
					<p className="text-sm text-muted-foreground">
						{getCategoryLabel(transaction.category)} •{" "}
						{formatDate(transaction.date)}
					</p>
				</div>

				{/* Amount */}
				<div className="text-right">
					<div
						className={cn(
							"font-bold text-lg",
							isIncome && "text-green-600",
							isExpense && "text-red-600",
							isTransfer && "text-blue-600",
						)}
					>
						{isExpense && "-"}
						{isIncome && "+"}
						{formatCurrency(transaction.amount)}
					</div>
					{transaction.status !== "completed" && (
						<Badge variant="secondary" className="text-xs">
							{transaction.status}
						</Badge>
					)}
				</div>
			</div>
		</div>
	);
}
