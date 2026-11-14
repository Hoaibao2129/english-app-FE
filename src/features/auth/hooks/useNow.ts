import { useEffect, useState } from 'react'

/** Current time in ms, refreshed every `interval_ms`. Drives countdowns. */
export function useNow(interval_ms = 1000): number {
  const [now, set_now] = useState(() => Date.now())

  useEffect(() => {
    const id = window.setInterval(() => set_now(Date.now()), interval_ms)
    return () => window.clearInterval(id)
  }, [interval_ms])

  return now
}
