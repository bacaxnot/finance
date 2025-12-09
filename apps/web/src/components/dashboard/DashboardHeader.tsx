"use client";

import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function DashboardHeader() {
  return (
    <header className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">Total</p>
      </div>
      <Link href="/settings">
        <Button
          variant="ghost"
          size="icon"
          className="size-11 min-h-[44px] min-w-[44px] shrink-0"
          aria-label="Settings"
        >
          <Settings2 className="size-5" />
        </Button>
      </Link>
    </header>
  );
}
