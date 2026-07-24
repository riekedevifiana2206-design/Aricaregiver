import { useState } from "react";
import { Card } from "../components/ui/Card";
import { Field, TextInput, TextArea, Select } from "../components/ui/Field";
import { Button } from "../components/ui/Button";
import { PreviewModal } from "../components/ui/PreviewModal";
import { DownloadBar } from "../components/ui/DownloadBar";
import { ExportTarget } from "../components/ui/ExportTarget";
import { SignaturePad } from "../components/ui/SignaturePad";
import { LineItemsEditor } from "../components/ui/LineItemsEditor";
import { usePersistentForm } from "../hooks/usePersistentForm";
import { useRecentDocs } from "../hooks/useRecentDocs";
import { useSettings } from "../context/SettingsContext";
import { InvoiceTemplate } from "./invoice/InvoiceTemplate";
import { todayISO, generateInvoiceNumber, clsx, itemsTotal, formatCurrency, uid } from "../lib/utils";
import type { InvoiceData, TemplateId } from "../types";

const INIT: InvoiceData = {
  invoiceNumber: generateInvoiceNumber(),
  date: todayISO(),
  patientName: "", hospital: "", location: "", caregiver: "",
  items: [{ id: uid(), description: "", duration: "", amount: "" }],
  dp: "", remaining: "", status: "Belum Lunas", notes: "", signature: "", penanggungJawab: "",
};

const TEMPLATES: { id: TemplateId; name: string }[] = [
  { id: "classic", name: "Klasik" },
  { id: "modern", name: "Modern" },
  { id: "professional", name: "Profesional" },
  { id: "minimal", name: "Minimalis" },
];

export function InvoiceScreen() {
  const { templateId, setTemplateId } = useSettings();
  const [preview, setPreview] = useState(false);
  const form = usePersistentForm("invoice", INIT);
  const { addDoc } = useRecentDocs();

  const total = itemsTotal(form.data.items);
  const dp = parseFloat((form.data.dp || "").replace(/[^\d.-]/g, "")) || 0;
  const remaining = Math.max(total - dp, 0);
  const previewData = { ...form.data, remaining: String(remaining) };

  return (
    <div className="space-y-4 animate-fade-in">
      <Card className="space-y-3">
        <div>
          <span className="label">Template Invoice</span>
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
          <Field label="Nomor Invoice"><TextInput value={form.data.invoiceNumber} onChange={(e) => form.update("invoiceNumber", e.target.value)} /></Field>
          <Field label="Tanggal"><TextInput type="date" value={form.data.date} onChange={(e) => form.update("date", e.target.value)} /></Field>
        </div>
        <Field label="Nama Pasien"><TextInput value={form.data.patientName} onChange={(e) => form.update("patientName", e.target.value)} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Rumah Sakit"><TextInput value={form.data.hospital} onChange={(e) => form.update("hospital", e.target.value)} /></Field>
          <Field label="Lokasi"><TextInput value={form.data.location} onChange={(e) => form.update("location", e.target.value)} /></Field>
        </div>
        <Field label="Caregiver"><TextInput value={form.data.caregiver} onChange={(e) => form.update("caregiver", e.target.value)} /></Field>

        <div>
          <span className="label">Daftar Layanan & Tagihan</span>
          <LineItemsEditor items={form.data.items} onChange={(items) => form.update("items", items)} />
        </div>

        <Field label="DP (Down Payment)"><TextInput inputMode="decimal" value={form.data.dp} onChange={(e) => form.update("dp", e.target.value)} placeholder="0" /></Field>
        <div className="p-3 rounded-xl flex items-center justify-between" style={{ background: "color-mix(in srgb, var(--c-primary) 10%, transparent)" }}>
          <span className="text-sm font-medium">Sisa Pembayaran</span>
          <span className="text-lg font-bold" style={{ color: "var(--c-primary-dark)" }}>{formatCurrency(String(remaining))}</span>
        </div>
        <Field label="Status Pembayaran">
          <Select value={form.data.status} onChange={(e) => form.update("status", e.target.value)}>
            <option>Belum Lunas</option><option>DP Dibayar</option><option>Lunas</option><option>Pending</option>
          </Select>
        </Field>
        <Field label="Catatan"><TextArea value={form.data.notes} onChange={(e) => form.update("notes", e.target.value)} /></Field>
        <SignaturePad label="Tanda Tangan Digital" value={form.data.signature} onChange={(v) => form.update("signature", v)} />
        <Field label="Penanggung Jawab"><TextInput value={form.data.penanggungJawab} onChange={(e) => form.update("penanggungJawab", e.target.value)} placeholder="Nama penanggung jawab" /></Field>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button variant="ghost" onClick={() => setPreview(true)}>Pratinjau</Button>
          <Button onClick={() => setPreview(true)}>Buat</Button>
        </div>
        <DownloadBar targetId="invoice-export" baseName={form.data.invoiceNumber || "Invoice"} onDownloaded={() => addDoc("invoice", form.data.invoiceNumber, form.data.patientName)} />
      </Card>

      <ExportTarget id="invoice-export">
        <InvoiceTemplate data={previewData} template={templateId} />
      </ExportTarget>

      <PreviewModal open={preview} onClose={() => setPreview(false)}>
        <InvoiceTemplate data={previewData} template={templateId} />
      </PreviewModal>
    </div>
  );
}
