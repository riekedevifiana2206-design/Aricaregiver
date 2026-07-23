import { useEffect, useRef, useState } from "react";

interface SignaturePadProps {
  value: string;
  onChange: (dataUrl: string) => void;
  label?: string;
}

export function SignaturePad({ value, onChange, label = "Digital Signature" }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [hasDrawn, setHasDrawn] = useState(Boolean(value));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0F172A";
    if (value) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      img.src = value;
    }
  }, [value]);

  const pos = (e: React.PointerEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const start = (e: React.PointerEvent) => {
    e.preventDefault();
    drawing.current = true;
    const ctx = canvasRef.current!.getContext("2d")!;
    const { x, y } = pos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current!.getContext("2d")!;
    const { x, y } = pos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    setHasDrawn(true);
    onChange(canvasRef.current!.toDataURL("image/png"));
  };

  const clear = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onChange("");
  };

  return (
    <div>
      <span className="label">{label}</span>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={160}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
          className="input touch-none"
          style={{ aspectRatio: "400 / 160" }}
        />
        {!hasDrawn && (
          <span className="absolute inset-0 flex items-center justify-center text-sm pointer-events-none opacity-50">
            Sign here
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={clear}
        className="mt-1 text-xs font-medium"
        style={{ color: "var(--c-text-muted)" }}
      >
        Clear
      </button>
    </div>
  );
}
