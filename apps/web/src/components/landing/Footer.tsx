import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#" },
    { label: "Security", href: "#security" },
    { label: "Roadmap", href: "#" },
  ],
  resources: [
    { label: "Documentation", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Support", href: "#" },
    { label: "API", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
  social: [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Github, href: "#", label: "GitHub" },
  ],
};

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  F
                </span>
              </div>
              <span className="font-bold text-xl">Finance App</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm">
              Take control of your financial life. Manage all your accounts,
              track every transaction, and grow your wealth.
            </p>
            <div className="flex gap-4 pt-2">
              {footerLinks.social.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-lg border border-border hover:border-foreground/20 flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>

          {/* Product */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-sm">Product</h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-sm">Resources</h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-sm">Legal</h3>
            <ul className="flex flex-col gap-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Finance App. All rights reserved.</p>
          <p>Built with Next.js, TypeScript, and Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}
