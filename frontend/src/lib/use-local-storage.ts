"use client"

import { useState, useEffect, useCallback } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const item = localStorage.getItem(key)
      if (item) setValue(JSON.parse(item))
    } catch { /* ignore */ }
    setHydrated(true)
  }, [key])

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? (next as (prev: T) => T)(prev) : next
        try { localStorage.setItem(key, JSON.stringify(resolved)) } catch { /* ignore */ }
        return resolved
      })
    },
    [key]
  )

  return [hydrated ? value : initialValue, set] as const
}
