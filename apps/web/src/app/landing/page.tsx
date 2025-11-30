import { CTA } from "@/components/landing/CTA";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { Security } from "@/components/landing/Security";
import type { Metadata } from "next";

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
