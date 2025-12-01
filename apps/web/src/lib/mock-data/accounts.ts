import type { Account, ConsolidatedAccountView } from "@repo/db";
import { AccountType, AccountStatus, Currency } from "@repo/db";

export const MOCK_ACCOUNTS: Account[] = [
	{
		id: "1",
		userId: "user_1",
		name: "Main Checking",
		type: AccountType.CHECKING,
		currency: Currency.USD,
		balance: 5420.5,
		status: AccountStatus.ACTIVE,
		createdAt: new Date("2024-01-15"),
		updatedAt: new Date("2024-11-29"),
	},
	{
		id: "2",
		userId: "user_1",
		name: "Emergency Savings",
		type: AccountType.SAVINGS,
		currency: Currency.USD,
		balance: 15000.0,
		status: AccountStatus.ACTIVE,
		createdAt: new Date("2024-01-20"),
		updatedAt: new Date("2024-11-28"),
	},
	{
		id: "3",
		userId: "user_1",
		name: "Chase Freedom",
		type: AccountType.CREDIT_CARD,
		currency: Currency.USD,
		balance: -1234.56,
		status: AccountStatus.ACTIVE,
		createdAt: new Date("2024-02-01"),
		updatedAt: new Date("2024-11-30"),
	},
	{
		id: "4",
		userId: "user_1",
		name: "Old Savings",
		type: AccountType.SAVINGS,
		currency: Currency.USD,
		balance: 500.0,
		status: AccountStatus.ARCHIVED,
		createdAt: new Date("2023-06-10"),
		updatedAt: new Date("2024-08-15"),
	},
];

export const getMockConsolidatedView = (): ConsolidatedAccountView => {
	const activeAccounts = MOCK_ACCOUNTS.filter(
		(a) => a.status === AccountStatus.ACTIVE,
	);

	return {
		totalBalance: activeAccounts.reduce((sum, acc) => sum + acc.balance, 0),
		currency: Currency.USD,
		accountsByType: {
			checking: activeAccounts.filter((a) => a.type === AccountType.CHECKING),
			savings: activeAccounts.filter((a) => a.type === AccountType.SAVINGS),
			creditCards: activeAccounts.filter(
				(a) => a.type === AccountType.CREDIT_CARD,
			),
		},
		accountCount: {
			total: MOCK_ACCOUNTS.length,
			active: activeAccounts.length,
			archived: MOCK_ACCOUNTS.filter((a) => a.status === AccountStatus.ARCHIVED)
				.length,
		},
	};
};
