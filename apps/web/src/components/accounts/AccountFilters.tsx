"use client";

import { useState, useEffect } from "react";
import type { AccountFilters as Filters } from "@/mock/types";
import { AccountType, AccountStatus } from "@/mock/types";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountFiltersProps {
	filters: Filters;
	onFiltersChange: (filters: Filters) => void;
	className?: string;
	isOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	triggerHidden?: boolean;
}

const accountTypeOptions = [
	{ value: "", label: "All Types" },
	{ value: AccountType.CHECKING, label: "Checking" },
	{ value: AccountType.SAVINGS, label: "Savings" },
	{ value: AccountType.CREDIT_CARD, label: "Credit Card" },
];

const statusOptions = [
	{ value: "", label: "All Status" },
	{ value: AccountStatus.ACTIVE, label: "Active" },
	{ value: AccountStatus.ARCHIVED, label: "Archived" },
];

export function AccountFilters({
	filters,
	onFiltersChange,
	className,
	isOpen: externalIsOpen,
	onOpenChange: externalOnOpenChange,
	triggerHidden = false,
}: AccountFiltersProps) {
	const [internalIsOpen, setInternalIsOpen] = useState(false);
	const [localFilters, setLocalFilters] = useState<Filters>(filters);

	// Use external control if provided, otherwise use internal state
	const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
	const setIsOpen = externalOnOpenChange || setInternalIsOpen;

	// Sync localFilters with external filters when they change
	useEffect(() => {
		setLocalFilters(filters);
	}, [filters]);

	const activeFilterCount = [
		filters.type,
		filters.status,
		filters.search,
	].filter(Boolean).length;

	// Normalize value: convert empty string or "all" to undefined
	const normalizeValue = (value: string): any => {
		if (value === "" || value === "all") return undefined;
		return value;
	};

	const handleApply = () => {
		onFiltersChange(localFilters);
		setIsOpen(false);
	};

	const handleClear = () => {
		const clearedFilters = { type: undefined, status: undefined, search: undefined };
		setLocalFilters(clearedFilters);
		onFiltersChange(clearedFilters);
	};

	return (
		<>
			{/* Mobile: Sheet Trigger (hidden if controlled externally) */}
			<div className={cn("md:hidden", className)}>
				<Sheet open={isOpen} onOpenChange={setIsOpen}>
					{!triggerHidden && (
						<SheetTrigger asChild>
							<Button
								variant="outline"
								className="h-11 min-h-[44px] gap-2 rounded-full px-5 shadow-sm"
							>
								<Filter className="size-4" />
								Filters
								{activeFilterCount > 0 && (
									<Badge variant="secondary" className="ml-1 size-5 p-0 flex items-center justify-center rounded-full">
										{activeFilterCount}
									</Badge>
								)}
							</Button>
						</SheetTrigger>
					)}
					<SheetContent
						side="bottom"
						className="h-[90vh] overflow-y-auto rounded-t-3xl px-5 py-6"
					>
						<SheetHeader>
							<SheetTitle>Filters</SheetTitle>
							<SheetDescription>
								Filter accounts by type, status, or name
							</SheetDescription>
						</SheetHeader>
						<div className="mt-6 flex flex-col gap-6">
							{/* Type */}
							<div className="flex flex-col gap-1.5">
								<Label className="text-sm font-medium text-muted-foreground">Account Type</Label>
								<Select
									value={localFilters.type || "all"}
									onValueChange={(value) =>
										setLocalFilters({ ...localFilters, type: normalizeValue(value) })
									}
								>
									<SelectTrigger className="h-11 rounded-xl px-4">
										<SelectValue placeholder="All Types" />
									</SelectTrigger>
									<SelectContent>
										{accountTypeOptions.map((option) => (
											<SelectItem key={option.value || "all"} value={option.value || "all"}>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Status */}
							<div className="flex flex-col gap-1.5">
								<Label className="text-sm font-medium text-muted-foreground">Status</Label>
								<Select
									value={localFilters.status || "all"}
									onValueChange={(value) =>
										setLocalFilters({ ...localFilters, status: normalizeValue(value) })
									}
								>
									<SelectTrigger className="h-11 rounded-xl px-4">
										<SelectValue placeholder="All Status" />
									</SelectTrigger>
									<SelectContent>
										{statusOptions.map((option) => (
											<SelectItem key={option.value || "all"} value={option.value || "all"}>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Search */}
							<div className="flex flex-col gap-1.5">
								<Label className="text-sm font-medium text-muted-foreground">Search</Label>
								<Input
									placeholder="Search by account name..."
									value={localFilters.search || ""}
									onChange={(e) => {
										const value = e.target.value.trim();
										setLocalFilters({ ...localFilters, search: value || undefined });
									}}
									className="h-11 rounded-xl px-4"
								/>
							</div>

							{/* Actions */}
							<div className="flex flex-col gap-3 pt-2 sm:flex-row">
								<Button
									type="button"
									variant="outline"
									onClick={handleClear}
									className="flex-1 h-11 min-h-[44px] rounded-xl"
								>
									<X className="mr-2 size-4" />
									Clear
								</Button>
								<Button
									type="button"
									onClick={handleApply}
									className="flex-1 h-11 min-h-[44px] rounded-xl"
								>
									Apply Filters
								</Button>
							</div>
						</div>
					</SheetContent>
				</Sheet>
			</div>

			{/* Desktop: Inline Filters */}
			<div
				className={cn(
					"hidden w-full flex-wrap items-center gap-3 rounded-2xl border border-border bg-card/40 px-4 py-3 shadow-sm md:flex",
					className,
				)}
			>
				{/* Search */}
				<Input
					placeholder="Search accounts..."
					value={filters.search || ""}
					onChange={(e) => {
						const value = e.target.value.trim();
						onFiltersChange({ ...filters, search: value || undefined });
					}}
					className="h-10 flex-1 min-w-[220px] rounded-xl"
				/>

				{/* Type */}
				<Select
					value={filters.type || "all"}
					onValueChange={(value) =>
						onFiltersChange({ ...filters, type: normalizeValue(value) })
					}
				>
					<SelectTrigger className="h-10 min-w-[170px] rounded-xl">
						<SelectValue placeholder="All Types" />
					</SelectTrigger>
					<SelectContent>
						{accountTypeOptions.map((option) => (
							<SelectItem key={option.value || "all"} value={option.value || "all"}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{/* Status */}
				<Select
					value={filters.status || "all"}
					onValueChange={(value) =>
						onFiltersChange({ ...filters, status: normalizeValue(value) })
					}
				>
					<SelectTrigger className="h-10 min-w-[170px] rounded-xl">
						<SelectValue placeholder="All Status" />
					</SelectTrigger>
					<SelectContent>
						{statusOptions.map((option) => (
							<SelectItem key={option.value || "all"} value={option.value || "all"}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{/* Clear button (only show if filters active) */}
				{activeFilterCount > 0 && (
					<Button
						type="button"
						variant="ghost"
						onClick={handleClear}
						size="sm"
						className="ml-auto text-muted-foreground hover:text-foreground"
					>
						<X className="mr-2 size-4" />
						Clear ({activeFilterCount})
					</Button>
				)}
			</div>
		</>
	);
}
