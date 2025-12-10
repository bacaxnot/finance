import type { ReactNode } from "react";

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function SectionWrapper({
  children,
  className = "",
  id,
}: SectionWrapperProps) {
  return (
    <section id={id} className={`w-full py-16 md:py-24 ${className}`}>
      <div className="container mx-auto max-w-7xl px-4 md:px-8">{children}</div>
    </section>
  );
}
