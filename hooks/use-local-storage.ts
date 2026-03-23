"use client";

import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        setValue(JSON.parse(raw) as T);
      }
    } catch {
      setValue(initialValue);
    }
  }, [key]);

  function update(nextValue: T) {
    setValue(nextValue);
    try {
      window.localStorage.setItem(key, JSON.stringify(nextValue));
    } catch {
      // ignore storage failures
    }
  }

  return [value, update] as const;
}
