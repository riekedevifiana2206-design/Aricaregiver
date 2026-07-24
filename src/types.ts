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

export type ThankYouDesign = string;

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

export interface LineItem {
  id: string;
  description: string;
  duration: string;
  amount: string;
}

export interface BookingDadakanData {
  patientName: string;
  phone: string;
  hospital: string;
  date: string;
  items: LineItem[];
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
  schedule: string;
  items: LineItem[];
  emergency: string;
  payment: string;
  notes: string;
  penanggungJawab: string;
}

export interface DpData {
  patientName: string;
  hospital: string;
  location: string;
  caregiver: string;
  items: LineItem[];
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
  caregiver: string;
  items: LineItem[];
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
  items: LineItem[];
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
  design: ThankYouDesign;
  penanggungJawab: string;
}
