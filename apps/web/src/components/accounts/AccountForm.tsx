"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Account, CreateAccountInput } from "@/mock/types";
import {
	createAccountSchema,
	AccountType,
	Currency,
} from "@/mock/types";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AccountTypeIcon } from "./AccountTypeIcon";

interface AccountFormProps {
	account?: Account;
	onSuccess: (account: Account | CreateAccountInput) => void;
	onCancel: () => void;
	isLoading?: boolean;
}

const accountTypeOptions = [
	{ value: AccountType.CHECKING, label: "Checking Account" },
	{ value: AccountType.SAVINGS, label: "Savings Account" },
	{ value: AccountType.CREDIT_CARD, label: "Credit Card" },
];

const currencyOptions = [
	{ value: Currency.USD, label: "USD - US Dollar" },
	{ value: Currency.EUR, label: "EUR - Euro" },
	{ value: Currency.GBP, label: "GBP - British Pound" },
	{ value: Currency.JPY, label: "JPY - Japanese Yen" },
	{ value: Currency.CAD, label: "CAD - Canadian Dollar" },
	{ value: Currency.AUD, label: "AUD - Australian Dollar" },
	{ value: Currency.CHF, label: "CHF - Swiss Franc" },
	{ value: Currency.MXN, label: "MXN - Mexican Peso" },
];

export function AccountForm({
	account,
	onSuccess,
	onCancel,
	isLoading = false,
}: AccountFormProps) {
	const form = useForm<CreateAccountInput>({
		resolver: zodResolver(createAccountSchema),
		defaultValues: {
			name: account?.name || "",
			type: account?.type || AccountType.CHECKING,
			currency: account?.currency || Currency.USD,
			initialBalance: account?.balance || 0,
		},
	});

	const selectedType = form.watch("type");

	const onSubmit = (data: CreateAccountInput) => {
		onSuccess(data);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				{/* Account Name */}
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Account Name</FormLabel>
							<FormControl>
								<Input
									placeholder="Main Checking"
									className="h-11"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Account Type with Preview */}
				<FormField
					control={form.control}
					name="type"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Account Type</FormLabel>
							<div className="flex gap-3 items-center">
								{/* Icon Preview */}
								<div className="flex size-12 items-center justify-center rounded-lg bg-muted">
									<AccountTypeIcon type={selectedType} size="lg" />
								</div>

								{/* Select */}
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger className="h-11 flex-1">
											<SelectValue placeholder="Select account type" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{accountTypeOptions.map((option) => (
											<SelectItem key={option.value} value={option.value}>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Currency */}
				<FormField
					control={form.control}
					name="currency"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Currency</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger className="h-11">
										<SelectValue placeholder="Select currency" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{currencyOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Initial Balance */}
				<FormField
					control={form.control}
					name="initialBalance"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Initial Balance</FormLabel>
							<FormControl>
								<Input
									type="number"
									step="0.01"
									placeholder="0.00"
									className="h-11"
									{...field}
									onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Actions */}
				<div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
					<Button
						type="button"
						variant="outline"
						onClick={onCancel}
						disabled={isLoading}
						className="h-11 min-h-[44px]"
					>
						Cancel
					</Button>
					<Button
						type="submit"
						disabled={isLoading}
						className="h-11 min-h-[44px]"
					>
						{isLoading ? "Saving..." : account ? "Update Account" : "Create Account"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
