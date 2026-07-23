import { useState } from "react";
import { Card } from "../components/ui/Card";
import { Field, TextInput, TextArea } from "../components/ui/Field";
import { Button } from "../components/ui/Button";
import { PreviewModal } from "../components/ui/PreviewModal";
import { DownloadBar } from "../components/ui/DownloadBar";
import { ExportTarget } from "../components/ui/ExportTarget";
import { SignaturePad } from "../components/ui/SignaturePad";
import { usePersistentForm } from "../hooks/usePersistentForm";
import { useRecentDocs } from "../hooks/useRecentDocs";
import { useSettings } from "../context/SettingsContext";
import { Logo } from "../components/ui/Logo";
import { todayISO, formatDate, formatCurrency } from "../lib/utils";
import type { DpData } from "../types";

const INIT: DpData = { totalBill: "", dpAmount: "", remaining: "", notes: "", signature: "" };

export function DpScreen() {
  const { theme } = useSettings();
  const [preview, setPreview] = useState(false);
  const form = usePersistentForm("dp", INIT);
  const { addDoc } = useRecentDocs();

  const total = parseFloat((form.data.totalBill || "").replace(/[^\d.-]/g, "")) || 0;
  const dp = parseFloat((form.data.dpAmount || "").replace(/[^\d.-]/g, "")) || 0;
  const remaining = Math.max(total - dp, 0);

  const previewData = { ...form.data, remaining: String(remaining) };

  const previewEl = (
    <div className="bg-white text-slate-900 p-6 rounded-2xl">
      <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: theme.border }}>
        <Logo size="sm" />
        <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: theme.primaryLight, color: theme.primaryDark }}>Kuitansi DP</span>
      </div>
      <h2 className="text-xl font-serif font-semibold mb-4">Kuitansi Down Payment</h2>
      <div className="space-y-2.5">
        <Row k="Tanggal" v={formatDate(todayISO())} />
        <Row k="Total Tagihan" v={formatCurrency(previewData.totalBill)} />
        <Row k="Jumlah DP" v={formatCurrency(previewData.dpAmount)} />
        <Row k="Sisa Pembayaran" v={formatCurrency(String(remaining))} />
      </div>
      {previewData.notes && <p className="mt-4 text-sm text-slate-600">{previewData.notes}</p>}
      {previewData.signature && (
        <div className="mt-4">
          <p className="text-xs text-slate-500 mb-1">Tanda Tangan</p>
          <img src={previewData.signature} alt="tanda tangan" className="h-16" />
        </div>
      )}
      <p className="mt-4 text-xs text-slate-400">Dibuat dengan Ari Caregiver Invoice</p>
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <Card className="space-y-3">
        <Field label="Total Tagihan"><TextInput inputMode="decimal" value={form.data.totalBill} onChange={(e) => form.update("totalBill", e.target.value)} placeholder="0" /></Field>
        <Field label="Jumlah DP"><TextInput inputMode="decimal" value={form.data.dpAmount} onChange={(e) => form.update("dpAmount", e.target.value)} placeholder="0" /></Field>
        <div className="p-3 rounded-xl flex items-center justify-between" style={{ background: "color-mix(in srgb, var(--c-primary) 10%, transparent)" }}>
          <span className="text-sm font-medium">Sisa Pembayaran</span>
          <span className="text-lg font-bold" style={{ color: "var(--c-primary-dark)" }}>{formatCurrency(String(remaining))}</span>
        </div>
        <Field label="Catatan"><TextArea value={form.data.notes} onChange={(e) => form.update("notes", e.target.value)} /></Field>
        <SignaturePad label="Tanda Tangan Digital" value={form.data.signature} onChange={(v) => form.update("signature", v)} />

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button variant="ghost" onClick={() => setPreview(true)}>Pratinjau</Button>
          <Button onClick={() => setPreview(true)}>Buat</Button>
        </div>
        <DownloadBar targetId="dp-export" baseName="Kuitansi-DP" onDownloaded={() => addDoc("dp", "Kuitansi DP", formatCurrency(form.data.dpAmount))} />
      </Card>

      <ExportTarget id="dp-export">{previewEl}</ExportTarget>

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
