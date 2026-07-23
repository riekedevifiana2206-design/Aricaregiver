import { useState } from "react";
import { downloadPDF, downloadPNG, downloadJPG } from "../../lib/export";

interface DownloadBarProps {
  targetId: string;
  baseName: string;
  onDownloaded?: () => void;
}

export function DownloadBar({ targetId, baseName, onDownloaded }: DownloadBarProps) {
  const [busy, setBusy] = useState<string | null>(null);

  const run = async (kind: "pdf" | "png" | "jpg") => {
    const el = document.getElementById(targetId);
    if (!el) return;
    setBusy(kind);
    try {
      if (kind === "pdf") await downloadPDF(el, `${baseName}.pdf`);
      if (kind === "png") await downloadPNG(el, `${baseName}.png`);
      if (kind === "jpg") await downloadJPG(el, `${baseName}.jpg`);
      onDownloaded?.();
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      <button className="btn-ghost text-sm" disabled={!!busy} onClick={() => run("pdf")}>
        {busy === "pdf" ? "..." : "PDF"}
      </button>
      <button className="btn-ghost text-sm" disabled={!!busy} onClick={() => run("png")}>
        {busy === "png" ? "..." : "PNG"}
      </button>
      <button className="btn-ghost text-sm" disabled={!!busy} onClick={() => run("jpg")}>
        {busy === "jpg" ? "..." : "JPG"}
      </button>
    </div>
  );
}
