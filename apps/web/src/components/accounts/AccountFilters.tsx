"use client";

import { useState } from "react";
import type { AccountFilters as Filters } from "@repo/db";
import { AccountType, AccountStatus } from "@repo/db";
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

export function AccountFilters({ filters, onFiltersChange, className }: AccountFiltersProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [localFilters, setLocalFilters] = useState<Filters>(filters);

	const activeFilterCount = [
		filters.type,
		filters.status,
		filters.search,
	].filter(Boolean).length;

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
			{/* Mobile: Sheet Trigger */}
			<div className={cn("md:hidden", className)}>
				<Sheet open={isOpen} onOpenChange={setIsOpen}>
					<SheetTrigger asChild>
						<Button
							variant="outline"
							className="h-11 min-h-[44px] gap-2"
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
					<SheetContent side="bottom" className="h-[90vh] p-4">
						<SheetHeader>
							<SheetTitle>Filters</SheetTitle>
							<SheetDescription>
								Filter accounts by type, status, or name
							</SheetDescription>
						</SheetHeader>
						<div className="mt-6 space-y-6">
							{/* Type */}
							<div className="space-y-2">
								<Label>Account Type</Label>
								<Select
									value={localFilters.type || ""}
									onValueChange={(value) =>
										setLocalFilters({ ...localFilters, type: value as any || undefined })
									}
								>
									<SelectTrigger className="h-11">
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
							<div className="space-y-2">
								<Label>Status</Label>
								<Select
									value={localFilters.status || ""}
									onValueChange={(value) =>
										setLocalFilters({ ...localFilters, status: value as any || undefined })
									}
								>
									<SelectTrigger className="h-11">
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
							<div className="space-y-2">
								<Label>Search</Label>
								<Input
									placeholder="Search by account name..."
									value={localFilters.search || ""}
									onChange={(e) =>
										setLocalFilters({ ...localFilters, search: e.target.value || undefined })
									}
									className="h-11"
								/>
							</div>

							{/* Actions */}
							<div className="flex gap-2 pt-4">
								<Button
									type="button"
									variant="outline"
									onClick={handleClear}
									className="flex-1 h-11 min-h-[44px]"
								>
									<X className="mr-2 size-4" />
									Clear
								</Button>
								<Button
									type="button"
									onClick={handleApply}
									className="flex-1 h-11 min-h-[44px]"
								>
									Apply Filters
								</Button>
							</div>
						</div>
					</SheetContent>
				</Sheet>
			</div>

			{/* Desktop: Inline Filters */}
			<div className={cn("hidden md:flex md:items-center md:gap-4", className)}>
				{/* Search */}
				<Input
					placeholder="Search accounts..."
					value={filters.search || ""}
					onChange={(e) =>
						onFiltersChange({ ...filters, search: e.target.value || undefined })
					}
					className="w-64"
				/>

				{/* Type */}
				<Select
					value={filters.type || ""}
					onValueChange={(value) =>
						onFiltersChange({ ...filters, type: value as any || undefined })
					}
				>
					<SelectTrigger className="w-40">
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
					value={filters.status || ""}
					onValueChange={(value) =>
						onFiltersChange({ ...filters, status: value as any || undefined })
					}
				>
					<SelectTrigger className="w-40">
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
					>
						<X className="mr-2 size-4" />
						Clear ({activeFilterCount})
					</Button>
				)}
			</div>
		</>
	);
}
