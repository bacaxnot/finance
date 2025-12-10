import type { Metadata } from "next";
import { CTA } from "@/components/landing/c-t-a";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { Security } from "@/components/landing/security";

export const metadata: Metadata = {
  title: "Finance App - Take Control of Your Financial Life",
  description:
    "Manage all your accounts, track every transaction, and grow your wealth in one beautiful app. AI-powered finance management with bank-level security.",
  keywords: [
    "finance",
    "personal finance",
    "money management",
    "budgeting",
    "transactions",
    "banking",
  ],
  openGraph: {
    title: "Finance App - Take Control of Your Financial Life",
    description:
      "Manage all your accounts, track every transaction, and grow your wealth in one beautiful app.",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <LandingNavbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Security />
      <CTA />
      <Footer />
    </main>
  );
}
