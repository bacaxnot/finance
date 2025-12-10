"use client";

import { cn } from "@/lib/utils";
import type { TransactionCategory } from "@/mock/types";
import { TransactionCategoryIcon } from "./TransactionCategoryIcon";

interface CategoryPillProps {
  category: TransactionCategory;
  label: string;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export function CategoryPill({
  category,
  label,
  selected = false,
  onClick,
  disabled = false,
}: CategoryPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 shrink-0 snap-start",
        "active:scale-95",
        selected
          ? "bg-primary text-primary-foreground shadow-sm"
          : "bg-secondary/50 text-foreground border border-border/50 hover:bg-secondary/80 hover:border-border",
        disabled && "opacity-50 cursor-not-allowed",
      )}
    >
      <TransactionCategoryIcon category={category} size="sm" />
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

/**
 * Container for horizontal scrolling category pills
 */
export function CategoryPillList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex gap-2 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2",
        "-mx-4 px-4 md:mx-0 md:px-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
