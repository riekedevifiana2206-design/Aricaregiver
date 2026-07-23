import type { ReactNode } from "react";

interface SectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function Section({ title, children, className }: SectionProps) {
  return (
    <section className={className}>
      <h2 className="px-1 mb-2 text-sm font-semibold" style={{ color: "var(--c-text-muted)" }}>{title}</h2>
      {children}
    </section>
  );
}
