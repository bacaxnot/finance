import type {
  Transaction,
  TransactionListResponse,
  TransactionDetailResponse,
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilters,
  TransactionPagination,
} from "@/mock/types";
import { TransactionStatus } from "@/mock/types";
import {
  MOCK_TRANSACTIONS,
  calculateTransactionStatistics,
} from "@/lib/mock-data/transactions";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let transactions = [...MOCK_TRANSACTIONS];

export const transactionsApi = {
  /**
   * Get paginated transactions with filters and statistics
   * Supports infinite scroll with cursor-based pagination
   */
  async getTransactions(
    filters?: TransactionFilters,
    pagination?: TransactionPagination,
  ): Promise<TransactionListResponse> {
    await delay(500);

    let filtered = [...transactions];

    // Apply filters
    if (filters?.accountId) {
      filtered = filtered.filter((t) => t.accountId === filters.accountId);
    }
    if (filters?.type) {
      filtered = filtered.filter((t) => t.type === filters.type);
    }
    if (filters?.category) {
      filtered = filtered.filter((t) => t.category === filters.category);
    }
    if (filters?.status) {
      filtered = filtered.filter((t) => t.status === filters.status);
    }
    if (filters?.dateFrom) {
      filtered = filtered.filter((t) => t.date >= filters.dateFrom!);
    }
    if (filters?.dateTo) {
      filtered = filtered.filter((t) => t.date <= filters.dateTo!);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(search) ||
          t.notes?.toLowerCase().includes(search),
      );
    }

    // Sort by date (most recent first)
    filtered.sort((a, b) => b.date.getTime() - a.date.getTime());

    // Calculate statistics for ALL filtered transactions (before pagination)
    const statistics = calculateTransactionStatistics(filtered);

    // Apply cursor-based pagination
    const limit = pagination?.limit || 20;
    const cursorIndex = pagination?.cursor
      ? filtered.findIndex((t) => t.id === pagination.cursor) + 1
      : 0;

    const paginatedTransactions = filtered.slice(
      cursorIndex,
      cursorIndex + limit,
    );
    const hasMore = cursorIndex + limit < filtered.length;
    const nextCursor = hasMore
      ? paginatedTransactions[paginatedTransactions.length - 1]?.id
      : undefined;

    return {
      transactions: paginatedTransactions,
      total: filtered.length,
      hasMore,
      nextCursor,
      statistics,
    };
  },

  /**
   * Get transactions by account ID (convenience method)
   */
  async getAccountTransactions(
    accountId: string,
    filters?: Omit<TransactionFilters, "accountId">,
    pagination?: TransactionPagination,
  ): Promise<TransactionListResponse> {
    return this.getTransactions({ accountId, ...(filters || {}) }, pagination);
  },

  /**
   * Get consolidated transactions from all accounts (convenience method)
   */
  async getConsolidatedTransactions(
    options?: Omit<TransactionFilters, "accountId"> & TransactionPagination,
  ): Promise<TransactionListResponse> {
    const { limit, cursor, ...filters } = options || {};
    return this.getTransactions(filters, { limit, cursor });
  },

  /**
   * Get single transaction by ID
   */
  async getTransaction(id: string): Promise<TransactionDetailResponse> {
    await delay(300);

    const transaction = transactions.find((t) => t.id === id);
    if (!transaction) {
      throw new Error("Transaction not found");
    }

    return { transaction };
  },

  /**
   * Create new transaction
   */
  async createTransaction(input: CreateTransactionInput): Promise<Transaction> {
    await delay(800);

    const newTransaction: Transaction = {
      id: `tx_${Date.now()}`,
      userId: "user_1",
      ...input,
      status: TransactionStatus.COMPLETED,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    transactions = [...transactions, newTransaction];
    return newTransaction;
  },

  /**
   * Update existing transaction
   */
  async updateTransaction(
    id: string,
    input: UpdateTransactionInput,
  ): Promise<Transaction> {
    await delay(600);

    const index = transactions.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error("Transaction not found");
    }

    const updated: Transaction = {
      ...transactions[index],
      ...input,
      updatedAt: new Date(),
    };

    transactions = [
      ...transactions.slice(0, index),
      updated,
      ...transactions.slice(index + 1),
    ];

    return updated;
  },

  /**
   * Delete transaction
   */
  async deleteTransaction(id: string): Promise<void> {
    await delay(600);

    const index = transactions.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error("Transaction not found");
    }

    transactions = [
      ...transactions.slice(0, index),
      ...transactions.slice(index + 1),
    ];
  },
};
