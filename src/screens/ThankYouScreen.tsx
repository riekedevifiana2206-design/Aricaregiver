import { useState } from "react";
import { Card } from "../components/ui/Card";
import { Field, TextInput, TextArea, Select } from "../components/ui/Field";
import { Button } from "../components/ui/Button";
import { PreviewModal } from "../components/ui/PreviewModal";
import { DownloadBar } from "../components/ui/DownloadBar";
import { ExportTarget } from "../components/ui/ExportTarget";
import { usePersistentForm } from "../hooks/usePersistentForm";
import { useRecentDocs } from "../hooks/useRecentDocs";
import { todayISO, formatDate, clsx } from "../lib/utils";
import type { ThankYouData, ThankYouDesign } from "../types";

const INIT: ThankYouData = {
  recipient: "", message: "Terima kasih atas kepercayaan dan perawatan Anda.", sender: "Ari Caregiver",
  date: todayISO(), font: "Playfair Display", design: "warm", penanggungJawab: "",
};

const FONTS = ["Playfair Display", "Libre Baskerville", "Poppins"];

const DESIGNS: { id: ThankYouDesign; name: string; swatch: string }[] = [
  { id: "warm", name: "Hangat", swatch: "linear-gradient(135deg, #F59E0B, #EF4444, #EC4899)" },
  { id: "ocean", name: "Samudra", swatch: "linear-gradient(135deg, #06B6D4, #3B82F6, #6366F1)" },
  { id: "sunset", name: "Senja", swatch: "linear-gradient(135deg, #F97316, #EC4899, #8B5CF6)" },
  { id: "lavender", name: "Lavender", swatch: "linear-gradient(135deg, #A78BFA, #C4B5FD, #F9A8D4)" },
];

export function ThankYouScreen() {
  const [preview, setPreview] = useState(false);
  const form = usePersistentForm("thankYou", INIT);
  const { addDoc } = useRecentDocs();

  const previewEl = <ThankYouCard data={form.data} />;

  return (
    <div className="space-y-4 animate-fade-in">
      <Card className="space-y-3">
        <div>
          <span className="label">Desain Kartu</span>
          <div className="grid grid-cols-4 gap-2">
            {DESIGNS.map((d) => (
              <button
                key={d.id}
                onClick={() => form.update("design", d.id)}
                className={clsx("rounded-xl p-2 border-2 transition-all flex flex-col items-center gap-1.5", form.data.design === d.id ? "border-transparent" : "")}
                style={form.data.design === d.id ? { borderColor: "var(--c-primary)" } : { borderColor: "var(--c-border)" }}
              >
                <span className="w-full h-8 rounded-lg" style={{ background: d.swatch }} />
                <span className="text-[10px] font-medium" style={{ color: "var(--c-text-muted)" }}>{d.name}</span>
              </button>
            ))}
          </div>
        </div>
        <Field label="Penerima"><TextInput value={form.data.recipient} onChange={(e) => form.update("recipient", e.target.value)} placeholder="Untuk..." /></Field>
        <Field label="Pesan"><TextArea rows={4} value={form.data.message} onChange={(e) => form.update("message", e.target.value)} /></Field>
        <Field label="Pengirim"><TextInput value={form.data.sender} onChange={(e) => form.update("sender", e.target.value)} /></Field>
        <Field label="Tanggal"><TextInput type="date" value={form.data.date} onChange={(e) => form.update("date", e.target.value)} /></Field>
        <Field label="Font">
          <Select value={form.data.font} onChange={(e) => form.update("font", e.target.value)}>
            {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
          </Select>
        </Field>
        <Field label="Penanggung Jawab"><TextInput value={form.data.penanggungJawab} onChange={(e) => form.update("penanggungJawab", e.target.value)} placeholder="Nama penanggung jawab" /></Field>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button variant="ghost" onClick={() => setPreview(true)}>Pratinjau</Button>
          <Button onClick={() => setPreview(true)}>Buat</Button>
        </div>
        <DownloadBar targetId="thankyou-export" baseName="Kartu-Terima-Kasih" onDownloaded={() => addDoc("thank", form.data.recipient || "Terima Kasih", form.data.sender)} />
      </Card>

      <ExportTarget id="thankyou-export">{previewEl}</ExportTarget>

      <PreviewModal open={preview} onClose={() => setPreview(false)}>
        {previewEl}
      </PreviewModal>
    </div>
  );
}

const DESIGN_STYLES: Record<ThankYouDesign, { bg: string; accent: string; text: string; subtext: string; border: string; decoration: string }> = {
  warm: {
    bg: "linear-gradient(160deg, #FEF3C7 0%, #FED7AA 40%, #FECACA 100%)",
    accent: "#DC2626",
    text: "#7C2D12",
    subtext: "#9A3412",
    border: "#FCD34D",
    decoration: "☀️",
  },
  ocean: {
    bg: "linear-gradient(160deg, #CFFAFE 0%, #BFDBFE 40%, #C7D2FE 100%)",
    accent: "#2563EB",
    text: "#1E3A8A",
    subtext: "#3730A3",
    border: "#93C5FD",
    decoration: "🌊",
  },
  sunset: {
    bg: "linear-gradient(160deg, #FED7AA 0%, #FBCFE8 40%, #DDD6FE 100%)",
    accent: "#DB2777",
    text: "#831843",
    subtext: "#701A75",
    border: "#F9A8D4",
    decoration: "🌅",
  },
  lavender: {
    bg: "linear-gradient(160deg, #EDE9FE 0%, #F3E8FF 40%, #FCE7F3 100%)",
    accent: "#7C3AED",
    text: "#5B21B6",
    subtext: "#86198F",
    border: "#C4B5FD",
    decoration: "🌸",
  },
};

function ThankYouCard({ data }: { data: ThankYouData }) {
  const s = DESIGN_STYLES[data.design];
  return (
    <div
      className="p-8 rounded-2xl text-center relative overflow-hidden"
      style={{ background: s.bg, fontFamily: data.font, color: s.text }}
    >
      <div className="absolute top-0 left-0 w-32 h-32 rounded-full opacity-20" style={{ background: s.accent, filter: "blur(40px)" }} />
      <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full opacity-20" style={{ background: s.accent, filter: "blur(50px)" }} />

      <div className="relative z-10">
        <div className="text-4xl mb-3">{s.decoration}</div>
        <p className="text-sm uppercase tracking-widest mb-4 font-semibold" style={{ color: s.accent }}>Terima Kasih</p>
        <p className="text-2xl font-semibold mb-4">{data.recipient ? `Untuk ${data.recipient},` : "Untuk Anda,"}</p>
        <p className="text-lg leading-relaxed mb-6" style={{ color: s.subtext }}>{data.message}</p>
        <div className="pt-4 border-t mx-auto max-w-[200px]" style={{ borderColor: s.border }}>
          <p className="text-lg font-semibold" style={{ color: s.accent }}>{data.sender}</p>
          <p className="text-sm mt-1" style={{ color: s.subtext }}>{formatDate(data.date)}</p>
        </div>
        {data.penanggungJawab && (
          <div className="mt-4">
            <p className="text-xs" style={{ color: s.subtext }}>Penanggung Jawab</p>
            <p className="text-sm font-medium" style={{ color: s.text }}>{data.penanggungJawab}</p>
          </div>
        )}
      </div>
    </div>
  );
}
