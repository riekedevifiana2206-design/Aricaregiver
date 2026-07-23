import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { ThemeColors, ThemeId, TemplateId } from "../types";
import { getTheme, DEFAULT_THEME_ID } from "../lib/themes";
import { loadState, saveState, loadString, saveString } from "../lib/storage";

interface SettingsContextValue {
  theme: ThemeColors;
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
  templateId: TemplateId;
  setTemplateId: (id: TemplateId) => void;
  dark: boolean;
  toggleDark: () => void;
  logo: string;
  setLogo: (v: string) => void;
  clearLogo: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>(() =>
    loadState<ThemeId>("themeId", DEFAULT_THEME_ID)
  );
  const [templateId, setTemplateIdState] = useState<TemplateId>(() =>
    loadState<TemplateId>("templateId", "classic")
  );
  const [dark, setDark] = useState<boolean>(() => loadState<boolean>("dark", false));
  const [logo, setLogoState] = useState<string>(() => loadString("logo", ""));

  const theme = getTheme(themeId);

  useEffect(() => {
    saveState("themeId", themeId);
  }, [themeId]);
  useEffect(() => {
    saveState("templateId", templateId);
  }, [templateId]);
  useEffect(() => {
    saveState("dark", dark);
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  useEffect(() => {
    saveString("logo", logo);
  }, [logo]);

  // Apply theme color variables to root
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--c-primary", theme.primary);
    root.style.setProperty("--c-primary-dark", theme.primaryDark);
    root.style.setProperty("--c-primary-light", theme.primaryLight);
    root.style.setProperty("--c-accent", theme.accent);
    root.style.setProperty("--c-bg", theme.bg);
    root.style.setProperty("--c-surface", theme.surface);
    root.style.setProperty("--c-text", theme.text);
    root.style.setProperty("--c-text-muted", theme.textMuted);
    root.style.setProperty("--c-border", theme.border);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme.bg);
  }, [theme]);

  const value: SettingsContextValue = {
    theme,
    themeId,
    setThemeId: setThemeIdState,
    templateId,
    setTemplateId: setTemplateIdState,
    dark,
    toggleDark: () => setDark((d) => !d),
    logo,
    setLogo: setLogoState,
    clearLogo: () => setLogoState(""),
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
