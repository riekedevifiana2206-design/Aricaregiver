import type { BookingDadakanData, BookingLengkapData, LineItem } from "../../types";
import { useSettings } from "../../context/SettingsContext";
import { Logo } from "../../components/ui/Logo";
import { formatDate, formatCurrency, itemsTotal } from "../../lib/utils";

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

interface BookingPreviewProps {
  data: BookingDadakanData;
}

export function BookingDadakanPreview({ data }: BookingPreviewProps) {
  const { theme } = useSettings();
  const total = itemsTotal(data.items);
  const rows: [string, string][] = [
    ["Nama Pasien", data.patientName],
    ["Nomor Telepon", data.phone],
    ["Rumah Sakit / Lokasi", data.hospital],
    ["Tanggal Booking", formatDate(data.date)],
  ];
  return (
    <div className="bg-white text-slate-900 p-6 rounded-2xl" style={{ width: "100%" }}>
      <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: theme.border }}>
        <Logo size="sm" />
        <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: theme.primaryLight, color: theme.primaryDark }}>
          Booking Dadakan
        </span>
      </div>
      <h2 className="text-xl font-serif font-semibold mb-4">Konfirmasi Booking</h2>
      <div className="space-y-2.5">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 text-sm border-b pb-2" style={{ borderColor: "#F1F5F9" }}>
            <span className="text-slate-500">{k}</span>
            <span className="font-medium text-right">{v || "-"}</span>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: theme.primaryDark }}>Rincian Layanan</p>
        <ItemsList items={data.items} theme={theme} />
        <div className="flex justify-between items-center mt-2 px-3 py-2 rounded-xl" style={{ background: theme.primaryLight }}>
          <span className="text-sm font-semibold" style={{ color: theme.primaryDark }}>Total</span>
          <span className="text-lg font-bold" style={{ color: theme.primaryDark }}>{formatCurrency(String(total))}</span>
        </div>
      </div>
      {data.notes && (
        <div className="mt-4 p-3 rounded-xl text-sm" style={{ background: theme.primaryLight, color: theme.text }}>
          <p className="font-semibold mb-1">Catatan</p>
          <p>{data.notes}</p>
        </div>
      )}
      <div className="flex justify-end mt-4">
        <div className="text-right">
          <p className="text-xs text-slate-500">Penanggung Jawab</p>
          <p className="text-sm font-medium">{data.penanggungJawab || "-"}</p>
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-400">Dibuat dengan Ari Caregiver Invoice</p>
    </div>
  );
}

interface BookingLengkapPreviewProps {
  data: BookingLengkapData;
}

export function BookingLengkapPreview({ data }: BookingLengkapPreviewProps) {
  const { theme } = useSettings();
  const total = itemsTotal(data.items);
  const rows: [string, string][] = [
    ["Nama Pasien", data.patientName],
    ["Jenis Kelamin", data.gender],
    ["Usia", data.age],
    ["Alamat", data.address],
    ["Rumah Sakit", data.hospital],
    ["Ruangan", data.room],
    ["Caregiver", data.caregiver],
    ["Jadwal", data.schedule],
    ["Kontak Darurat", data.emergency],
    ["Pembayaran", data.payment],
  ];
  return (
    <div className="bg-white text-slate-900 p-6 rounded-2xl" style={{ width: "100%" }}>
      <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: theme.border }}>
        <Logo size="sm" />
        <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: theme.primaryLight, color: theme.primaryDark }}>
          Booking Lengkap
        </span>
      </div>
      <h2 className="text-xl font-serif font-semibold mb-4">Booking Lengkap</h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
        {rows.map(([k, v]) => (
          <div key={k} className="border-b pb-2" style={{ borderColor: "#F1F5F9" }}>
            <p className="text-xs text-slate-500">{k}</p>
            <p className="text-sm font-medium">{v || "-"}</p>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: theme.primaryDark }}>Rincian Layanan</p>
        <ItemsList items={data.items} theme={theme} />
        <div className="flex justify-between items-center mt-2 px-3 py-2 rounded-xl" style={{ background: theme.primaryLight }}>
          <span className="text-sm font-semibold" style={{ color: theme.primaryDark }}>Total</span>
          <span className="text-lg font-bold" style={{ color: theme.primaryDark }}>{formatCurrency(String(total))}</span>
        </div>
      </div>
      {data.notes && (
        <div className="mt-4 p-3 rounded-xl text-sm" style={{ background: theme.primaryLight, color: theme.text }}>
          <p className="font-semibold mb-1">Catatan</p>
          <p>{data.notes}</p>
        </div>
      )}
      <div className="flex justify-end mt-4">
        <div className="text-right">
          <p className="text-xs text-slate-500">Penanggung Jawab</p>
          <p className="text-sm font-medium">{data.penanggungJawab || "-"}</p>
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-400">Dibuat dengan Ari Caregiver Invoice</p>
    </div>
  );
}
