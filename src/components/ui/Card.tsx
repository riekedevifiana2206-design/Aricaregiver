import type { ReactNode } from "react";
import { clsx } from "../../lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx("surface p-5", onClick && "cursor-pointer active:scale-[0.99]", className)}
    >
      {children}
    </div>
  );
}
