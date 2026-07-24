import type { InvoiceData, TemplateId } from "../../types";
import { useSettings } from "../../context/SettingsContext";
import { Logo } from "../../components/ui/Logo";
import { formatDate, formatCurrency } from "../../lib/utils";

interface InvoiceTemplateProps {
  data: InvoiceData;
  template: TemplateId;
}

export function InvoiceTemplate({ data, template }: InvoiceTemplateProps) {
  switch (template) {
    case "classic": return <ClassicTemplate data={data} />;
    case "modern": return <ModernTemplate data={data} />;
    case "professional": return <ProfessionalTemplate data={data} />;
    case "minimal": return <MinimalTemplate data={data} />;
  }
}

function StatusBadge({ status, primary, primaryLight, primaryDark }: { status: string; primary: string; primaryLight: string; primaryDark: string }) {
  const paid = status.toLowerCase().includes("paid") || status.toLowerCase().includes("lunas");
  const pending = status.toLowerCase().includes("pending") || status.toLowerCase().includes("dp");
  const bg = paid ? "#DCFCE7" : pending ? primaryLight : "#FEF3C7";
  const color = paid ? "#166534" : pending ? primaryDark : "#92400E";
  return (
    <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: bg, color }}>
      {status || "Belum Lunas"}
    </span>
  );
}

function ClassicTemplate({ data }: { data: InvoiceData }) {
  const { theme } = useSettings();
  return (
    <div className="bg-white text-slate-900 p-6 rounded-2xl">
      <div className="flex items-center justify-between border-b-2 pb-4 mb-4" style={{ borderColor: theme.primary }}>
        <Logo size="sm" />
        <div className="text-right">
          <h2 className="text-2xl font-serif font-bold">INVOICE</h2>
          <p className="text-sm text-slate-500">{data.invoiceNumber}</p>
        </div>
      </div>
      <table className="w-full text-sm border-collapse">
        <tbody>
          {[
            ["Tanggal", formatDate(data.date)],
            ["Nama Pasien", data.patientName],
            ["Rumah Sakit", data.hospital],
            ["Lokasi", data.location],
            ["Layanan", data.service],
            ["Caregiver", data.caregiver],
            ["Durasi", data.duration],
          ].map(([k, v]) => (
            <tr key={k} className="border-b" style={{ borderColor: "#F1F5F9" }}>
              <td className="py-2 pr-4 text-slate-500 font-medium w-1/3">{k}</td>
              <td className="py-2 font-medium">{v || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <table className="w-full text-sm mt-4 border-collapse">
        <thead>
          <tr style={{ background: theme.primaryLight, color: theme.primaryDark }}>
            <th className="text-left py-2 px-3 font-semibold rounded-l-lg">Deskripsi</th>
            <th className="text-right py-2 px-3 font-semibold rounded-r-lg">Jumlah</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b" style={{ borderColor: "#F1F5F9" }}><td className="py-2 px-3">Total Tagihan</td><td className="py-2 px-3 text-right">{formatCurrency(data.totalBill)}</td></tr>
          <tr className="border-b" style={{ borderColor: "#F1F5F9" }}><td className="py-2 px-3">DP (Down Payment)</td><td className="py-2 px-3 text-right">{formatCurrency(data.dp)}</td></tr>
          <tr style={{ background: theme.primaryLight }}><td className="py-2 px-3 font-bold" style={{ color: theme.primaryDark }}>Sisa Pembayaran</td><td className="py-2 px-3 text-right font-bold" style={{ color: theme.primaryDark }}>{formatCurrency(data.remaining)}</td></tr>
        </tbody>
      </table>
      <div className="flex items-center justify-between mt-4">
        <StatusBadge status={data.status} primary={theme.primary} primaryLight={theme.primaryLight} primaryDark={theme.primaryDark} />
        <span className="text-xs text-slate-400">Ari Caregiver Invoice</span>
      </div>
      {data.notes && <p className="mt-3 text-sm text-slate-600 border-t pt-3" style={{ borderColor: "#F1F5F9" }}>Catatan: {data.notes}</p>}
      {data.signature && <div className="mt-4"><p className="text-xs text-slate-500 mb-1">Tanda Tangan Otorisasi</p><img src={data.signature} alt="tanda tangan" className="h-16" /></div>}
      <div className="flex justify-end mt-4">
        <div className="text-right">
          <p className="text-xs text-slate-500">Penanggung Jawab</p>
          <p className="text-sm font-medium">{data.penanggungJawab || "-"}</p>
        </div>
      </div>
    </div>
  );
}

function ModernTemplate({ data }: { data: InvoiceData }) {
  const { theme } = useSettings();
  return (
    <div className="bg-white text-slate-900 p-6 rounded-2xl">
      <div className="rounded-2xl p-4 mb-4" style={{ background: theme.primary }}>
        <div className="flex items-center justify-between text-white">
          <div className="bg-white rounded-xl px-3 py-1.5"><Logo size="sm" /></div>
          <div className="text-right">
            <h2 className="text-xl font-bold">INVOICE</h2>
            <p className="text-sm opacity-90">{data.invoiceNumber}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          ["Tanggal", formatDate(data.date)],
          ["Pasien", data.patientName],
          ["Rumah Sakit", data.hospital],
          ["Lokasi", data.location],
          ["Layanan", data.service],
          ["Caregiver", data.caregiver],
          ["Durasi", data.duration],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl p-3" style={{ background: "#F8FAFC" }}>
            <p className="text-xs text-slate-500">{k}</p>
            <p className="text-sm font-medium">{v || "-"}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl p-4 space-y-2" style={{ background: theme.primaryLight }}>
        <div className="flex justify-between text-sm"><span className="text-slate-600">Total Tagihan</span><span className="font-medium">{formatCurrency(data.totalBill)}</span></div>
        <div className="flex justify-between text-sm"><span className="text-slate-600">DP</span><span className="font-medium">{formatCurrency(data.dp)}</span></div>
        <div className="flex justify-between text-base pt-2 border-t" style={{ borderColor: theme.primaryLight }}>
          <span className="font-bold" style={{ color: theme.primaryDark }}>Sisa</span>
          <span className="font-bold" style={{ color: theme.primaryDark }}>{formatCurrency(data.remaining)}</span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <StatusBadge status={data.status} primary={theme.primary} primaryLight={theme.primaryLight} primaryDark={theme.primaryDark} />
        {data.signature && <img src={data.signature} alt="tanda tangan" className="h-14" />}
      </div>
      {data.notes && <p className="mt-3 text-sm text-slate-600">{data.notes}</p>}
      <div className="flex justify-end mt-4">
        <div className="text-right">
          <p className="text-xs text-slate-500">Penanggung Jawab</p>
          <p className="text-sm font-medium">{data.penanggungJawab || "-"}</p>
        </div>
      </div>
    </div>
  );
}

function ProfessionalTemplate({ data }: { data: InvoiceData }) {
  const { theme } = useSettings();
  return (
    <div className="bg-white text-slate-900 p-6 rounded-2xl">
      <div className="border-b pb-4 mb-4" style={{ borderColor: theme.border }}>
        <div className="flex items-center justify-between">
          <Logo size="md" />
          <StatusBadge status={data.status} primary={theme.primary} primaryLight={theme.primaryLight} primaryDark={theme.primaryDark} />
        </div>
      </div>
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Invoice</p>
          <h2 className="text-2xl font-serif font-bold">{data.invoiceNumber}</h2>
        </div>
        <p className="text-sm text-slate-500">{formatDate(data.date)}</p>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-5">
        {[
          ["Pasien", data.patientName],
          ["Rumah Sakit", data.hospital],
          ["Lokasi", data.location],
          ["Layanan", data.service],
          ["Caregiver", data.caregiver],
          ["Durasi", data.duration],
        ].map(([k, v]) => (
          <div key={k}>
            <p className="text-xs text-slate-500">{k}</p>
            <p className="text-sm font-medium">{v || "-"}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border p-4 space-y-2" style={{ borderColor: theme.border }}>
        <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: theme.primaryDark }}>Ringkasan Pembayaran</p>
        <div className="flex justify-between text-sm"><span className="text-slate-600">Total Tagihan</span><span className="font-medium">{formatCurrency(data.totalBill)}</span></div>
        <div className="flex justify-between text-sm"><span className="text-slate-600">DP Dibayar</span><span className="font-medium">{formatCurrency(data.dp)}</span></div>
        <div className="flex justify-between text-base pt-2 border-t" style={{ borderColor: theme.border }}>
          <span className="font-bold">Sisa</span>
          <span className="font-bold" style={{ color: theme.primaryDark }}>{formatCurrency(data.remaining)}</span>
        </div>
      </div>
      {data.notes && <p className="mt-4 text-sm text-slate-600">{data.notes}</p>}
      {data.signature && <div className="mt-4 flex justify-between items-end"><div><p className="text-xs text-slate-500 mb-1">Tanda Tangan Otorisasi</p><img src={data.signature} alt="tanda tangan" className="h-14" /></div></div>}
      <div className="flex justify-end mt-4">
        <div className="text-right">
          <p className="text-xs text-slate-500">Penanggung Jawab</p>
          <p className="text-sm font-medium">{data.penanggungJawab || "-"}</p>
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-400 text-center">Dibuat dengan Ari Caregiver Invoice</p>
    </div>
  );
}

function MinimalTemplate({ data }: { data: InvoiceData }) {
  const { theme } = useSettings();
  return (
    <div className="bg-white text-slate-900 p-8 rounded-2xl">
      <div className="text-center mb-6">
        <Logo size="md" />
        <h2 className="mt-4 text-4xl font-serif font-bold tracking-tight">{data.invoiceNumber}</h2>
        <p className="text-sm text-slate-500 mt-1">{formatDate(data.date)}</p>
      </div>
      <div className="space-y-1 mb-6">
        {[
          ["Pasien", data.patientName],
          ["Rumah Sakit", data.hospital],
          ["Layanan", data.service],
          ["Caregiver", data.caregiver],
          ["Durasi", data.duration],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between text-sm py-1">
            <span className="text-slate-400">{k}</span>
            <span className="font-medium">{v || "-"}</span>
          </div>
        ))}
      </div>
      <div className="border-t pt-4" style={{ borderColor: "#F1F5F9" }}>
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-sm text-slate-500">Total</span>
          <span className="text-2xl font-serif font-bold">{formatCurrency(data.totalBill)}</span>
        </div>
        <div className="flex justify-between text-sm mb-1"><span className="text-slate-500">DP</span><span>{formatCurrency(data.dp)}</span></div>
        <div className="flex justify-between items-baseline pt-2 border-t" style={{ borderColor: "#F1F5F9" }}>
          <span className="text-lg font-serif" style={{ color: theme.primaryDark }}>Sisa</span>
          <span className="text-2xl font-serif font-bold" style={{ color: theme.primaryDark }}>{formatCurrency(data.remaining)}</span>
        </div>
      </div>
      <div className="text-center mt-6">
        <StatusBadge status={data.status} primary={theme.primary} primaryLight={theme.primaryLight} primaryDark={theme.primaryDark} />
      </div>
      {data.notes && <p className="mt-4 text-sm text-slate-600 text-center italic">{data.notes}</p>}
      {data.signature && <div className="mt-4 text-center"><img src={data.signature} alt="tanda tangan" className="h-14 mx-auto" /></div>}
      <div className="flex justify-end mt-4">
        <div className="text-right">
          <p className="text-xs text-slate-400">Penanggung Jawab</p>
          <p className="text-sm font-medium text-slate-600">{data.penanggungJawab || "-"}</p>
        </div>
      </div>
    </div>
  );
}
