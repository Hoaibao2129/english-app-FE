import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { unauthorized_event } from '../services/apiClient'
import { auth_service } from '../services/authService'
import type { AuthUser } from '../services/authService'
import {
  access_token_key,
  get_token_subject,
  is_access_token_expired,
  logout_key,
  token_storage,
} from '../services/tokenStorage'
import { AuthContext } from '../hooks/useAuth'
import type { AuthContextValue, AuthStatus } from '../hooks/useAuth'

function has_usable_session(): boolean {
  const access_token = token_storage.get_access_token()
  if (!access_token) return false
  if (token_storage.get_refresh_token() !== null) return true
  if (is_access_token_expired(access_token)) {
    // expired and nothing to refresh it with: drop the stale token
    token_storage.clear_tokens()
    return false
  }
  return true
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, set_user] = useState<AuthUser | null>(null)
  const [status, set_status] = useState<AuthStatus>(() =>
    has_usable_session() ? 'loading' : 'anonymous',
  )
  const [attempt, set_attempt] = useState(0)
  const user_ref = useRef<AuthUser | null>(null)

  useEffect(() => {
    user_ref.current = user
  }, [user])

  useEffect(() => {
    if (attempt === 0 && status !== 'loading') return
    let active = true

    auth_service
      .get_me()
      .then((me) => {
        if (!active) return
        set_user(me)
        set_status('authenticated')
      })
      .catch((reason: unknown) => {
        if (!active) return
        // a 401 already went through api_fetch's give_up (unauthorized event);
        // anything else is transient, so keep the session and offer a retry
        const status_code = (reason as { status?: number }).status
        if (status_code === 401) {
          set_user(null)
          set_status('anonymous')
          return
        }
        set_status('error')
      })

    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt])

  useEffect(() => {
    const go_anonymous = () => {
      set_user(null)
      set_status('anonymous')
    }
    // this tab's refresh token must not outlive a logout/account switch made
    // in another tab (the shared access token is already theirs to manage)
    const drop_session = () => {
      token_storage.clear_refresh_token()
      go_anonymous()
    }
    const on_storage = (event: StorageEvent) => {
      if (event.key === logout_key) {
        drop_session()
        return
      }
      if (event.key === access_token_key && event.newValue) {
        // another tab signed in as someone else
        const current = user_ref.current
        if (current && get_token_subject(event.newValue) !== current.id) {
          drop_session()
        }
      }
    }

    window.addEventListener(unauthorized_event, go_anonymous)
    window.addEventListener('storage', on_storage)
    return () => {
      window.removeEventListener(unauthorized_event, go_anonymous)
      window.removeEventListener('storage', on_storage)
    }
  }, [])

  const login = useCallback<AuthContextValue['login']>(async (input) => {
    const result = await auth_service.login(input)
    set_user(result.user)
    set_status('authenticated')
  }, [])

  const register = useCallback<AuthContextValue['register']>(async (input) => {
    const result = await auth_service.register(input)
    set_user(result.user)
    set_status('authenticated')
  }, [])

  const logout = useCallback(async () => {
    await auth_service.logout()
    set_user(null)
    set_status('anonymous')
  }, [])

  const retry = useCallback(() => {
    set_status('loading')
    set_attempt((value) => value + 1)
  }, [])

  const value = useMemo(
    () => ({ user, status, login, register, logout, retry }),
    [user, status, login, register, logout, retry],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
