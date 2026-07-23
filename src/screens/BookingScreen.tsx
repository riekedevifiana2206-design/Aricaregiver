import { useState } from "react";
import { Tabs } from "../components/ui/Tabs";
import { Field, TextInput, TextArea, Select } from "../components/ui/Field";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PreviewModal } from "../components/ui/PreviewModal";
import { DownloadBar } from "../components/ui/DownloadBar";
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
    shareWhatsApp(`*Booking Dadakan - Ari Caregiver*\nPatient: ${d.patientName}\nPhone: ${d.phone}\nHospital: ${d.hospital}\nDate: ${formatDate(d.date)}\nDuration: ${d.duration}\nNotes: ${d.notes}`);
  };

  const shareLengkap = () => {
    const d = lengkap.data;
    shareWhatsApp(`*Booking Lengkap - Ari Caregiver*\nPatient: ${d.patientName} (${d.gender}, ${d.age})\nHospital: ${d.hospital} - ${d.room}\nCaregiver: ${d.caregiver}\nService: ${d.service}\nSchedule: ${d.schedule}\nDuration: ${d.duration}\nPayment: ${d.payment}\nEmergency: ${d.emergency}\nNotes: ${d.notes}`);
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
          <Field label="Patient Name"><TextInput value={dadakan.data.patientName} onChange={(e) => dadakan.update("patientName", e.target.value)} placeholder="Patient name" /></Field>
          <Field label="Phone Number"><TextInput type="tel" value={dadakan.data.phone} onChange={(e) => dadakan.update("phone", e.target.value)} placeholder="08..." /></Field>
          <Field label="Hospital / Location"><TextInput value={dadakan.data.hospital} onChange={(e) => dadakan.update("hospital", e.target.value)} placeholder="Hospital" /></Field>
          <Field label="Booking Date"><TextInput type="date" value={dadakan.data.date} onChange={(e) => dadakan.update("date", e.target.value)} /></Field>
          <Field label="Duration"><TextInput value={dadakan.data.duration} onChange={(e) => dadakan.update("duration", e.target.value)} placeholder="e.g. 8 hours" /></Field>
          <Field label="Notes"><TextArea value={dadakan.data.notes} onChange={(e) => dadakan.update("notes", e.target.value)} placeholder="Additional notes" /></Field>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button variant="ghost" onClick={() => setPreview(true)}>Preview</Button>
            <Button onClick={() => setPreview(true)}>Generate PDF</Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <DownloadBar targetId="booking-dadakan-preview" baseName={`Booking-${dadakan.data.patientName || "Dadakan"}`} onDownloaded={() => addDoc("booking-dadakan", dadakan.data.patientName || "Booking", formatDate(dadakan.data.date))} />
            <Button variant="ghost" onClick={shareDadakan}>Share WhatsApp</Button>
          </div>
        </Card>
      )}

      {tab === "lengkap" && (
        <Card className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Patient Name"><TextInput value={lengkap.data.patientName} onChange={(e) => lengkap.update("patientName", e.target.value)} /></Field>
            <Field label="Gender"><Select value={lengkap.data.gender} onChange={(e) => lengkap.update("gender", e.target.value)}><option value="">Select</option><option>Male</option><option>Female</option></Select></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Age"><TextInput value={lengkap.data.age} onChange={(e) => lengkap.update("age", e.target.value)} /></Field>
            <Field label="Room"><TextInput value={lengkap.data.room} onChange={(e) => lengkap.update("room", e.target.value)} /></Field>
          </div>
          <Field label="Address"><TextArea value={lengkap.data.address} onChange={(e) => lengkap.update("address", e.target.value)} /></Field>
          <Field label="Hospital"><TextInput value={lengkap.data.hospital} onChange={(e) => lengkap.update("hospital", e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Caregiver"><TextInput value={lengkap.data.caregiver} onChange={(e) => lengkap.update("caregiver", e.target.value)} /></Field>
            <Field label="Service"><TextInput value={lengkap.data.service} onChange={(e) => lengkap.update("service", e.target.value)} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Schedule"><TextInput type="datetime-local" value={lengkap.data.schedule} onChange={(e) => lengkap.update("schedule", e.target.value)} /></Field>
            <Field label="Duration"><TextInput value={lengkap.data.duration} onChange={(e) => lengkap.update("duration", e.target.value)} /></Field>
          </div>
          <Field label="Emergency Contact"><TextInput value={lengkap.data.emergency} onChange={(e) => lengkap.update("emergency", e.target.value)} /></Field>
          <Field label="Payment"><TextInput value={lengkap.data.payment} onChange={(e) => lengkap.update("payment", e.target.value)} placeholder="e.g. Cash / Transfer" /></Field>
          <Field label="Notes"><TextArea value={lengkap.data.notes} onChange={(e) => lengkap.update("notes", e.target.value)} /></Field>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button variant="ghost" onClick={() => setPreview(true)}>Preview</Button>
            <Button onClick={() => setPreview(true)}>Generate PDF</Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <DownloadBar targetId="booking-lengkap-preview" baseName={`Booking-${lengkap.data.patientName || "Lengkap"}`} onDownloaded={() => addDoc("booking-lengkap", lengkap.data.patientName || "Booking", lengkap.data.hospital)} />
            <Button variant="ghost" onClick={shareLengkap}>Share WhatsApp</Button>
          </div>
        </Card>
      )}

      <PreviewModal open={preview} onClose={() => setPreview(false)}>
        {tab === "dadakan" ? (
          <div id="booking-dadakan-preview"><BookingDadakanPreview data={dadakan.data} /></div>
        ) : (
          <div id="booking-lengkap-preview"><BookingLengkapPreview data={lengkap.data} /></div>
        )}
      </PreviewModal>
    </div>
  );
}
