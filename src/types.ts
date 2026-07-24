export type ThemeId =
  | "mint"
  | "pastel"
  | "medical"
  | "olive"
  | "emerald"
  | "forest"
  | "sage"
  | "lime"
  | "blue"
  | "mono";

export type TemplateId = "classic" | "modern" | "professional" | "minimal";

export type DocKind = "booking-dadakan" | "booking-lengkap" | "dp" | "invoice" | "refund" | "thank";

export interface RecentDoc {
  id: string;
  kind: DocKind;
  title: string;
  subtitle: string;
  createdAt: number;
}

export interface ThemeColors {
  id: ThemeId;
  name: string;
  primary: string;
  primaryDark: string;
  primaryLight: string;
  accent: string;
  bg: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
}

export interface BookingDadakanData {
  patientName: string;
  phone: string;
  hospital: string;
  date: string;
  duration: string;
  notes: string;
  penanggungJawab: string;
}

export interface BookingLengkapData {
  patientName: string;
  gender: string;
  age: string;
  address: string;
  hospital: string;
  room: string;
  caregiver: string;
  service: string;
  schedule: string;
  duration: string;
  emergency: string;
  payment: string;
  notes: string;
  penanggungJawab: string;
}

export interface DpData {
  totalBill: string;
  dpAmount: string;
  remaining: string;
  notes: string;
  signature: string;
  penanggungJawab: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  patientName: string;
  hospital: string;
  location: string;
  service: string;
  caregiver: string;
  duration: string;
  totalBill: string;
  dp: string;
  remaining: string;
  status: string;
  notes: string;
  signature: string;
  penanggungJawab: string;
}

export interface RefundData {
  type: string;
  documentNumber: string;
  date: string;
  patient: string;
  hospital: string;
  reason: string;
  totalBill: string;
  refundAmount: string;
  refundMethod: string;
  notes: string;
  signature1: string;
  signature2: string;
  penanggungJawab: string;
}

export interface ThankYouData {
  recipient: string;
  message: string;
  sender: string;
  date: string;
  font: string;
  color: string;
  penanggungJawab: string;
}
