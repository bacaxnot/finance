"use client";

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Eye, Shield, ShieldCheck, ShieldOff } from "lucide-react";
import { SectionWrapper } from "./SectionWrapper";

const securityFeatures = [
  {
    icon: Shield,
    title: "Bank-Level Encryption",
    description: "256-bit SSL encryption",
  },
  {
    icon: ShieldOff,
    title: "No Bank Credentials",
    description: "We never ask for your bank passwords",
  },
  {
    icon: ShieldCheck,
    title: "Secure Authentication",
    description: "Session management and auto-logout",
  },
  {
    icon: Eye,
    title: "Privacy First",
    description: "Your data is yours, always",
  },
];

export function Security() {
  return (
    <SectionWrapper id="security" className="bg-muted/30">
      <div className="flex flex-col gap-12 md:gap-16">
        {/* Section Header */}
        <div className="flex flex-col gap-4 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Your data, protected
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            We take security seriously. Your financial data is encrypted and
            never shared.
          </p>
        </div>

        {/* Security Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {securityFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
            >
              <Card className="p-6 md:p-8 h-full flex flex-col items-center text-center gap-4 border-border hover:border-foreground/20 transition-all duration-300">
                {/* Icon */}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-8 h-8 md:w-10 md:h-10 text-foreground" />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg md:text-xl font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground">
            🔒 All data is encrypted in transit and at rest
          </p>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
