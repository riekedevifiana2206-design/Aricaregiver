import type { LineItem } from "../../types";
import { uid, formatCurrency } from "../../lib/utils";

interface LineItemsEditorProps {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
  showAmount?: boolean;
  showDuration?: boolean;
  descriptionLabel?: string;
}

export function LineItemsEditor({
  items,
  onChange,
  showAmount = true,
  showDuration = true,
  descriptionLabel = "Layanan",
}: LineItemsEditorProps) {
  const add = () => {
    onChange([...items, { id: uid(), description: "", duration: "", amount: "" }]);
  };

  const remove = (id: string) => {
    onChange(items.filter((it) => it.id !== id));
  };

  const update = (id: string, field: keyof Omit<LineItem, "id">, value: string) => {
    onChange(items.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  };

  const total = items.reduce((sum, it) => sum + (parseFloat((it.amount || "").replace(/[^\d.-]/g, "")) || 0), 0);

  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={item.id} className="rounded-xl p-3 space-y-2" style={{ background: "color-mix(in srgb, var(--c-primary) 6%, transparent)" }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold" style={{ color: "var(--c-text-muted)" }}>Item {idx + 1}</span>
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => remove(item.id)}
                className="text-xs font-medium px-2 py-1 rounded-lg transition-colors"
                style={{ color: "#DC2626", background: "color-mix(in srgb, #DC2626 10%, transparent)" }}
              >
                Hapus
              </button>
            )}
          </div>
          <input
            type="text"
            value={item.description}
            onChange={(e) => update(item.id, "description", e.target.value)}
            placeholder={descriptionLabel}
            className="input"
          />
          <div className="grid grid-cols-2 gap-2">
            {showDuration && (
              <input
                type="text"
                value={item.duration}
                onChange={(e) => update(item.id, "duration", e.target.value)}
                placeholder="Durasi"
                className="input"
              />
            )}
            {showAmount && (
              <input
                type="text"
                inputMode="decimal"
                value={item.amount}
                onChange={(e) => update(item.id, "amount", e.target.value)}
                placeholder="Tagihan"
                className="input"
              />
            )}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="w-full py-2.5 rounded-xl text-sm font-medium border-2 border-dashed transition-colors"
        style={{ borderColor: "var(--c-border)", color: "var(--c-primary-dark)" }}
      >
        + Tambah {descriptionLabel}
      </button>
      {showAmount && total > 0 && (
        <div className="flex justify-between items-center px-1 pt-1">
          <span className="text-sm font-medium" style={{ color: "var(--c-text-muted)" }}>Total Tagihan</span>
          <span className="text-lg font-bold" style={{ color: "var(--c-primary-dark)" }}>{formatCurrency(String(total))}</span>
        </div>
      )}
    </div>
  );
}
