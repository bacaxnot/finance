import type { Metadata } from "next";
import Link from "next/link";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConsolidatedView } from "@/components/accounts/ConsolidatedView";

export const metadata: Metadata = {
	title: "Dashboard | Finance App",
	description: "Your financial overview",
};

export default function DashboardPage() {
	return (
		<div className="space-y-2">
			{/* Header with App Title and Settings */}
			<header className="flex items-center justify-between">
				<h1 className="text-2xl font-bold tracking-tight md:text-3xl">Finance</h1>
				<Link href="/settings">
					<Button variant="ghost" size="icon" className="size-11 min-h-[44px] min-w-[44px]">
						<Settings className="size-5" />
						<span className="sr-only">Settings</span>
					</Button>
				</Link>
			</header>

			{/* Consolidated View */}
			<ConsolidatedView />

			{/* Placeholder para futuros widgets */}
			<div className="text-muted-foreground text-center py-12">
				More dashboard widgets coming soon...
			</div>
		</div>
	);
}
