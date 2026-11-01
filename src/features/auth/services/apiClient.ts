import { API_URL, ApiError, auth_service, read_api_error } from './authService'
import { token_storage } from './tokenStorage'

export const unauthorized_event = 'study_english:unauthorized'

const no_refresh_paths = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/logout',
]

function send(path: string, init: RequestInit | undefined): Promise<Response> {
  const headers = new Headers(init?.headers)
  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const access_token = token_storage.get_access_token()
  if (access_token) headers.set('Authorization', `Bearer ${access_token}`)
  return fetch(`${API_URL}${path}`, { ...init, headers })
}

// Ends the session in this tab. The shared access token is only removed when
// this tab actually held a refresh token (i.e. the session itself is dead);
// a tab without one must not log out the other tabs.
function give_up(clear: boolean): never {
  if (clear) token_storage.clear_tokens()
  window.dispatchEvent(new Event(unauthorized_event))
  throw new ApiError(401, 'Unauthorized')
}

export async function api_fetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  let response = await send(path, init)

  if (response.status === 401 && !no_refresh_paths.includes(path)) {
    if (!token_storage.get_refresh_token()) give_up(false)

    if (await auth_service.refresh()) {
      response = await send(path, init)
      if (response.status === 401) give_up(true)
    } else if (!token_storage.get_refresh_token()) {
      // refresh was rejected and already cleared the tokens
      give_up(false)
    } else {
      // refresh failed transiently (network/5xx/429): keep the session and
      // surface a non-401 error so callers never treat it as handled
      throw new ApiError(503, 'Không thể làm mới phiên đăng nhập')
    }
  }

  if (!response.ok) throw await read_api_error(response)

  return response
}
