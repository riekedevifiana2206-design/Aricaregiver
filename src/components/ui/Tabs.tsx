import { clsx } from "../../lib/utils";

interface TabsProps<T extends string> {
  tabs: { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
}

export function Tabs<T extends string>({ tabs, active, onChange }: TabsProps<T>) {
  return (
    <div className="flex gap-1 p-1 surface !rounded-2xl">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={clsx(
            "flex-1 py-2 rounded-xl text-sm font-medium transition-all",
            active === t.id ? "text-white" : ""
          )}
          style={active === t.id ? { backgroundColor: "var(--c-primary)" } : { color: "var(--c-text-muted)" }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
