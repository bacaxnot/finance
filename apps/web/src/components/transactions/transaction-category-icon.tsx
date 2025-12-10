import type { TransactionCategory } from "@/mock/types";

interface TransactionCategoryIconProps {
  category: TransactionCategory;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-2xl",
};

export function TransactionCategoryIcon({
  category,
  size = "md",
}: TransactionCategoryIconProps) {
  const className = sizeClasses[size];

  const emojiMap: Record<TransactionCategory, string> = {
    // Income categories
    salary: "💰",
    freelance: "💼",
    investment: "📈",
    refund: "↩️",
    other_income: "💵",

    // Expense categories
    groceries: "🛒",
    dining: "🍽️",
    transportation: "🚗",
    utilities: "⚡",
    rent: "🏠",
    healthcare: "❤️",
    entertainment: "🎬",
    shopping: "🛍️",
    education: "🎓",
    travel: "✈️",
    insurance: "🛡️",
    other_expense: "🧾",

    // Transfer category
    transfer: "🔄",
  };

  return (
    <span className={className} role="img" aria-label={category}>
      {emojiMap[category] || "💵"}
    </span>
  );
}
