import { useState } from "react";
import { Tabs } from "../components/ui/Tabs";
import { Field, TextInput, TextArea, Select } from "../components/ui/Field";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PreviewModal } from "../components/ui/PreviewModal";
import { DownloadBar } from "../components/ui/DownloadBar";
import { ExportTarget } from "../components/ui/ExportTarget";
import { usePersistentForm } from "../hooks/usePersistentForm";
import { useRecentDocs } from "../hooks/useRecentDocs";
import { todayISO, formatDate } from "../lib/utils";
import { shareWhatsApp } from "../lib/export";
import type { BookingDadakanData, BookingLengkapData } from "../types";
import { BookingDadakanPreview, BookingLengkapPreview } from "./booking/BookingPreviews";

type Tab = "dadakan" | "lengkap";

const DADAKAN_INIT: BookingDadakanData = {
  patientName: "", phone: "", hospital: "", date: todayISO(), duration: "", notes: "",
};

const LENGKAP_INIT: BookingLengkapData = {
  patientName: "", gender: "", age: "", address: "", hospital: "", room: "",
  caregiver: "", service: "", schedule: "", duration: "", emergency: "", payment: "", notes: "",
};

export function BookingScreen() {
  const [tab, setTab] = useState<Tab>("dadakan");
  const [preview, setPreview] = useState(false);

  const dadakan = usePersistentForm("bookingDadakan", DADAKAN_INIT);
  const lengkap = usePersistentForm("bookingLengkap", LENGKAP_INIT);
  const { addDoc } = useRecentDocs();

  const shareDadakan = () => {
    const d = dadakan.data;
    shareWhatsApp(`*Booking Dadakan - Ari Caregiver*\nPasien: ${d.patientName}\nTelepon: ${d.phone}\nRumah Sakit: ${d.hospital}\nTanggal: ${formatDate(d.date)}\nDurasi: ${d.duration}\nCatatan: ${d.notes}`);
  };

  const shareLengkap = () => {
    const d = lengkap.data;
    shareWhatsApp(`*Booking Lengkap - Ari Caregiver*\nPasien: ${d.patientName} (${d.gender}, ${d.age})\nRumah Sakit: ${d.hospital} - ${d.room}\nCaregiver: ${d.caregiver}\nLayanan: ${d.service}\nJadwal: ${d.schedule}\nDurasi: ${d.duration}\nPembayaran: ${d.payment}\nDarurat: ${d.emergency}\nCatatan: ${d.notes}`);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <Tabs<Tab>
        tabs={[{ id: "dadakan", label: "Booking Dadakan" }, { id: "lengkap", label: "Booking Lengkap" }]}
        active={tab}
        onChange={setTab}
      />

      {tab === "dadakan" && (
        <Card className="space-y-3">
          <Field label="Nama Pasien"><TextInput value={dadakan.data.patientName} onChange={(e) => dadakan.update("patientName", e.target.value)} placeholder="Nama pasien" /></Field>
          <Field label="Nomor Telepon"><TextInput type="tel" value={dadakan.data.phone} onChange={(e) => dadakan.update("phone", e.target.value)} placeholder="08..." /></Field>
          <Field label="Rumah Sakit / Lokasi"><TextInput value={dadakan.data.hospital} onChange={(e) => dadakan.update("hospital", e.target.value)} placeholder="Rumah sakit" /></Field>
          <Field label="Tanggal Booking"><TextInput type="date" value={dadakan.data.date} onChange={(e) => dadakan.update("date", e.target.value)} /></Field>
          <Field label="Durasi"><TextInput value={dadakan.data.duration} onChange={(e) => dadakan.update("duration", e.target.value)} placeholder="misal 8 jam" /></Field>
          <Field label="Catatan"><TextArea value={dadakan.data.notes} onChange={(e) => dadakan.update("notes", e.target.value)} placeholder="Catatan tambahan" /></Field>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button variant="ghost" onClick={() => setPreview(true)}>Pratinjau</Button>
            <Button onClick={() => setPreview(true)}>Buat PDF</Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <DownloadBar targetId="booking-dadakan-export" baseName={`Booking-${dadakan.data.patientName || "Dadakan"}`} onDownloaded={() => addDoc("booking-dadakan", dadakan.data.patientName || "Booking", formatDate(dadakan.data.date))} />
            <Button variant="ghost" onClick={shareDadakan}>Bagikan WhatsApp</Button>
          </div>
        </Card>
      )}

      {tab === "lengkap" && (
        <Card className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nama Pasien"><TextInput value={lengkap.data.patientName} onChange={(e) => lengkap.update("patientName", e.target.value)} /></Field>
            <Field label="Jenis Kelamin"><Select value={lengkap.data.gender} onChange={(e) => lengkap.update("gender", e.target.value)}><option value="">Pilih</option><option>Laki-laki</option><option>Perempuan</option></Select></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Usia"><TextInput value={lengkap.data.age} onChange={(e) => lengkap.update("age", e.target.value)} /></Field>
            <Field label="Ruangan"><TextInput value={lengkap.data.room} onChange={(e) => lengkap.update("room", e.target.value)} /></Field>
          </div>
          <Field label="Alamat"><TextArea value={lengkap.data.address} onChange={(e) => lengkap.update("address", e.target.value)} /></Field>
          <Field label="Rumah Sakit"><TextInput value={lengkap.data.hospital} onChange={(e) => lengkap.update("hospital", e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Caregiver"><TextInput value={lengkap.data.caregiver} onChange={(e) => lengkap.update("caregiver", e.target.value)} /></Field>
            <Field label="Layanan"><TextInput value={lengkap.data.service} onChange={(e) => lengkap.update("service", e.target.value)} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Jadwal"><TextInput type="datetime-local" value={lengkap.data.schedule} onChange={(e) => lengkap.update("schedule", e.target.value)} /></Field>
            <Field label="Durasi"><TextInput value={lengkap.data.duration} onChange={(e) => lengkap.update("duration", e.target.value)} /></Field>
          </div>
          <Field label="Kontak Darurat"><TextInput value={lengkap.data.emergency} onChange={(e) => lengkap.update("emergency", e.target.value)} /></Field>
          <Field label="Pembayaran"><TextInput value={lengkap.data.payment} onChange={(e) => lengkap.update("payment", e.target.value)} placeholder="misal Tunai / Transfer" /></Field>
          <Field label="Catatan"><TextArea value={lengkap.data.notes} onChange={(e) => lengkap.update("notes", e.target.value)} /></Field>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button variant="ghost" onClick={() => setPreview(true)}>Pratinjau</Button>
            <Button onClick={() => setPreview(true)}>Buat PDF</Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <DownloadBar targetId="booking-lengkap-export" baseName={`Booking-${lengkap.data.patientName || "Lengkap"}`} onDownloaded={() => addDoc("booking-lengkap", lengkap.data.patientName || "Booking", lengkap.data.hospital)} />
            <Button variant="ghost" onClick={shareLengkap}>Bagikan WhatsApp</Button>
          </div>
        </Card>
      )}

      <ExportTarget id="booking-dadakan-export"><BookingDadakanPreview data={dadakan.data} /></ExportTarget>
      <ExportTarget id="booking-lengkap-export"><BookingLengkapPreview data={lengkap.data} /></ExportTarget>

      <PreviewModal open={preview} onClose={() => setPreview(false)}>
        {tab === "dadakan" ? <BookingDadakanPreview data={dadakan.data} /> : <BookingLengkapPreview data={lengkap.data} />}
      </PreviewModal>
    </div>
  );
}
