"use client";

import type { Account } from "@repo/db";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ArchiveAccountModalProps {
	account: Account | null;
	isOpen: boolean;
	onConfirm: () => void;
	onCancel: () => void;
	isLoading?: boolean;
}

export function ArchiveAccountModal({
	account,
	isOpen,
	onConfirm,
	onCancel,
	isLoading = false,
}: ArchiveAccountModalProps) {
	if (!account) return null;

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Archive Account?</DialogTitle>
					<DialogDescription>
						Are you sure you want to archive{" "}
						<span className="font-semibold text-foreground">
							{account.name}
						</span>
						?
					</DialogDescription>
				</DialogHeader>

				<p className="text-sm text-muted-foreground">
					You can restore this account later from the archived accounts section.
				</p>

				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={onCancel}
						disabled={isLoading}
						className="h-11 min-h-[44px]"
					>
						Cancel
					</Button>
					<Button
						type="button"
						variant="destructive"
						onClick={onConfirm}
						disabled={isLoading}
						className="h-11 min-h-[44px]"
					>
						{isLoading ? "Archiving..." : "Archive"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
