import { useState } from "react";
import { Card } from "../components/ui/Card";
import { Field, TextInput, TextArea, Select } from "../components/ui/Field";
import { Button } from "../components/ui/Button";
import { PreviewModal } from "../components/ui/PreviewModal";
import { DownloadBar } from "../components/ui/DownloadBar";
import { SignaturePad } from "../components/ui/SignaturePad";
import { usePersistentForm } from "../hooks/usePersistentForm";
import { useRecentDocs } from "../hooks/useRecentDocs";
import { useSettings } from "../context/SettingsContext";
import { InvoiceTemplate } from "./invoice/InvoiceTemplate";
import { todayISO, formatDate, generateInvoiceNumber, clsx } from "../lib/utils";
import type { InvoiceData, TemplateId } from "../types";

const INIT: InvoiceData = {
  invoiceNumber: generateInvoiceNumber(),
  date: todayISO(),
  patientName: "", hospital: "", location: "", service: "", caregiver: "",
  duration: "", totalBill: "", dp: "", remaining: "", status: "Unpaid", notes: "", signature: "",
};

const TEMPLATES: { id: TemplateId; name: string }[] = [
  { id: "classic", name: "Classic Table" },
  { id: "modern", name: "Modern Card" },
  { id: "professional", name: "Professional" },
  { id: "minimal", name: "Minimal Elegant" },
];

export function InvoiceScreen() {
  const { templateId, setTemplateId } = useSettings();
  const [preview, setPreview] = useState(false);
  const form = usePersistentForm("invoice", INIT);
  const { addDoc } = useRecentDocs();

  const total = parseFloat((form.data.totalBill || "").replace(/[^\d.-]/g, "")) || 0;
  const dp = parseFloat((form.data.dp || "").replace(/[^\d.-]/g, "")) || 0;
  const remaining = Math.max(total - dp, 0);
  const previewData = { ...form.data, remaining: String(remaining) };

  return (
    <div className="space-y-4 animate-fade-in">
      <Card className="space-y-3">
        <div>
          <span className="label">Invoice Template</span>
          <div className="grid grid-cols-4 gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTemplateId(t.id)}
                className={clsx("py-2 px-1 rounded-xl text-[11px] font-medium border transition-all", templateId === t.id ? "text-white border-transparent" : "")}
                style={templateId === t.id ? { backgroundColor: "var(--c-primary)" } : { borderColor: "var(--c-border)", color: "var(--c-text-muted)" }}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Invoice Number"><TextInput value={form.data.invoiceNumber} onChange={(e) => form.update("invoiceNumber", e.target.value)} /></Field>
          <Field label="Date"><TextInput type="date" value={form.data.date} onChange={(e) => form.update("date", e.target.value)} /></Field>
        </div>
        <Field label="Patient Name"><TextInput value={form.data.patientName} onChange={(e) => form.update("patientName", e.target.value)} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Hospital"><TextInput value={form.data.hospital} onChange={(e) => form.update("hospital", e.target.value)} /></Field>
          <Field label="Location"><TextInput value={form.data.location} onChange={(e) => form.update("location", e.target.value)} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Service"><TextInput value={form.data.service} onChange={(e) => form.update("service", e.target.value)} /></Field>
          <Field label="Caregiver"><TextInput value={form.data.caregiver} onChange={(e) => form.update("caregiver", e.target.value)} /></Field>
        </div>
        <Field label="Duration"><TextInput value={form.data.duration} onChange={(e) => form.update("duration", e.target.value)} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Total Bill"><TextInput inputMode="decimal" value={form.data.totalBill} onChange={(e) => form.update("totalBill", e.target.value)} /></Field>
          <Field label="DP"><TextInput inputMode="decimal" value={form.data.dp} onChange={(e) => form.update("dp", e.target.value)} /></Field>
        </div>
        <div className="p-3 rounded-xl flex items-center justify-between" style={{ background: "color-mix(in srgb, var(--c-primary) 10%, transparent)" }}>
          <span className="text-sm font-medium">Remaining Payment</span>
          <span className="text-lg font-bold" style={{ color: "var(--c-primary-dark)" }}>{remaining.toLocaleString()}</span>
        </div>
        <Field label="Payment Status">
          <Select value={form.data.status} onChange={(e) => form.update("status", e.target.value)}>
            <option>Unpaid</option><option>DP Paid</option><option>Paid</option><option>Pending</option>
          </Select>
        </Field>
        <Field label="Notes"><TextArea value={form.data.notes} onChange={(e) => form.update("notes", e.target.value)} /></Field>
        <SignaturePad value={form.data.signature} onChange={(v) => form.update("signature", v)} />

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button variant="ghost" onClick={() => setPreview(true)}>Preview</Button>
          <Button onClick={() => setPreview(true)}>Generate</Button>
        </div>
        <DownloadBar targetId="invoice-preview" baseName={form.data.invoiceNumber || "Invoice"} onDownloaded={() => addDoc("invoice", form.data.invoiceNumber, form.data.patientName)} />
      </Card>

      <PreviewModal open={preview} onClose={() => setPreview(false)}>
        <div id="invoice-preview">
          <InvoiceTemplate data={previewData} template={templateId} />
        </div>
      </PreviewModal>
    </div>
  );
}
