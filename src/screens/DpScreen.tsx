import { useState } from "react";
import { Card } from "../components/ui/Card";
import { Field, TextInput, TextArea } from "../components/ui/Field";
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
import { todayISO, formatDate, formatCurrency, itemsTotal, uid } from "../lib/utils";
import type { DpData, LineItem } from "../types";

const INIT: DpData = {
  patientName: "", hospital: "", location: "", caregiver: "",
  items: [{ id: uid(), description: "", duration: "", amount: "" }],
  dpAmount: "", remaining: "", notes: "", signature: "", penanggungJawab: "",
};

export function DpScreen() {
  const { theme } = useSettings();
  const [preview, setPreview] = useState(false);
  const form = usePersistentForm("dp", INIT);
  const { addDoc } = useRecentDocs();

  const total = itemsTotal(form.data.items);
  const dp = parseFloat((form.data.dpAmount || "").replace(/[^\d.-]/g, "")) || 0;
  const remaining = Math.max(total - dp, 0);

  const previewEl = (
    <div className="bg-white text-slate-900 p-6 rounded-2xl">
      <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: theme.border }}>
        <Logo size="sm" />
        <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: theme.primaryLight, color: theme.primaryDark }}>Kuitansi DP</span>
      </div>
      <h2 className="text-xl font-serif font-semibold mb-4">Kuitansi Down Payment</h2>
      <div className="space-y-2.5">
        <Row k="Tanggal" v={formatDate(todayISO())} />
        <Row k="Nama Pasien" v={form.data.patientName} />
        <Row k="Rumah Sakit / Faskes" v={form.data.hospital} />
        <Row k="Lokasi" v={form.data.location} />
        <Row k="Caregiver" v={form.data.caregiver} />
      </div>
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: theme.primaryDark }}>Rincian Layanan</p>
        <ItemsList items={form.data.items} theme={theme} />
      </div>
      <div className="mt-4 space-y-2.5">
        <Row k="Total Tagihan" v={formatCurrency(String(total))} />
        <Row k="Jumlah DP" v={formatCurrency(form.data.dpAmount)} />
        <Row k="Sisa Pembayaran" v={formatCurrency(String(remaining))} />
      </div>
      {form.data.notes && <p className="mt-4 text-sm text-slate-600">{form.data.notes}</p>}
      {form.data.signature && (
        <div className="mt-4">
          <p className="text-xs text-slate-500 mb-1">Tanda Tangan</p>
          <img src={form.data.signature} alt="tanda tangan" className="h-16" />
        </div>
      )}
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
        <Field label="Nama Pasien"><TextInput value={form.data.patientName} onChange={(e) => form.update("patientName", e.target.value)} placeholder="Nama pasien" /></Field>
        <Field label="Rumah Sakit / Faskes"><TextInput value={form.data.hospital} onChange={(e) => form.update("hospital", e.target.value)} placeholder="Rumah sakit / faskes" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Lokasi"><TextInput value={form.data.location} onChange={(e) => form.update("location", e.target.value)} placeholder="Lokasi" /></Field>
          <Field label="Caregiver"><TextInput value={form.data.caregiver} onChange={(e) => form.update("caregiver", e.target.value)} placeholder="Nama caregiver" /></Field>
        </div>
        <div>
          <span className="label">Daftar Layanan & Tagihan</span>
          <LineItemsEditor items={form.data.items} onChange={(items) => form.update("items", items)} />
        </div>
        <Field label="Jumlah DP"><TextInput inputMode="decimal" value={form.data.dpAmount} onChange={(e) => form.update("dpAmount", e.target.value)} placeholder="0" /></Field>
        <div className="p-3 rounded-xl flex items-center justify-between" style={{ background: "color-mix(in srgb, var(--c-primary) 10%, transparent)" }}>
          <span className="text-sm font-medium">Sisa Pembayaran</span>
          <span className="text-lg font-bold" style={{ color: "var(--c-primary-dark)" }}>{formatCurrency(String(remaining))}</span>
        </div>
        <Field label="Catatan"><TextArea value={form.data.notes} onChange={(e) => form.update("notes", e.target.value)} /></Field>
        <SignaturePad label="Tanda Tangan Digital" value={form.data.signature} onChange={(v) => form.update("signature", v)} />
        <Field label="Penanggung Jawab"><TextInput value={form.data.penanggungJawab} onChange={(e) => form.update("penanggungJawab", e.target.value)} placeholder="Nama penanggung jawab" /></Field>

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
