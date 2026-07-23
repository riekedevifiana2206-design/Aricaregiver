import { useCallback, useEffect, useState } from "react";
import type { RecentDoc, DocKind } from "../types";
import { loadState, saveState } from "../lib/storage";
import { uid } from "../lib/utils";

const KEY = "recentDocs";
const MAX = 12;

export function useRecentDocs() {
  const [docs, setDocs] = useState<RecentDoc[]>(() => loadState<RecentDoc[]>(KEY, []));

  useEffect(() => {
    saveState(KEY, docs);
  }, [docs]);

  const addDoc = useCallback((kind: DocKind, title: string, subtitle: string) => {
    const doc: RecentDoc = { id: uid(), kind, title, subtitle, createdAt: Date.now() };
    setDocs((prev) => [doc, ...prev].slice(0, MAX));
  }, []);

  const clearDocs = useCallback(() => setDocs([]), []);

  return { docs, addDoc, clearDocs };
}
