import { z } from "zod";

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

export const AccountType = {
  CHECKING: "checking",
  SAVINGS: "savings",
  CREDIT_CARD: "credit_card",
} as const;

export type AccountType = (typeof AccountType)[keyof typeof AccountType];

export const AccountStatus = {
  ACTIVE: "active",
  ARCHIVED: "archived",
} as const;

export type AccountStatus = (typeof AccountStatus)[keyof typeof AccountStatus];

export const Currency = {
  USD: "USD",
  EUR: "EUR",
  GBP: "GBP",
  JPY: "JPY",
  CAD: "CAD",
  AUD: "AUD",
  CHF: "CHF",
  MXN: "MXN",
} as const;

export type Currency = (typeof Currency)[keyof typeof Currency];

// ============================================================================
// ZOD SCHEMAS (for validation)
// ============================================================================

export const accountTypeSchema = z.enum([
  AccountType.CHECKING,
  AccountType.SAVINGS,
  AccountType.CREDIT_CARD,
]);

export const currencySchema = z.enum([
  Currency.USD,
  Currency.EUR,
  Currency.GBP,
  Currency.JPY,
  Currency.CAD,
  Currency.AUD,
  Currency.CHF,
  Currency.MXN,
]);

export const accountStatusSchema = z.enum([
  AccountStatus.ACTIVE,
  AccountStatus.ARCHIVED,
]);

// Account creation schema (what user provides)
export const createAccountSchema = z.object({
  name: z.string().min(1, "Account name is required").max(100),
  type: accountTypeSchema,
  currency: currencySchema,
  initialBalance: z.number().default(0),
});

// Account update schema (partial updates)
export const updateAccountSchema = createAccountSchema.partial();

// ============================================================================
// CORE TYPES
// ============================================================================

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  currency: Currency;
  balance: number;
  status: AccountStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface AccountListResponse {
  accounts: Account[];
  total: number;
}

export interface AccountDetailResponse {
  account: Account;
}

export interface ConsolidatedAccountView {
  totalBalance: number;
  currency: Currency; // Base currency for conversion
  accountsByType: {
    checking: Account[];
    savings: Account[];
    creditCards: Account[];
  };
  accountCount: {
    total: number;
    active: number;
    archived: number;
  };
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface AccountFilters {
  type?: AccountType;
  status?: AccountStatus;
  search?: string;
}

export interface AccountSortOptions {
  field: "name" | "balance" | "createdAt" | "updatedAt";
  direction: "asc" | "desc";
}
