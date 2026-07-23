import { useRef, useState } from "react";
import { useSettings } from "../../context/SettingsContext";
import { THEMES } from "../../lib/themes";
import { Logo } from "./Logo";
import { readFileAsDataURL, clsx } from "../../lib/utils";

interface HeaderProps {
  title: string;
  onMenu?: () => void;
}

export function Header({ title }: HeaderProps) {
  const { theme, themeId, setThemeId, dark, toggleDark, logo, setLogo, clearLogo } = useSettings();
  const [themeOpen, setThemeOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataURL(file);
    setLogo(dataUrl);
  };

  return (
    <header className="sticky top-0 z-30 px-4 pt-3 pb-2 backdrop-blur-md bg-[color:var(--c-bg)]/80 dark:bg-slate-950/80">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Logo size="sm" />
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => fileRef.current?.click()}
            className="p-2 rounded-full surface !shadow-none !border"
            aria-label="Upload logo"
            title="Upload logo"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          </button>
          {logo && (
            <button
              onClick={clearLogo}
              className="p-2 rounded-full surface !shadow-none !border"
              aria-label="Reset logo"
              title="Use default logo"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </button>
          )}
          <button
            onClick={toggleDark}
            className="p-2 rounded-full surface !shadow-none !border"
            aria-label="Toggle dark mode"
          >
            {dark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>
          <button
            onClick={() => setThemeOpen((v) => !v)}
            className="p-2 rounded-full surface !shadow-none !border"
            aria-label="Theme picker"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
          </button>
        </div>
        <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/svg+xml" className="hidden" onChange={onLogoUpload} />
      </div>

      <h1 className="mt-2 text-lg font-semibold truncate" style={{ color: "var(--c-text)" }}>
        {title}
      </h1>

      {themeOpen && (
        <div className="mt-3 surface p-3 animate-scale-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Color Theme</span>
            <span className="text-xs" style={{ color: "var(--c-text-muted)" }}>{theme.name}</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {THEMES.map((t: typeof THEMES[number]) => (
              <button
                key={t.id}
                onClick={() => { setThemeId(t.id); }}
                className={clsx(
                  "h-10 rounded-xl border-2 transition-transform active:scale-95",
                  themeId === t.id ? "border-current scale-105" : "border-transparent"
                )}
                style={{ backgroundColor: t.primary, color: t.primary }}
                title={t.name}
                aria-label={t.name}
              >
                {themeId === t.id && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mx-auto"><polyline points="20 6 9 17 4 12"/></svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
