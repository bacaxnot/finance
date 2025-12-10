"use client";

import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AccountDetailHeaderProps {
  accountName: string;
  onSettingsClick?: () => void;
}

export function AccountDetailHeader({
  accountName,
  onSettingsClick,
}: AccountDetailHeaderProps) {
  return (
    <header className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">Total</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onSettingsClick}
        className="size-11 min-h-[44px] min-w-[44px] shrink-0"
        aria-label="Settings"
      >
        <Settings2 className="size-5" />
      </Button>
    </header>
  );
}
