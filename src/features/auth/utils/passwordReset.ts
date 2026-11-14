export const OTP_LENGTH = 6
export const PASSWORD_MIN_BYTES = 8
export const PASSWORD_MAX_BYTES = 72

/** The backend limits passwords in UTF-8 bytes, not characters. */
export function utf8_byte_length(value: string): number {
  return new TextEncoder().encode(value).length
}

export function sanitize_otp(value: string): string {
  return value.replace(/\D/g, '').slice(0, OTP_LENGTH)
}

/** 125 → "2:05" */
export function format_countdown(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return `${minutes}:${String(rest).padStart(2, '0')}`
}

export function deadline_from(expires_in_seconds: number): number {
  return Date.now() + expires_in_seconds * 1000
}

export function seconds_until(deadline: number | null, now: number): number {
  if (deadline === null) return 0
  return Math.max(0, Math.ceil((deadline - now) / 1000))
}
