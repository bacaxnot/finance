"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionWrapper } from "./SectionWrapper";

export function CTA() {
	return (
		<SectionWrapper className="relative overflow-hidden">
			{/* Background gradient */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 -z-10" />
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent -z-10" />

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6 }}
				className="flex flex-col gap-8 items-center text-center max-w-4xl mx-auto relative"
			>
				{/* Content */}
				<div className="flex flex-col gap-4">
					<h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
						Ready to take control?
					</h2>
					<p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
						Join thousands managing their finances smarter. Start your journey
						to financial freedom today.
					</p>
				</div>

				{/* CTAs */}
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true }}
					transition={{ delay: 0.2, duration: 0.4 }}
					className="flex flex-col sm:flex-row gap-4"
				>
					<Button size="lg" className="gap-2 px-8">
						Get Started Free
						<ArrowRight className="w-4 h-4" />
					</Button>
					<Button size="lg" variant="outline" className="px-8">
						Schedule a Demo
					</Button>
				</motion.div>

				{/* Trust indicators */}
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ delay: 0.4, duration: 0.4 }}
					className="flex flex-wrap gap-6 justify-center text-sm text-muted-foreground pt-4"
				>
					<div className="flex items-center gap-2">
						<div className="w-1.5 h-1.5 rounded-full bg-primary" />
						<span>No credit card required</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-1.5 h-1.5 rounded-full bg-primary" />
						<span>Free forever plan</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-1.5 h-1.5 rounded-full bg-primary" />
						<span>Cancel anytime</span>
					</div>
				</motion.div>
			</motion.div>
		</SectionWrapper>
	);
}
