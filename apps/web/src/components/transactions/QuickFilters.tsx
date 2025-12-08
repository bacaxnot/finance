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
			<SelectTrigger className="h-8 w-auto gap-1.5 rounded-lg border-0 bg-secondary px-3 text-sm font-medium text-foreground hover:bg-secondary/80 focus:ring-0 focus:ring-offset-0">
				<SelectValue />
			</SelectTrigger>
			<SelectContent align="start" className="min-w-[140px]">
				<SelectItem value="this-month">Este mes</SelectItem>
				<SelectItem value="last-month">Mes pasado</SelectItem>
				<SelectItem value="this-year">Este año</SelectItem>
				<SelectItem value="all">Todo</SelectItem>
			</SelectContent>
		</Select>
	);
}
