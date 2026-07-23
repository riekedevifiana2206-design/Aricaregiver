import html2canvas from "html2canvas";
import jsPDF from "jspdf";

async function captureElement(el: HTMLElement): Promise<HTMLCanvasElement> {
  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });
  return canvas;
}

function triggerDownload(dataUrl: string, filename: string): void {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export async function downloadPNG(el: HTMLElement, filename: string): Promise<void> {
  const canvas = await captureElement(el);
  triggerDownload(canvas.toDataURL("image/png"), filename);
}

export async function downloadJPG(el: HTMLElement, filename: string): Promise<void> {
  const canvas = await captureElement(el);
  triggerDownload(canvas.toDataURL("image/jpeg", 0.95), filename);
}

export async function downloadPDF(el: HTMLElement, filename: string): Promise<void> {
  const canvas = await captureElement(el);
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const ratio = canvas.width / canvas.height;
  let w = pageW;
  let h = w / ratio;
  if (h > pageH) {
    h = pageH;
    w = h * ratio;
  }
  const x = (pageW - w) / 2;
  const y = 24;
  pdf.addImage(imgData, "PNG", x, y, w, h);
  pdf.save(filename);
}

export function shareWhatsApp(text: string): void {
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
