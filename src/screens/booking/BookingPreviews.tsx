import type { BookingDadakanData, BookingLengkapData } from "../../types";
import { useSettings } from "../../context/SettingsContext";
import { Logo } from "../../components/ui/Logo";
import { formatDate } from "../../lib/utils";

interface BookingPreviewProps {
  data: BookingDadakanData;
}

export function BookingDadakanPreview({ data }: BookingPreviewProps) {
  const { theme } = useSettings();
  const rows: [string, string][] = [
    ["Nama Pasien", data.patientName],
    ["Nomor Telepon", data.phone],
    ["Rumah Sakit / Lokasi", data.hospital],
    ["Tanggal Booking", formatDate(data.date)],
    ["Durasi", data.duration],
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
  const rows: [string, string][] = [
    ["Nama Pasien", data.patientName],
    ["Jenis Kelamin", data.gender],
    ["Usia", data.age],
    ["Alamat", data.address],
    ["Rumah Sakit", data.hospital],
    ["Ruangan", data.room],
    ["Caregiver", data.caregiver],
    ["Layanan", data.service],
    ["Jadwal", data.schedule],
    ["Durasi", data.duration],
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
