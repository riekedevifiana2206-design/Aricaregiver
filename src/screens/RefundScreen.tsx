import { useState } from "react";
import { Card } from "../components/ui/Card";
import { Field, TextInput, TextArea, Select } from "../components/ui/Field";
import { Button } from "../components/ui/Button";
import { PreviewModal } from "../components/ui/PreviewModal";
import { DownloadBar } from "../components/ui/DownloadBar";
import { ExportTarget } from "../components/ui/ExportTarget";
import { SignaturePad } from "../components/ui/SignaturePad";
import { usePersistentForm } from "../hooks/usePersistentForm";
import { useRecentDocs } from "../hooks/useRecentDocs";
import { useSettings } from "../context/SettingsContext";
import { Logo } from "../components/ui/Logo";
import { todayISO, formatDate, formatCurrency, generateDocNumber } from "../lib/utils";
import type { RefundData } from "../types";

const INIT: RefundData = {
  type: "Refund",
  documentNumber: generateDocNumber("RFD"),
  date: todayISO(),
  patient: "", hospital: "", reason: "", totalBill: "", refundAmount: "",
  refundMethod: "Tunai", notes: "", signature1: "", signature2: "", penanggungJawab: "",
};

const TYPES = ["Refund", "Pembatalan", "Refund + Pembatalan"];

export function RefundScreen() {
  const { theme } = useSettings();
  const [preview, setPreview] = useState(false);
  const form = usePersistentForm("refund", INIT);
  const { addDoc } = useRecentDocs();

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
        <Row k="Total Tagihan" v={formatCurrency(form.data.totalBill)} />
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
        <div className="grid grid-cols-2 gap-3">
          <Field label="Total Tagihan"><TextInput inputMode="decimal" value={form.data.totalBill} onChange={(e) => form.update("totalBill", e.target.value)} /></Field>
          <Field label="Jumlah Refund"><TextInput inputMode="decimal" value={form.data.refundAmount} onChange={(e) => form.update("refundAmount", e.target.value)} /></Field>
        </div>
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

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm border-b pb-2" style={{ borderColor: "#F1F5F9" }}>
      <span className="text-slate-500">{k}</span>
      <span className="font-medium text-right">{v || "-"}</span>
    </div>
  );
}
