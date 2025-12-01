import {
	Wallet,
	PiggyBank,
	CreditCard,
	type LucideIcon,
} from "lucide-react";
import type { AccountType } from "@/mock/types";
import { AccountType as AccountTypeEnum } from "@/mock/types";
import { cn } from "@/lib/utils";

interface AccountTypeIconProps {
	type: AccountType;
	className?: string;
	size?: "sm" | "md" | "lg";
}

const iconMap: Record<AccountType, LucideIcon> = {
	[AccountTypeEnum.CHECKING]: Wallet,
	[AccountTypeEnum.SAVINGS]: PiggyBank,
	[AccountTypeEnum.CREDIT_CARD]: CreditCard,
};

const colorMap: Record<AccountType, string> = {
	[AccountTypeEnum.CHECKING]: "text-blue-500",
	[AccountTypeEnum.SAVINGS]: "text-green-500",
	[AccountTypeEnum.CREDIT_CARD]: "text-purple-500",
};

const sizeMap = {
	sm: "size-4",
	md: "size-5",
	lg: "size-6",
};

export function AccountTypeIcon({
	type,
	className,
	size = "md",
}: AccountTypeIconProps) {
	const Icon = iconMap[type];
	const color = colorMap[type];
	const sizeClass = sizeMap[size];

	return <Icon className={cn(color, sizeClass, className)} />;
}
