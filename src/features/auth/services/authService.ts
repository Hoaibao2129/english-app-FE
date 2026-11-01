import { api_fetch } from './apiClient'
import { token_storage } from './tokenStorage'

export const API_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

export interface AuthUser {
  id: string
  email: string
  display_name: string | null
  role: 'user' | 'admin'
}

export interface AuthResult {
  access_token: string
  refresh_token: string
  user: AuthUser
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function read_api_error(response: Response): Promise<ApiError> {
  let message = `Request failed with status ${response.status}`
  try {
    const data = (await response.json()) as { message?: string | string[] }
    if (Array.isArray(data.message)) message = data.message.join(', ')
    else if (typeof data.message === 'string') message = data.message
  } catch {
    // non-JSON body
  }
  return new ApiError(response.status, message)
}

async function post_json(path: string, body: unknown): Promise<Response> {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) throw await read_api_error(response)

  return response
}

function store_tokens(tokens: { access_token: string; refresh_token: string }) {
  token_storage.set_access_token(tokens.access_token)
  token_storage.set_refresh_token(tokens.refresh_token)
}

async function authenticate(path: string, body: unknown): Promise<AuthResult> {
  const response = await post_json(path, body)
  const result = (await response.json()) as AuthResult
  store_tokens(result)
  return result
}

let refresh_promise: Promise<boolean> | null = null

async function do_refresh(): Promise<boolean> {
  const refresh_token = token_storage.get_refresh_token()
  if (!refresh_token) return false

  try {
    const response = await post_json('/auth/refresh', { refresh_token })
    store_tokens(
      (await response.json()) as {
        access_token: string
        refresh_token: string
      },
    )
    return true
  } catch (reason) {
    // Only a definitive rejection ends the session; network errors and 5xx
    // keep the tokens so a later request can try again.
    if (
      reason instanceof ApiError &&
      (reason.status === 400 || reason.status === 401)
    ) {
      token_storage.clear_tokens()
    }
    return false
  }
}

export const auth_service = {
  register: (input: {
    email: string
    password: string
    display_name?: string
  }) => authenticate('/auth/register', input),

  login: (input: { email: string; password: string }) =>
    authenticate('/auth/login', input),

  refresh(): Promise<boolean> {
    refresh_promise ??= do_refresh().finally(() => {
      refresh_promise = null
    })
    return refresh_promise
  },

  async logout(): Promise<void> {
    const refresh_token = token_storage.get_refresh_token()
    try {
      if (refresh_token) await post_json('/auth/logout', { refresh_token })
    } catch {
      // best-effort
    } finally {
      token_storage.clear_tokens()
      token_storage.broadcast_logout()
    }
  },

  async get_me(): Promise<AuthUser> {
    const response = await api_fetch('/auth/me')
    return (await response.json()) as AuthUser
  },
}
