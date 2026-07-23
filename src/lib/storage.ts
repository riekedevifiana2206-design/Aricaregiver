const PREFIX = "ari:";

export function loadState<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveState<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
}

export function loadString(key: string, fallback = ""): string {
  try {
    return localStorage.getItem(PREFIX + key) ?? fallback;
  } catch {
    return fallback;
  }
}

export function saveString(key: string, value: string): void {
  try {
    localStorage.setItem(PREFIX + key, value);
  } catch {
    // ignore
  }
}

export function loadLogo(): string {
  return loadString("logo", "");
}

export function saveLogo(dataUrl: string): void {
  saveString("logo", dataUrl);
}

export function clearLogo(): void {
  saveString("logo", "");
}
