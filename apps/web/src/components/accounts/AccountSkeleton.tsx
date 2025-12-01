import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableRow, TableCell } from "@/components/ui/table";

interface AccountSkeletonProps {
	variant: "card" | "table";
	count?: number;
}

export function AccountSkeleton({
	variant,
	count = 3,
}: AccountSkeletonProps) {
	if (variant === "card") {
		return (
			<>
				{Array.from({ length: count }).map((_, i) => (
					<Card key={i}>
						<CardHeader>
							<div className="flex items-center gap-3">
								<Skeleton className="size-10 rounded-full" />
								<div className="flex-1 space-y-2">
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-3 w-24" />
								</div>
								<Skeleton className="size-8" />
							</div>
						</CardHeader>
						<CardContent>
							<div className="flex items-center justify-between">
								<Skeleton className="h-6 w-24" />
								<Skeleton className="h-5 w-16 rounded-full" />
							</div>
						</CardContent>
					</Card>
				))}
			</>
		);
	}

	return (
		<>
			{Array.from({ length: count }).map((_, i) => (
				<TableRow key={i}>
					<TableCell>
						<Skeleton className="size-5 rounded-full" />
					</TableCell>
					<TableCell>
						<Skeleton className="h-4 w-32" />
					</TableCell>
					<TableCell>
						<Skeleton className="h-4 w-20" />
					</TableCell>
					<TableCell>
						<Skeleton className="h-4 w-12" />
					</TableCell>
					<TableCell>
						<Skeleton className="h-4 w-20" />
					</TableCell>
					<TableCell>
						<Skeleton className="h-5 w-16 rounded-full" />
					</TableCell>
					<TableCell>
						<Skeleton className="h-8 w-20" />
					</TableCell>
				</TableRow>
			))}
		</>
	);
}
