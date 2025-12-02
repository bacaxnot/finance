"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface QuickFiltersProps {
	onPeriodChange?: (period: string) => void;
	value?: string;
}

export function QuickFilters({ onPeriodChange, value = "this-month" }: QuickFiltersProps) {
	return (
		<Select value={value} onValueChange={onPeriodChange}>
			<SelectTrigger className="h-9 w-auto gap-1 rounded-full border-border bg-muted/50 px-3 text-sm">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="this-month">Este mes</SelectItem>
				<SelectItem value="last-month">Mes pasado</SelectItem>
				<SelectItem value="this-year">Este año</SelectItem>
				<SelectItem value="all">Todo</SelectItem>
			</SelectContent>
		</Select>
	);
}
