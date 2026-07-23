import { useState } from "react";
import { Card } from "../components/ui/Card";
import { Field, TextInput, TextArea, Select } from "../components/ui/Field";
import { Button } from "../components/ui/Button";
import { PreviewModal } from "../components/ui/PreviewModal";
import { DownloadBar } from "../components/ui/DownloadBar";
import { usePersistentForm } from "../hooks/usePersistentForm";
import { useRecentDocs } from "../hooks/useRecentDocs";
import { todayISO, formatDate } from "../lib/utils";
import type { ThankYouData } from "../types";

const INIT: ThankYouData = {
  recipient: "", message: "Thank you for your trust and care.", sender: "Ari Caregiver",
  date: todayISO(), font: "Playfair Display", color: "#10B981",
};

const FONTS = ["Playfair Display", "Libre Baskerville", "Poppins"];

export function ThankYouScreen() {
  const [preview, setPreview] = useState(false);
  const form = usePersistentForm("thankYou", INIT);
  const { addDoc } = useRecentDocs();

  return (
    <div className="space-y-4 animate-fade-in">
      <Card className="space-y-3">
        <Field label="Recipient"><TextInput value={form.data.recipient} onChange={(e) => form.update("recipient", e.target.value)} placeholder="Dear..." /></Field>
        <Field label="Message"><TextArea rows={4} value={form.data.message} onChange={(e) => form.update("message", e.target.value)} /></Field>
        <Field label="Sender"><TextInput value={form.data.sender} onChange={(e) => form.update("sender", e.target.value)} /></Field>
        <Field label="Date"><TextInput type="date" value={form.data.date} onChange={(e) => form.update("date", e.target.value)} /></Field>
        <Field label="Font">
          <Select value={form.data.font} onChange={(e) => form.update("font", e.target.value)}>
            {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
          </Select>
        </Field>
        <Field label="Color">
          <div className="flex items-center gap-2">
            <input type="color" value={form.data.color} onChange={(e) => form.update("color", e.target.value)} className="h-10 w-14 rounded-lg border" style={{ borderColor: "var(--c-border)" }} />
            <TextInput value={form.data.color} onChange={(e) => form.update("color", e.target.value)} className="flex-1" />
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button variant="ghost" onClick={() => setPreview(true)}>Preview</Button>
          <Button onClick={() => setPreview(true)}>Generate</Button>
        </div>
        <DownloadBar targetId="thankyou-preview" baseName="Thank-You-Card" onDownloaded={() => addDoc("thank", form.data.recipient || "Thank You", form.data.sender)} />
      </Card>

      <PreviewModal open={preview} onClose={() => setPreview(false)}>
        <div id="thankyou-preview" className="bg-white p-8 rounded-2xl text-center" style={{ fontFamily: form.data.font }}>
          <p className="text-sm uppercase tracking-widest mb-4" style={{ color: form.data.color }}>Thank You</p>
          <p className="text-2xl font-semibold mb-4 text-slate-900">{form.data.recipient ? `Dear ${form.data.recipient},` : "Dear Friend,"}</p>
          <p className="text-lg leading-relaxed text-slate-700 mb-6">{form.data.message}</p>
          <div className="pt-4 border-t" style={{ borderColor: "#F1F5F9" }}>
            <p className="text-lg font-semibold" style={{ color: form.data.color }}>{form.data.sender}</p>
            <p className="text-sm text-slate-500 mt-1">{formatDate(form.data.date)}</p>
          </div>
        </div>
      </PreviewModal>
    </div>
  );
}
