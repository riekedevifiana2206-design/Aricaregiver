import { useEffect, useState } from "react";
import { loadState, saveState } from "../lib/storage";

export function usePersistentForm<T extends object>(key: string, initial: T) {
  const [data, setData] = useState<T>(() => ({ ...initial, ...loadState<T>(key, initial) }));

  useEffect(() => {
    saveState(key, data);
  }, [key, data]);

  const update = <K extends keyof T>(field: K, value: T[K]) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const reset = () => setData(initial);

  return { data, setData, update, reset };
}
