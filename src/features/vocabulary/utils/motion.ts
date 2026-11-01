import { keyframes } from '@emotion/react'

export const slide_in = keyframes`
  from { opacity: 0; transform: translateX(48px) scale(0.98); }
  to { opacity: 1; transform: none; }
`

export const fade_up = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
`

export const shake = keyframes`
  10%, 90% { transform: translateX(-2px); }
  20%, 80% { transform: translateX(4px); }
  30%, 50%, 70% { transform: translateX(-8px); }
  40%, 60% { transform: translateX(8px); }
`

export const pop = keyframes`
  0% { transform: scale(1); }
  40% { transform: scale(1.03); }
  100% { transform: scale(1); }
`

export const reduced_motion = {
  '@media (prefers-reduced-motion: reduce)': {
    animation: 'none',
    transition: 'none',
  },
}
