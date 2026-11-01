import { useEffect, useState } from 'react'

// Smaller gaps come from browser chrome (URL bar collapsing), not the keyboard.
const KEYBOARD_MIN_HEIGHT = 150

// iOS keeps the layout viewport full height when the on-screen keyboard opens and
// only shrinks the visual viewport, so CSS alone can't tell the keyboard is up.
function read_keyboard_open(): boolean {
  const viewport = window.visualViewport
  if (!viewport) return false
  return window.innerHeight - viewport.height > KEYBOARD_MIN_HEIGHT
}

export function useKeyboardOpen(): boolean {
  const [open, set_open] = useState(read_keyboard_open)

  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return
    const update = () => set_open(read_keyboard_open())
    viewport.addEventListener('resize', update)
    return () => viewport.removeEventListener('resize', update)
  }, [])

  return open
}
