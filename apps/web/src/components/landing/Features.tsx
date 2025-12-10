"use client";

import {
  CreditCard,
  LayoutDashboard,
  Receipt,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { FeatureCard } from "./FeatureCard";
import { SectionWrapper } from "./SectionWrapper";

const features = [
  {
    icon: LayoutDashboard,
    title: "Unified Dashboard",
    description:
      "See your complete financial picture in one place. Total assets, debts, and net worth at a glance.",
  },
  {
    icon: Wallet,
    title: "Multi-Account Tracking",
    description:
      "Connect all your accounts. Bancolombia, Nubank, Nequi, RappiCard, and more in one platform.",
  },
  {
    icon: Receipt,
    title: "Smart Transaction Feed",
    description:
      "Never lose track of a transaction. Search, filter, and categorize with intelligent tools.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Extraction",
    description:
      "Upload statements, we'll do the rest. Automatically extract transactions from bank PDFs.",
  },
  {
    icon: CreditCard,
    title: "Credit Card Management",
    description:
      "Stay on top of your credit. Track balances, due dates, and interest with ease.",
  },
  {
    icon: TrendingUp,
    title: "Loan Tracking",
    description:
      "Track money you've lent. Monitor loans with automatic interest calculations.",
  },
];

export function Features() {
  return (
    <SectionWrapper id="features" className="bg-muted/30">
      <div className="flex flex-col gap-12 md:gap-16">
        {/* Section Header */}
        <div className="flex flex-col gap-4 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Everything you need to manage your money
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Powerful features designed to give you complete control over your
            finances.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
