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
import { Logo } from "../components/ui/Logo";
import { todayISO, formatDate, formatCurrency, generateDocNumber } from "../lib/utils";
import type { RefundData } from "../types";

const INIT: RefundData = {
  type: "Refund",
  documentNumber: generateDocNumber("RFD"),
  date: todayISO(),
  patient: "", hospital: "", reason: "", totalBill: "", refundAmount: "",
  refundMethod: "Cash", notes: "", signature1: "", signature2: "",
};

const TYPES = ["Refund", "Cancellation", "Refund + Cancellation"];

export function RefundScreen() {
  const { theme } = useSettings();
  const [preview, setPreview] = useState(false);
  const form = usePersistentForm("refund", INIT);
  const { addDoc } = useRecentDocs();

  return (
    <div className="space-y-4 animate-fade-in">
      <Card className="space-y-3">
        <div>
          <span className="label">Refund Type</span>
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
          <Field label="Document Number"><TextInput value={form.data.documentNumber} onChange={(e) => form.update("documentNumber", e.target.value)} /></Field>
          <Field label="Date"><TextInput type="date" value={form.data.date} onChange={(e) => form.update("date", e.target.value)} /></Field>
        </div>
        <Field label="Patient"><TextInput value={form.data.patient} onChange={(e) => form.update("patient", e.target.value)} /></Field>
        <Field label="Hospital"><TextInput value={form.data.hospital} onChange={(e) => form.update("hospital", e.target.value)} /></Field>
        <Field label="Reason"><TextArea value={form.data.reason} onChange={(e) => form.update("reason", e.target.value)} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Total Bill"><TextInput inputMode="decimal" value={form.data.totalBill} onChange={(e) => form.update("totalBill", e.target.value)} /></Field>
          <Field label="Refund Amount"><TextInput inputMode="decimal" value={form.data.refundAmount} onChange={(e) => form.update("refundAmount", e.target.value)} /></Field>
        </div>
        <Field label="Refund Method">
          <Select value={form.data.refundMethod} onChange={(e) => form.update("refundMethod", e.target.value)}>
            <option>Cash</option><option>Bank Transfer</option><option>E-Wallet</option><option>Other</option>
          </Select>
        </Field>
        <Field label="Notes"><TextArea value={form.data.notes} onChange={(e) => form.update("notes", e.target.value)} /></Field>
        <SignaturePad label="Signature 1 (Patient / Family)" value={form.data.signature1} onChange={(v) => form.update("signature1", v)} />
        <SignaturePad label="Signature 2 (Caregiver / Admin)" value={form.data.signature2} onChange={(v) => form.update("signature2", v)} />

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button variant="ghost" onClick={() => setPreview(true)}>Preview</Button>
          <Button onClick={() => setPreview(true)}>Generate</Button>
        </div>
        <DownloadBar targetId="refund-preview" baseName={form.data.documentNumber || "Refund"} onDownloaded={() => addDoc("refund", form.data.documentNumber, form.data.patient)} />
      </Card>

      <PreviewModal open={preview} onClose={() => setPreview(false)}>
        <div id="refund-preview" className="bg-white text-slate-900 p-6 rounded-2xl">
          <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: theme.border }}>
            <Logo size="sm" />
            <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: theme.primaryLight, color: theme.primaryDark }}>{form.data.type}</span>
          </div>
          <h2 className="text-xl font-serif font-semibold mb-4">{form.data.type} Document</h2>
          <div className="space-y-2.5">
            <Row k="Document Number" v={form.data.documentNumber} />
            <Row k="Date" v={formatDate(form.data.date)} />
            <Row k="Patient" v={form.data.patient} />
            <Row k="Hospital" v={form.data.hospital} />
            <Row k="Reason" v={form.data.reason} />
            <Row k="Total Bill" v={formatCurrency(form.data.totalBill)} />
            <Row k="Refund Amount" v={formatCurrency(form.data.refundAmount)} />
            <Row k="Refund Method" v={form.data.refundMethod} />
          </div>
          {form.data.notes && <p className="mt-4 text-sm text-slate-600">Notes: {form.data.notes}</p>}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <p className="text-xs text-slate-500 mb-1">Signature 1</p>
              {form.data.signature1 ? <img src={form.data.signature1} alt="sig1" className="h-16" /> : <div className="h-16 border-b border-dashed border-slate-300" />}
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Signature 2</p>
              {form.data.signature2 ? <img src={form.data.signature2} alt="sig2" className="h-16" /> : <div className="h-16 border-b border-dashed border-slate-300" />}
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-400">Generated by Ari Caregiver Invoice</p>
        </div>
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
