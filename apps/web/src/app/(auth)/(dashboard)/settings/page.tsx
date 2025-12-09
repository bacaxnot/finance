import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Settings | Finance App",
  description: "Manage your account settings and preferences",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header con Back Button */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button
            variant="ghost"
            size="icon"
            className="size-11 min-h-[44px] min-w-[44px]"
          >
            <ArrowLeft className="size-5" />
            <span className="sr-only">Back to Dashboard</span>
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        </div>
      </div>

      {/* Placeholder para configuraciones futuras */}
      <div className="text-muted-foreground text-center py-12">
        Settings coming soon...
      </div>
    </div>
  );
}
