export default function AccountDetailLoading() {
	return (
		<div className="space-y-6">
			{/* Header skeleton */}
			<header className="flex items-start justify-between">
				<div className="h-5 w-16 bg-muted animate-pulse rounded" />
				<div className="size-11 bg-muted animate-pulse rounded" />
			</header>

			{/* Balance skeleton */}
			<div className="space-y-4">
				<div className="h-16 w-64 bg-muted animate-pulse rounded" />
				<div className="flex items-center gap-2">
					<div className="h-10 w-32 bg-muted animate-pulse rounded-full" />
					<div className="h-10 w-32 bg-muted animate-pulse rounded-full" />
				</div>
			</div>

			{/* Quick filters skeleton */}
			<div className="flex items-center gap-2">
				<div className="h-9 w-28 bg-muted animate-pulse rounded-full" />
				<div className="h-4 w-6 bg-muted animate-pulse rounded" />
				<div className="h-9 w-36 bg-muted animate-pulse rounded-full" />
			</div>

			{/* Transactions list skeleton - Mobile */}
			<div className="md:hidden border-t border-border">
				{[1, 2, 3, 4, 5].map((i) => (
					<div key={i} className="border-b border-border py-4 pl-5 pr-4">
						<div className="flex items-center gap-3">
							<div className="size-10 bg-muted animate-pulse rounded-full" />
							<div className="flex-1 space-y-2">
								<div className="h-5 w-32 bg-muted animate-pulse rounded" />
								<div className="h-4 w-24 bg-muted animate-pulse rounded" />
							</div>
							<div className="h-6 w-20 bg-muted animate-pulse rounded" />
						</div>
					</div>
				))}
			</div>

			{/* Transactions table skeleton - Desktop */}
			<div className="hidden md:block rounded-md border">
				<table className="w-full">
					<thead className="border-b">
						<tr>
							<th className="h-12 px-4 text-left">
								<div className="h-4 w-16 bg-muted animate-pulse rounded" />
							</th>
							<th className="h-12 px-4 text-left">
								<div className="h-4 w-24 bg-muted animate-pulse rounded" />
							</th>
							<th className="h-12 px-4 text-left">
								<div className="h-4 w-20 bg-muted animate-pulse rounded" />
							</th>
							<th className="h-12 px-4 text-left">
								<div className="h-4 w-16 bg-muted animate-pulse rounded" />
							</th>
							<th className="h-12 px-4 text-right">
								<div className="h-4 w-20 bg-muted animate-pulse rounded ml-auto" />
							</th>
							<th className="h-12 px-4 text-left">
								<div className="h-4 w-16 bg-muted animate-pulse rounded" />
							</th>
						</tr>
					</thead>
					<tbody>
						{[1, 2, 3, 4, 5].map((i) => (
							<tr key={i} className="border-b">
								<td className="h-16 px-4">
									<div className="h-4 w-20 bg-muted animate-pulse rounded" />
								</td>
								<td className="h-16 px-4">
									<div className="h-4 w-32 bg-muted animate-pulse rounded" />
								</td>
								<td className="h-16 px-4">
									<div className="h-4 w-24 bg-muted animate-pulse rounded" />
								</td>
								<td className="h-16 px-4">
									<div className="h-4 w-16 bg-muted animate-pulse rounded" />
								</td>
								<td className="h-16 px-4 text-right">
									<div className="h-4 w-20 bg-muted animate-pulse rounded ml-auto" />
								</td>
								<td className="h-16 px-4">
									<div className="h-4 w-16 bg-muted animate-pulse rounded" />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
