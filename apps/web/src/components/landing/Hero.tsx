"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Unlimited accounts" },
  { label: "AI-powered" },
  { label: "Bank-level security" },
];

export function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/20 to-background -z-10" />

      <div className="container mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6 text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="flex justify-center lg:justify-start"
            >
              <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Finance
              </Badge>
            </motion.div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Take Control of Your{" "}
              <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Financial Life
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              Manage all your accounts, track every transaction, and grow your
              wealth in one beautiful app.
            </p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button size="lg" className="gap-2">
                Start Free
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="flex flex-wrap gap-4 md:gap-8 justify-center lg:justify-start pt-4"
            >
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative w-full aspect-square lg:aspect-auto lg:h-[600px]"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-primary/5 rounded-3xl blur-3xl" />
            <div className="relative w-full h-full rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-4 md:p-8">
              <div className="w-full h-full rounded-xl bg-muted/50 flex items-center justify-center">
                {/* Placeholder for hero image */}
                <div className="text-center text-muted-foreground">
                  <p className="text-sm md:text-base">Dashboard Screenshot</p>
                  <p className="text-xs mt-2">
                    public/images/landing/hero-dashboard.png
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
