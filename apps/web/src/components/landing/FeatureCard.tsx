"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
	icon: LucideIcon;
	title: string;
	description: string;
	index?: number;
}

export function FeatureCard({
	icon: Icon,
	title,
	description,
	index = 0,
}: FeatureCardProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ delay: index * 0.1, duration: 0.5 }}
			whileHover={{ y: -5, transition: { duration: 0.2 } }}
		>
			<Card className="group p-6 md:p-8 h-full border-border hover:border-foreground/20 transition-all duration-300">
				<div className="flex flex-col gap-4">
					{/* Icon */}
					<div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
						<Icon className="w-6 h-6 md:w-7 md:h-7 text-foreground" />
					</div>

					{/* Content */}
					<div className="flex flex-col gap-2">
						<h3 className="text-xl font-semibold">{title}</h3>
						<p className="text-muted-foreground text-sm md:text-base leading-relaxed">
							{description}
						</p>
					</div>
				</div>
			</Card>
		</motion.div>
	);
}
