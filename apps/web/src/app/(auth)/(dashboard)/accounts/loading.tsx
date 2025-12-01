import { AccountSkeleton } from "@/components/accounts/AccountSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

export default function AccountsLoading() {
	return (
		<div className="space-y-6">
			{/* Header Skeleton */}
			<div className="space-y-2">
				<Skeleton className="h-9 w-48" />
				<Skeleton className="h-5 w-96" />
			</div>

			{/* Controls Skeleton */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<Skeleton className="h-11 w-40" />
				<Skeleton className="h-11 w-24" />
			</div>

			{/* Mobile: Cards Loading */}
			<div className="md:hidden space-y-4">
				<AccountSkeleton variant="card" count={4} />
			</div>

			{/* Desktop: Table Loading */}
			<div className="hidden md:block">
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-12">Icon</TableHead>
								<TableHead>Name</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>Currency</TableHead>
								<TableHead className="text-right">Balance</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="w-16 text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<AccountSkeleton variant="table" count={4} />
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}
