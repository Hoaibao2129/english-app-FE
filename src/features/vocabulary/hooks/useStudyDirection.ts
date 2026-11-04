import { useCallback, useState } from 'react'
import type { Direction } from '../types/vocabulary'

const STORAGE_KEY = 'study_english:direction'
// Key used before the snake_case rename; read once as a fallback.
const LEGACY_STORAGE_KEY = 'study-english:direction'

function read_direction(): Direction {
  try {
    const stored =
      localStorage.getItem(STORAGE_KEY) ??
      localStorage.getItem(LEGACY_STORAGE_KEY)
    if (stored === 'en_vi' || stored === 'vi_en') return stored
  } catch {
    // Storage unavailable; fall back to the default.
  }
  return 'en_vi'
}

export function useStudyDirection(): [Direction, (d: Direction) => void] {
  const [direction, set_direction_state] = useState<Direction>(read_direction)

  const set_direction = useCallback((next: Direction) => {
    set_direction_state(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Ignore write failures; the choice still applies for this session.
    }
  }, [])

  return [direction, set_direction]
}
