"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { LineChart, Link as LinkIcon, UserPlus } from "lucide-react";
import { SectionWrapper } from "./SectionWrapper";

const steps = [
	{
		icon: UserPlus,
		title: "Sign Up",
		subtitle: "Create your free account",
		description: "Secure authentication with email or SSO",
		step: "01",
	},
	{
		icon: LinkIcon,
		title: "Connect Accounts",
		subtitle: "Add your bank accounts and cards",
		description: "Upload statements or add transactions manually",
		step: "02",
	},
	{
		icon: LineChart,
		title: "Take Control",
		subtitle: "Track, analyze, and optimize",
		description: "Get insights and grow your wealth",
		step: "03",
	},
];

export function HowItWorks() {
	return (
		<SectionWrapper id="how-it-works">
			<div className="flex flex-col gap-12 md:gap-16">
				{/* Section Header */}
				<div className="flex flex-col gap-4 text-center max-w-3xl mx-auto">
					<h2 className="text-4xl md:text-5xl font-bold tracking-tight">
						Get started in minutes
					</h2>
					<p className="text-lg md:text-xl text-muted-foreground">
						Simple steps to take control of your financial future.
					</p>
				</div>

				{/* Steps - Mobile: Vertical, Desktop: Horizontal */}
				<div className="relative">
					{/* Connecting line - Desktop */}
					<div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-border">
						<div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
						{steps.map((step, index) => (
							<motion.div
								key={step.title}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.2, duration: 0.5 }}
								className="relative"
							>
								<Card className="p-8 h-full border-border hover:border-foreground/20 transition-all duration-300 relative">
									{/* Step number */}
									<div className="absolute -top-4 left-8 bg-background px-4">
										<span className="text-6xl font-bold text-muted-foreground/20">
											{step.step}
										</span>
									</div>

									<div className="flex flex-col gap-6 relative z-10">
										{/* Icon */}
										<div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center">
											<step.icon className="w-7 h-7 text-primary-foreground" />
										</div>

										{/* Content */}
										<div className="flex flex-col gap-2">
											<h3 className="text-2xl font-bold">{step.title}</h3>
											<p className="text-foreground font-medium">
												{step.subtitle}
											</p>
											<p className="text-muted-foreground text-sm">
												{step.description}
											</p>
										</div>
									</div>
								</Card>

								{/* Arrow connector - Mobile */}
								{index < steps.length - 1 && (
									<div className="lg:hidden flex justify-center py-4">
										<div className="w-0.5 h-8 bg-border" />
									</div>
								)}
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</SectionWrapper>
	);
}
