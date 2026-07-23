import { Card } from "../components/ui/Card";
import { Logo } from "../components/ui/Logo";
import { useRecentDocs } from "../hooks/useRecentDocs";
import type { TabId } from "../components/ui/BottomNav";
import type { DocKind } from "../types";

interface HomeScreenProps {
  onNavigate: (tab: TabId) => void;
}

const SHORTCUTS: { tab: TabId; title: string; desc: string; icon: JSX.Element }[] = [
  {
    tab: "booking",
    title: "Buat Booking",
    desc: "Dadakan & Lengkap",
    icon: <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />,
  },
  {
    tab: "invoice",
    title: "Buat Invoice",
    desc: "4 template, 10 tema",
    icon: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z M14 2v6h6 M8 13h8 M8 17h5" />,
  },
  {
    tab: "dp",
    title: "Kalkulator DP",
    desc: "Down payment & sisa",
    icon: <path d="M3 6h18M3 12h18M3 18h12" />,
  },
  {
    tab: "refund",
    title: "Refund",
    desc: "Refund & pembatalan",
    icon: <path d="M12 1v6m0 0l-3-3m3 3l3-3 M5 9a7 7 0 1 0 7 7" />,
  },
  {
    tab: "thanks",
    title: "Kartu Terima Kasih",
    desc: "Premium & elegan",
    icon: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
  },
];

const KIND_LABEL: Record<DocKind, string> = {
  "booking-dadakan": "Booking",
  "booking-lengkap": "Booking",
  dp: "DP",
  invoice: "Invoice",
  refund: "Refund",
  thank: "Terima Kasih",
};

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { docs } = useRecentDocs();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="surface p-5 flex items-center gap-4">
        <Logo size="lg" />
      </div>

      <div>
        <h2 className="px-1 mb-2 text-sm font-semibold" style={{ color: "var(--c-text-muted)" }}>Pintasan</h2>
        <div className="grid grid-cols-2 gap-3">
          {SHORTCUTS.map((s) => (
            <Card key={s.tab} onClick={() => onNavigate(s.tab)} className="p-4 flex flex-col gap-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "color-mix(in srgb, var(--c-primary) 14%, transparent)", color: "var(--c-primary-dark)" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{s.icon}</svg>
              </div>
              <div>
                <p className="font-semibold text-sm">{s.title}</p>
                <p className="text-xs" style={{ color: "var(--c-text-muted)" }}>{s.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between px-1 mb-2">
          <h2 className="text-sm font-semibold" style={{ color: "var(--c-text-muted)" }}>Dokumen Terbaru</h2>
          {docs.length > 0 && <span className="text-xs" style={{ color: "var(--c-text-muted)" }}>{docs.length}</span>}
        </div>
        {docs.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-sm" style={{ color: "var(--c-text-muted)" }}>Belum ada dokumen. Buat booking, invoice, atau kartu untuk memulai.</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {docs.slice(0, 8).map((d) => (
              <Card key={d.id} className="p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: "color-mix(in srgb, var(--c-primary) 14%, transparent)", color: "var(--c-primary-dark)" }}>
                  {KIND_LABEL[d.kind].slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">{d.title}</p>
                  <p className="text-xs truncate" style={{ color: "var(--c-text-muted)" }}>{d.subtitle}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "color-mix(in srgb, var(--c-primary) 10%, transparent)", color: "var(--c-primary-dark)" }}>
                  {KIND_LABEL[d.kind]}
                </span>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
