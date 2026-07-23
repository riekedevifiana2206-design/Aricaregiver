import type { ReactNode } from "react";

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function PreviewModal({ open, onClose, children }: PreviewModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/40 animate-fade-in" onClick={onClose}>
      <div
        className="surface !rounded-t-3xl sm:!rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto animate-slide-up sm:animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--c-border)", background: "var(--c-surface)" }}>
          <span className="font-semibold">Pratinjau</span>
          <button onClick={onClose} className="p-1.5 rounded-full" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
