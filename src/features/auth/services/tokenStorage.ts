const ACCESS_TOKEN_KEY = 'study_english:access_token'
const REFRESH_TOKEN_KEY = 'study_english:refresh_token'
const LOGOUT_KEY = 'study_english:logout'
const EXPIRY_SKEW_MS = 10_000

function read(storage: () => Storage, key: string): string | null {
  try {
    return storage().getItem(key)
  } catch {
    return null
  }
}

function write(storage: () => Storage, key: string, value: string): void {
  try {
    storage().setItem(key, value)
  } catch {
    // storage unavailable; ignore
  }
}

function remove(storage: () => Storage, key: string): void {
  try {
    storage().removeItem(key)
  } catch {
    // storage unavailable; ignore
  }
}

const local = () => window.localStorage
const session = () => window.sessionStorage

export const access_token_key = ACCESS_TOKEN_KEY
export const logout_key = LOGOUT_KEY

export const token_storage = {
  get_access_token: () => read(local, ACCESS_TOKEN_KEY),
  set_access_token: (token: string) => write(local, ACCESS_TOKEN_KEY, token),
  get_refresh_token: () => read(session, REFRESH_TOKEN_KEY),
  set_refresh_token: (token: string) =>
    write(session, REFRESH_TOKEN_KEY, token),
  clear_refresh_token: () => remove(session, REFRESH_TOKEN_KEY),
  broadcast_logout: () => write(local, LOGOUT_KEY, String(Date.now())),
  clear_tokens() {
    remove(local, ACCESS_TOKEN_KEY)
    remove(session, REFRESH_TOKEN_KEY)
  },
}

function decode_payload(token: string | null): Record<string, unknown> | null {
  if (!token) return null
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    const binary = atob(padded)
    const json = new TextDecoder().decode(
      Uint8Array.from(binary, (char) => char.charCodeAt(0)),
    )
    const data = JSON.parse(json) as unknown
    return data && typeof data === 'object'
      ? (data as Record<string, unknown>)
      : null
  } catch {
    return null
  }
}

export function is_access_token_expired(token: string | null): boolean {
  const exp = decode_payload(token)?.exp
  if (typeof exp !== 'number') return true
  return exp * 1000 - EXPIRY_SKEW_MS <= Date.now()
}

export function get_token_subject(token: string | null): string | null {
  const sub = decode_payload(token)?.sub
  return typeof sub === 'string' ? sub : null
}
