import type {
  Account,
  AccountListResponse,
  AccountDetailResponse,
  ConsolidatedAccountView,
  CreateAccountInput,
  UpdateAccountInput,
  AccountFilters,
} from "@/mock/types";
import { AccountStatus } from "@/mock/types";
import {
  MOCK_ACCOUNTS,
  getMockConsolidatedView,
} from "@/lib/mock-data/accounts";

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory storage for mock (will be replaced with real API)
let accounts = [...MOCK_ACCOUNTS];

export const accountsApi = {
  async getAccounts(filters?: AccountFilters): Promise<AccountListResponse> {
    await delay(500);

    let filtered = [...accounts];

    // Apply filters
    if (filters?.type) {
      filtered = filtered.filter((a) => a.type === filters.type);
    }
    if (filters?.status) {
      filtered = filtered.filter((a) => a.status === filters.status);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter((a) => a.name.toLowerCase().includes(search));
    }

    return {
      accounts: filtered,
      total: filtered.length,
    };
  },

  async getAccount(id: string): Promise<AccountDetailResponse> {
    await delay(300);

    const account = accounts.find((a) => a.id === id);
    if (!account) {
      throw new Error("Account not found");
    }

    return { account };
  },

  async getConsolidatedView(): Promise<ConsolidatedAccountView> {
    await delay(400);
    // Recalculate with current accounts data
    const activeAccounts = accounts.filter(
      (a) => a.status === AccountStatus.ACTIVE,
    );

    return {
      totalBalance: activeAccounts.reduce((sum, acc) => sum + acc.balance, 0),
      currency: "USD",
      accountsByType: {
        checking: activeAccounts.filter((a) => a.type === "checking"),
        savings: activeAccounts.filter((a) => a.type === "savings"),
        creditCards: activeAccounts.filter((a) => a.type === "credit_card"),
      },
      accountCount: {
        total: accounts.length,
        active: activeAccounts.length,
        archived: accounts.filter((a) => a.status === AccountStatus.ARCHIVED)
          .length,
      },
    };
  },

  async createAccount(input: CreateAccountInput): Promise<Account> {
    await delay(800);

    const newAccount: Account = {
      id: `${accounts.length + 1}`,
      userId: "user_1", // Will come from Clerk auth
      name: input.name,
      type: input.type,
      currency: input.currency,
      balance: input.initialBalance,
      status: AccountStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    accounts = [...accounts, newAccount];
    return newAccount;
  },

  async updateAccount(id: string, input: UpdateAccountInput): Promise<Account> {
    await delay(600);

    const index = accounts.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error("Account not found");
    }

    const updated: Account = {
      ...accounts[index],
      ...input,
      updatedAt: new Date(),
    };

    accounts = [
      ...accounts.slice(0, index),
      updated,
      ...accounts.slice(index + 1),
    ];
    return updated;
  },

  async archiveAccount(id: string): Promise<Account> {
    await delay(600);

    const index = accounts.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error("Account not found");
    }

    const updated: Account = {
      ...accounts[index],
      status: AccountStatus.ARCHIVED,
      updatedAt: new Date(),
    };

    accounts = [
      ...accounts.slice(0, index),
      updated,
      ...accounts.slice(index + 1),
    ];
    return updated;
  },

  async unarchiveAccount(id: string): Promise<Account> {
    await delay(600);

    const index = accounts.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error("Account not found");
    }

    const updated: Account = {
      ...accounts[index],
      status: AccountStatus.ACTIVE,
      updatedAt: new Date(),
    };

    accounts = [
      ...accounts.slice(0, index),
      updated,
      ...accounts.slice(index + 1),
    ];
    return updated;
  },
};
