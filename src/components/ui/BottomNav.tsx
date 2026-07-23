import { clsx } from "../../lib/utils";

export type TabId = "home" | "booking" | "dp" | "invoice" | "refund" | "thanks";

interface BottomNavProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

const ICONS: Record<TabId, JSX.Element> = {
  home: <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z" />,
  booking: <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />,
  dp: <path d="M3 6h18M3 12h18M3 18h12" />,
  invoice: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z M14 2v6h6 M8 13h8 M8 17h5" />,
  refund: <path d="M12 1v6m0 0l-3-3m3 3l3-3 M5 9a7 7 0 1 0 7 7" />,
  thanks: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
};

const LABELS: Record<TabId, string> = {
  home: "Home",
  booking: "Booking",
  dp: "DP",
  invoice: "Invoice",
  refund: "Refund",
  thanks: "Thank You",
};

const ORDER: TabId[] = ["home", "booking", "dp", "invoice", "refund", "thanks"];

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 pb-safe">
      <div className="mx-auto max-w-md px-3 pb-2">
        <div className="surface !rounded-2xl !shadow-card px-1.5 py-1.5 flex items-center justify-between">
          {ORDER.map((id) => (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={clsx(
                "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all flex-1",
                active === id ? "scale-105" : "opacity-60"
              )}
              style={active === id ? { color: "var(--c-primary-dark)" } : { color: "var(--c-text-muted)" }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill={active === id ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {ICONS[id]}
              </svg>
              <span className="text-[10px] font-medium leading-none">{LABELS[id]}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
