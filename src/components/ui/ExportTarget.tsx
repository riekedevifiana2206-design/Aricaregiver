import type { ReactNode } from "react";

interface ExportTargetProps {
  id: string;
  children: ReactNode;
}

export function ExportTarget({ id, children }: ExportTargetProps) {
  return (
    <div
      id={id}
      aria-hidden="true"
      style={{
        position: "fixed",
        left: "-10000px",
        top: 0,
        width: "390px",
        pointerEvents: "none",
        opacity: 1,
      }}
    >
      {children}
    </div>
  );
}
