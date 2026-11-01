import { createContext, useContext } from 'react'
import type { AuthUser } from '../services/authService'

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous' | 'error'

export interface AuthContextValue {
  user: AuthUser | null
  status: AuthStatus
  login: (input: { email: string; password: string }) => Promise<void>
  register: (input: {
    email: string
    password: string
    display_name?: string
  }) => Promise<void>
  logout: () => Promise<void>
  retry: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used within AuthProvider')
  return value
}
