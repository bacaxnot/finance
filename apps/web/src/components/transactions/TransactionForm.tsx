"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { BanknoteArrowDown, BanknoteArrowUp, CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useFitText } from "@/hooks/useFitText";
import { CATEGORY_LABELS, getCategoriesForType } from "@/lib/categories";
import { cn } from "@/lib/utils";
import type { Account } from "@/mock/types";
import { TransactionType } from "@/mock/types";
import { CategoryPill } from "./CategoryPill";
import {
	type TransactionFormValues,
	transactionFormSchema,
} from "./transaction-form-schema";

interface TransactionFormProps {
	accounts: Account[];
	onSubmit: (values: TransactionFormValues) => void;
	isSubmitting?: boolean;
}

export function TransactionForm({
	accounts,
	onSubmit,
	isSubmitting = false,
}: TransactionFormProps) {
	const form = useForm<TransactionFormValues>({
		resolver: zodResolver(transactionFormSchema),
		defaultValues: {
			type: TransactionType.EXPENSE,
			date: new Date(),
			description: "",
			amount: undefined,
			category: undefined,
			accountId: accounts[0]?.id || "",
			notes: "",
		},
	});

	const transactionType = form.watch("type");
	const amount = form.watch("amount");

	const availableCategories = getCategoriesForType(transactionType);

	// Amount formatting state
	const [amountInput, setAmountInput] = useState("");
	const [isAmountFocused, setIsAmountFocused] = useState(false);

	// Fit text for amount - use formatted input for fit text
	const { ref: amountRef, scale: amountScale } = useFitText<HTMLDivElement>(
		isAmountFocused ? amountInput : amount ? formatCurrency(amount) : "",
	);

	// Format number as currency
	function formatCurrency(value: number): string {
		return new Intl.NumberFormat("en-US", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(value);
	}

	// Parse currency string to number
	function parseCurrency(value: string): number | undefined {
		const cleaned = value.replace(/[^0-9.]/g, "");
		const parsed = Number.parseFloat(cleaned);
		return Number.isNaN(parsed) ? undefined : parsed;
	}

	// Format date label
	const getDateLabel = (date: Date) => {
		const today = new Date();
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);

		// Reset time parts for comparison
		const dateOnly = new Date(
			date.getFullYear(),
			date.getMonth(),
			date.getDate(),
		);
		const todayOnly = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate(),
		);
		const yesterdayOnly = new Date(
			yesterday.getFullYear(),
			yesterday.getMonth(),
			yesterday.getDate(),
		);

		if (dateOnly.getTime() === todayOnly.getTime()) {
			return "Today";
		}
		if (dateOnly.getTime() === yesterdayOnly.getTime()) {
			return "Yesterday";
		}
		return format(date, "MMM d, yyyy");
	};

	const getAmountPrefix = () => {
		return "$";
	};

	const getAmountColor = () => {
		return "text-foreground";
	};

	const getTypeIcon = (type: TransactionType) => {
		return type === TransactionType.INCOME ? BanknoteArrowUp : BanknoteArrowDown;
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col h-full"
			>
				{/* Pills Row */}
				<div className="flex gap-2 overflow-x-auto scrollbar-none snap-x snap-mandatory pt-2 md:pt-3 mb-6 md:mb-8">
					{/* Date Picker Pill */}
					<FormField
						control={form.control}
						name="date"
						render={({ field }) => (
							<FormItem className="snap-start">
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<button
												type="button"
												className={cn(
													"px-3 py-1.5 text-xs rounded-full shrink-0 transition-all snap-start flex items-center gap-1.5",
													"bg-secondary/50 text-secondary-foreground border border-border/50 hover:bg-secondary/80",
												)}
											>
												<CalendarIcon className="size-3" />
												{getDateLabel(field.value)}
											</button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											mode="single"
											selected={field.value}
											onSelect={(date) => date && field.onChange(date)}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Account Pill */}
					<FormField
						control={form.control}
						name="accountId"
						render={({ field }) => (
							<FormItem className="snap-start">
								<Select onValueChange={field.onChange} value={field.value}>
									<FormControl>
										<SelectTrigger
											className={cn(
												"px-3 py-1.5 h-auto text-xs rounded-full shrink-0 border bg-secondary/30 hover:bg-secondary/50",
											)}
										>
											<SelectValue placeholder="Select account" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{accounts.map((account) => (
											<SelectItem key={account.id} value={account.id}>
												{account.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Type Tabs */}
					<FormField
						control={form.control}
						name="type"
						render={({ field }) => (
							<FormItem className="snap-start">
								<div className="inline-flex gap-0.5 p-0.5 bg-secondary/40 rounded-full">
									{[TransactionType.INCOME, TransactionType.EXPENSE].map(
										(type) => {
											const Icon = getTypeIcon(type);
											const isSelected = field.value === type;
											return (
												<button
													key={type}
													type="button"
													onClick={() => field.onChange(type)}
													className={cn(
														"p-2 rounded-full transition-all shrink-0",
														isSelected
															? "bg-background text-foreground shadow-sm"
															: "text-muted-foreground hover:text-foreground",
													)}
												>
													<Icon className="size-4" strokeWidth={2.5} />
												</button>
											);
										},
									)}
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* Description & Amount Group */}
				<div className="flex flex-col gap-2 mb-6 md:mb-8">
					{/* Description */}
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Textarea
										{...field}
										placeholder="Description"
										className={cn(
											"border-0 shadow-none resize-none min-h-0 p-0 focus-visible:ring-0",
											"text-4xl md:text-5xl leading-tight font-semibold placeholder:text-muted-foreground/20",
										)}
										rows={1}
										maxLength={60}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Amount */}
					<FormField
						control={form.control}
						name="amount"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<div
										ref={amountRef}
										className="flex items-baseline gap-1"
										style={{
											transform: `scale(${amountScale})`,
											transformOrigin: "left center",
										}}
									>
										<span
											className={cn(
												"text-2xl md:text-3xl leading-none font-bold whitespace-nowrap",
												getAmountColor(),
											)}
										>
											{getAmountPrefix()}
										</span>
										<Input
											type="text"
											inputMode="decimal"
											placeholder="0.00"
											value={
												isAmountFocused
													? amountInput
													: field.value
														? formatCurrency(field.value)
														: ""
											}
											onFocus={() => {
												setIsAmountFocused(true);
												setAmountInput(field.value?.toString() || "");
											}}
											onBlur={() => {
												setIsAmountFocused(false);
												const parsed = parseCurrency(amountInput);
												field.onChange(parsed);
											}}
											onChange={(e) => {
												const val = e.target.value;
												setAmountInput(val);
												// Update form value in real-time
												const parsed = parseCurrency(val);
												field.onChange(parsed);
											}}
											className={cn(
												"border-0 shadow-none p-0 h-auto focus-visible:ring-0 flex-1",
												"text-2xl md:text-3xl leading-none font-bold placeholder:text-muted-foreground/20",
												getAmountColor(),
											)}
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				{/* Categories */}
				<FormField
					control={form.control}
					name="category"
					render={({ field }) => (
						<FormItem className="space-y-3 md:space-y-4 mb-6 md:mb-8">
							<div className="flex gap-2 overflow-x-auto snap-x snap-mandatory -mt-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
								{availableCategories.map((cat) => (
									<CategoryPill
										key={cat}
										category={cat}
										label={CATEGORY_LABELS[cat]}
										selected={field.value === cat}
										onClick={() => field.onChange(cat)}
									/>
								))}
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* CTA Bar */}
				<div className="pt-6 md:pt-8 mt-auto pb-6 md:pb-8">
					<Button
						type="submit"
						size="lg"
						disabled={isSubmitting}
						className="w-full h-12 text-base font-semibold"
					>
						{isSubmitting ? "Saving..." : "Save Transaction"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
