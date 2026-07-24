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
import { Logo } from "../components/ui/Logo";
import { todayISO, formatDate, formatCurrency, generateDocNumber, itemsTotal, uid } from "../lib/utils";
import type { RefundData, LineItem } from "../types";

const INIT: RefundData = {
  type: "Refund",
  documentNumber: generateDocNumber("RFD"),
  date: todayISO(),
  patient: "", hospital: "", reason: "",
  items: [{ id: uid(), description: "", duration: "", amount: "" }],
  refundAmount: "",
  refundMethod: "Tunai", notes: "", signature1: "", signature2: "", penanggungJawab: "",
};

const TYPES = ["Refund", "Pembatalan", "Refund + Pembatalan"];

export function RefundScreen() {
  const { theme } = useSettings();
  const [preview, setPreview] = useState(false);
  const form = usePersistentForm("refund", INIT);
  const { addDoc } = useRecentDocs();

  const total = itemsTotal(form.data.items);

  const previewEl = (
    <div className="bg-white text-slate-900 p-6 rounded-2xl">
      <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: theme.border }}>
        <Logo size="sm" />
        <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: theme.primaryLight, color: theme.primaryDark }}>{form.data.type}</span>
      </div>
      <h2 className="text-xl font-serif font-semibold mb-4">Dokumen {form.data.type}</h2>
      <div className="space-y-2.5">
        <Row k="Nomor Dokumen" v={form.data.documentNumber} />
        <Row k="Tanggal" v={formatDate(form.data.date)} />
        <Row k="Pasien" v={form.data.patient} />
        <Row k="Rumah Sakit" v={form.data.hospital} />
        <Row k="Alasan" v={form.data.reason} />
      </div>
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: theme.primaryDark }}>Rincian Layanan</p>
        <ItemsList items={form.data.items} theme={theme} />
        <div className="flex justify-between items-center mt-2 px-3 py-2 rounded-xl" style={{ background: theme.primaryLight }}>
          <span className="text-sm font-semibold" style={{ color: theme.primaryDark }}>Total Tagihan</span>
          <span className="text-lg font-bold" style={{ color: theme.primaryDark }}>{formatCurrency(String(total))}</span>
        </div>
      </div>
      <div className="mt-4 space-y-2.5">
        <Row k="Jumlah Refund" v={formatCurrency(form.data.refundAmount)} />
        <Row k="Metode Refund" v={form.data.refundMethod} />
      </div>
      {form.data.notes && <p className="mt-4 text-sm text-slate-600">Catatan: {form.data.notes}</p>}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div>
          <p className="text-xs text-slate-500 mb-1">Tanda Tangan 1</p>
          {form.data.signature1 ? <img src={form.data.signature1} alt="tanda tangan 1" className="h-16" /> : <div className="h-16 border-b border-dashed border-slate-300" />}
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Tanda Tangan 2</p>
          {form.data.signature2 ? <img src={form.data.signature2} alt="tanda tangan 2" className="h-16" /> : <div className="h-16 border-b border-dashed border-slate-300" />}
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <div className="text-right">
          <p className="text-xs text-slate-500">Penanggung Jawab</p>
          <p className="text-sm font-medium">{form.data.penanggungJawab || "-"}</p>
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-400">Dibuat dengan Ari Caregiver Invoice</p>
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <Card className="space-y-3">
        <div>
          <span className="label">Jenis Refund</span>
          <div className="grid grid-cols-3 gap-2">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => form.update("type", t)}
                className="py-2 px-1 rounded-xl text-[11px] font-medium border transition-all"
                style={form.data.type === t ? { backgroundColor: "var(--c-primary)", color: "white", borderColor: "transparent" } : { borderColor: "var(--c-border)", color: "var(--c-text-muted)" }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nomor Dokumen"><TextInput value={form.data.documentNumber} onChange={(e) => form.update("documentNumber", e.target.value)} /></Field>
          <Field label="Tanggal"><TextInput type="date" value={form.data.date} onChange={(e) => form.update("date", e.target.value)} /></Field>
        </div>
        <Field label="Pasien"><TextInput value={form.data.patient} onChange={(e) => form.update("patient", e.target.value)} /></Field>
        <Field label="Rumah Sakit"><TextInput value={form.data.hospital} onChange={(e) => form.update("hospital", e.target.value)} /></Field>
        <Field label="Alasan"><TextArea value={form.data.reason} onChange={(e) => form.update("reason", e.target.value)} /></Field>
        <div>
          <span className="label">Daftar Layanan & Tagihan</span>
          <LineItemsEditor items={form.data.items} onChange={(items) => form.update("items", items)} />
        </div>
        <Field label="Jumlah Refund"><TextInput inputMode="decimal" value={form.data.refundAmount} onChange={(e) => form.update("refundAmount", e.target.value)} /></Field>
        <Field label="Metode Refund">
          <Select value={form.data.refundMethod} onChange={(e) => form.update("refundMethod", e.target.value)}>
            <option>Tunai</option><option>Transfer Bank</option><option>E-Wallet</option><option>Lainnya</option>
          </Select>
        </Field>
        <Field label="Catatan"><TextArea value={form.data.notes} onChange={(e) => form.update("notes", e.target.value)} /></Field>
        <SignaturePad label="Tanda Tangan 1 (Pasien / Keluarga)" value={form.data.signature1} onChange={(v) => form.update("signature1", v)} />
        <SignaturePad label="Tanda Tangan 2 (Caregiver / Admin)" value={form.data.signature2} onChange={(v) => form.update("signature2", v)} />
        <Field label="Penanggung Jawab"><TextInput value={form.data.penanggungJawab} onChange={(e) => form.update("penanggungJawab", e.target.value)} placeholder="Nama penanggung jawab" /></Field>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button variant="ghost" onClick={() => setPreview(true)}>Pratinjau</Button>
          <Button onClick={() => setPreview(true)}>Buat</Button>
        </div>
        <DownloadBar targetId="refund-export" baseName={form.data.documentNumber || "Refund"} onDownloaded={() => addDoc("refund", form.data.documentNumber, form.data.patient)} />
      </Card>

      <ExportTarget id="refund-export">{previewEl}</ExportTarget>

      <PreviewModal open={preview} onClose={() => setPreview(false)}>
        {previewEl}
      </PreviewModal>
    </div>
  );
}

function ItemsList({ items, theme }: { items: LineItem[]; theme: { primaryLight: string; primaryDark: string } }) {
  const hasDuration = items.some((it) => it.duration);
  return (
    <div className="rounded-xl overflow-hidden">
      <div className="grid gap-2 text-xs font-semibold uppercase px-3 py-2" style={{ background: theme.primaryLight, color: theme.primaryDark, gridTemplateColumns: hasDuration ? "1fr auto auto" : "1fr auto" }}>
        <span>Deskripsi</span>
        {hasDuration && <span>Durasi</span>}
        <span className="text-right">Jumlah</span>
      </div>
      {items.map((it, i) => (
        <div key={it.id} className="grid gap-2 text-sm px-3 py-2 border-b" style={{ borderColor: "#F1F5F9", gridTemplateColumns: hasDuration ? "1fr auto auto" : "1fr auto" }}>
          <span>{it.description || `Layanan ${i + 1}`}</span>
          {hasDuration && <span className="text-slate-500">{it.duration || "-"}</span>}
          <span className="text-right font-medium">{formatCurrency(it.amount)}</span>
        </div>
      ))}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm border-b pb-2" style={{ borderColor: "#F1F5F9" }}>
      <span className="text-slate-500">{k}</span>
      <span className="font-medium text-right">{v || "-"}</span>
    </div>
  );
}
