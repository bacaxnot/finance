import { z } from "zod";

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

export const TransactionType = {
	INCOME: "income",
	EXPENSE: "expense",
	TRANSFER: "transfer",
} as const;

export type TransactionType =
	(typeof TransactionType)[keyof typeof TransactionType];

export const TransactionCategory = {
	// Income categories
	SALARY: "salary",
	FREELANCE: "freelance",
	INVESTMENT: "investment",
	REFUND: "refund",
	OTHER_INCOME: "other_income",

	// Expense categories
	GROCERIES: "groceries",
	DINING: "dining",
	TRANSPORTATION: "transportation",
	UTILITIES: "utilities",
	RENT: "rent",
	HEALTHCARE: "healthcare",
	ENTERTAINMENT: "entertainment",
	SHOPPING: "shopping",
	EDUCATION: "education",
	TRAVEL: "travel",
	INSURANCE: "insurance",
	OTHER_EXPENSE: "other_expense",

	// Transfer category
	TRANSFER: "transfer",
} as const;

export type TransactionCategory =
	(typeof TransactionCategory)[keyof typeof TransactionCategory];

export const TransactionStatus = {
	PENDING: "pending",
	COMPLETED: "completed",
	FAILED: "failed",
} as const;

export type TransactionStatus =
	(typeof TransactionStatus)[keyof typeof TransactionStatus];

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

export const transactionTypeSchema = z.enum([
	TransactionType.INCOME,
	TransactionType.EXPENSE,
	TransactionType.TRANSFER,
]);

export const transactionCategorySchema = z.enum([
	TransactionCategory.SALARY,
	TransactionCategory.FREELANCE,
	TransactionCategory.INVESTMENT,
	TransactionCategory.REFUND,
	TransactionCategory.OTHER_INCOME,
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
	TransactionCategory.TRANSFER,
]);

export const transactionStatusSchema = z.enum([
	TransactionStatus.PENDING,
	TransactionStatus.COMPLETED,
	TransactionStatus.FAILED,
]);

export const createTransactionSchema = z.object({
	accountId: z.string(),
	type: transactionTypeSchema,
	category: transactionCategorySchema,
	amount: z.number().positive(),
	description: z.string().min(1).max(500),
	date: z.date(),
	notes: z.string().optional(),
});

export const updateTransactionSchema = createTransactionSchema.partial();

// ============================================================================
// CORE TYPES
// ============================================================================

export interface Transaction {
	id: string;
	accountId: string;
	userId: string;
	type: TransactionType;
	category: TransactionCategory;
	amount: number;
	description: string;
	date: Date;
	status: TransactionStatus;
	notes?: string;
	createdAt: Date;
	updatedAt: Date;
}

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface TransactionStatistics {
	totalIncome: number;
	totalExpense: number;
	averageTransaction: number;
	transactionCount: number;
	incomeCount: number;
	expenseCount: number;
	transferCount: number;
}

export interface TransactionListResponse {
	transactions: Transaction[];
	total: number;
	hasMore: boolean;
	nextCursor?: string;
	statistics: TransactionStatistics;
}

export interface TransactionDetailResponse {
	transaction: Transaction;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface TransactionFilters {
	accountId?: string;
	type?: TransactionType;
	category?: TransactionCategory;
	status?: TransactionStatus;
	dateFrom?: Date;
	dateTo?: Date;
	search?: string;
}

export interface TransactionPagination {
	limit: number;
	cursor?: string;
}

export interface CategoryGroup {
	category: TransactionCategory;
	total: number;
	count: number;
	percentage: number;
}
