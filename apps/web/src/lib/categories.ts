import { TransactionCategory, TransactionType } from "@/mock/types";

export interface CategoryConfig {
  label: string;
  type: TransactionType;
}

export const CATEGORY_LABELS: Record<TransactionCategory, string> = {
  // Income categories
  salary: "Salary",
  freelance: "Freelance",
  investment: "Investment",
  refund: "Refund",
  other_income: "Other Income",

  // Expense categories
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

  // Transfer category
  transfer: "Transfer",
};

/**
 * Get categories for a specific transaction type
 */
export function getCategoriesForType(
  type: TransactionType,
): TransactionCategory[] {
  const incomeCategories: TransactionCategory[] = [
    TransactionCategory.SALARY,
    TransactionCategory.FREELANCE,
    TransactionCategory.INVESTMENT,
    TransactionCategory.REFUND,
    TransactionCategory.OTHER_INCOME,
  ];

  const expenseCategories: TransactionCategory[] = [
    TransactionCategory.GROCERIES,
    TransactionCategory.DINING,
    TransactionCategory.TRANSPORTATION,
    TransactionCategory.UTILITIES,
    TransactionCategory.RENT,
    TransactionCategory.HEALTHCARE,
    TransactionCategory.ENTERTAINMENT,
    TransactionCategory.SHOPPING,
    TransactionCategory.EDUCATION,
    TransactionCategory.TRAVEL,
    TransactionCategory.INSURANCE,
    TransactionCategory.OTHER_EXPENSE,
  ];

  if (type === TransactionType.INCOME) {
    return incomeCategories;
  }
  if (type === TransactionType.EXPENSE) {
    return expenseCategories;
  }
  return [TransactionCategory.TRANSFER];
}
