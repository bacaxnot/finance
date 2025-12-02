interface TransactionSkeletonProps {
	variant: "card" | "table";
	count?: number;
}

export function TransactionSkeleton({
	variant,
	count = 3,
}: TransactionSkeletonProps) {
	if (variant === "card") {
		return (
			<>
				{Array.from({ length: count }).map((_, i) => (
					<div
						key={i}
						className="relative min-h-[88px] border-b border-border py-4 pl-5 pr-4"
					>
						{/* Color bar */}
						<div className="absolute left-0 top-0 bottom-0 w-1 bg-muted animate-pulse" />

						<div className="flex items-center gap-3">
							{/* Icon */}
							<div className="flex size-10 items-center justify-center rounded-full bg-muted animate-pulse" />

							{/* Content */}
							<div className="flex-1 space-y-2">
								<div className="h-5 w-32 bg-muted animate-pulse rounded" />
								<div className="h-4 w-24 bg-muted animate-pulse rounded" />
							</div>

							{/* Amount */}
							<div className="h-6 w-20 bg-muted animate-pulse rounded" />
						</div>
					</div>
				))}
			</>
		);
	}

	// Table variant
	return (
		<>
			{Array.from({ length: count }).map((_, i) => (
				<tr key={i}>
					<td className="h-12 px-4">
						<div className="h-4 w-20 bg-muted animate-pulse rounded" />
					</td>
					<td className="h-12 px-4">
						<div className="h-4 w-32 bg-muted animate-pulse rounded" />
					</td>
					<td className="h-12 px-4">
						<div className="h-4 w-24 bg-muted animate-pulse rounded" />
					</td>
					<td className="h-12 px-4">
						<div className="h-4 w-16 bg-muted animate-pulse rounded" />
					</td>
					<td className="h-12 px-4 text-right">
						<div className="h-4 w-20 bg-muted animate-pulse rounded ml-auto" />
					</td>
					<td className="h-12 px-4">
						<div className="h-4 w-16 bg-muted animate-pulse rounded" />
					</td>
				</tr>
			))}
		</>
	);
}
