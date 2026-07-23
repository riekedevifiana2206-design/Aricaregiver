import type { ButtonHTMLAttributes, ReactNode } from "react";
import { clsx } from "../../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  children: ReactNode;
}

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(variant === "primary" ? "btn-primary" : "btn-ghost", "w-full", className)}
      {...props}
    >
      {children}
    </button>
  );
}
