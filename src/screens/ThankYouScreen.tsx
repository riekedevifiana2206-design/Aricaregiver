import { useState } from "react";
import { Card } from "../components/ui/Card";
import { Field, TextInput, TextArea, Select } from "../components/ui/Field";
import { Button } from "../components/ui/Button";
import { PreviewModal } from "../components/ui/PreviewModal";
import { DownloadBar } from "../components/ui/DownloadBar";
import { ExportTarget } from "../components/ui/ExportTarget";
import { usePersistentForm } from "../hooks/usePersistentForm";
import { useRecentDocs } from "../hooks/useRecentDocs";
import { todayISO, formatDate } from "../lib/utils";
import type { ThankYouData } from "../types";

const INIT: ThankYouData = {
  recipient: "", message: "Terima kasih atas kepercayaan dan perawatan Anda.", sender: "Ari Caregiver",
  date: todayISO(), font: "Playfair Display", design: "warm", penanggungJawab: "",
};

const FONTS = ["Playfair Display", "Libre Baskerville", "Poppins"];

const PRESET_COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#EC4899", "#8B5CF6", "#06B6D4", "#1F2937"];

export function ThankYouScreen() {
  const [preview, setPreview] = useState(false);
  const form = usePersistentForm("thankYou", INIT);
  const { addDoc } = useRecentDocs();

  const previewEl = <ThankYouCard data={form.data} />;

  return (
    <div className="space-y-4 animate-fade-in">
      <Card className="space-y-3">
        <Field label="Penerima"><TextInput value={form.data.recipient} onChange={(e) => form.update("recipient", e.target.value)} placeholder="Untuk..." /></Field>
        <Field label="Pesan"><TextArea rows={4} value={form.data.message} onChange={(e) => form.update("message", e.target.value)} /></Field>
        <Field label="Pengirim"><TextInput value={form.data.sender} onChange={(e) => form.update("sender", e.target.value)} /></Field>
        <Field label="Tanggal"><TextInput type="date" value={form.data.date} onChange={(e) => form.update("date", e.target.value)} /></Field>
        <Field label="Font">
          <Select value={form.data.font} onChange={(e) => form.update("font", e.target.value)}>
            {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
          </Select>
        </Field>
        <Field label="Warna Kartu">
          <div className="flex flex-wrap items-center gap-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => form.update("design", c as any)}
                className="w-8 h-8 rounded-full border-2 transition-transform"
                style={{
                  backgroundColor: c,
                  borderColor: form.data.design === c ? "var(--c-text)" : "transparent",
                  transform: form.data.design === c ? "scale(1.15)" : "scale(1)",
                }}
              />
            ))}
            <input
              type="color"
              value={form.data.design.startsWith("#") ? form.data.design : "#10B981"}
              onChange={(e) => form.update("design", e.target.value as any)}
              className="w-8 h-8 rounded-full border-2 cursor-pointer"
              style={{ borderColor: "var(--c-border)" }}
            />
          </div>
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

function ThankYouCard({ data }: { data: ThankYouData }) {
  const color = data.design.startsWith("#") ? data.design : "#10B981";
  return (
    <div className="bg-white p-8 rounded-2xl text-center" style={{ fontFamily: data.font }}>
      <div className="w-16 h-1 rounded-full mx-auto mb-5" style={{ backgroundColor: color }} />
      <p className="text-sm uppercase tracking-widest mb-4 font-semibold" style={{ color }}>Terima Kasih</p>
      <p className="text-2xl font-semibold mb-4 text-slate-800">{data.recipient ? `Untuk ${data.recipient},` : "Untuk Anda,"}</p>
      <p className="text-lg leading-relaxed mb-6 text-slate-600">{data.message}</p>
      <div className="pt-4 border-t mx-auto max-w-[200px]" style={{ borderColor: "#F1F5F9" }}>
        <p className="text-lg font-semibold" style={{ color }}>{data.sender}</p>
        <p className="text-sm mt-1 text-slate-400">{formatDate(data.date)}</p>
      </div>
      {data.penanggungJawab && (
        <div className="mt-4">
          <p className="text-xs text-slate-400">Penanggung Jawab</p>
          <p className="text-sm font-medium text-slate-600">{data.penanggungJawab}</p>
        </div>
      )}
    </div>
  );
}
