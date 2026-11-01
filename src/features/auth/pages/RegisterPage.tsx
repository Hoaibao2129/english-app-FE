import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  Link as RouterLink,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ApiError } from '../services/authService'

export function RegisterPage() {
  const { status, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: { pathname: string; search?: string } } | null)
      ?.from ?? null
  const target = from ? `${from.pathname}${from.search ?? ''}` : '/'

  const [email, set_email] = useState('')
  const [password, set_password] = useState('')
  const [display_name, set_display_name] = useState('')
  const [error, set_error] = useState<string | null>(null)
  const [submitting, set_submitting] = useState(false)

  if (status === 'loading') {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (status === 'authenticated') return <Navigate to={target} replace />

  async function handle_submit(event: FormEvent) {
    event.preventDefault()
    set_error(null)
    set_submitting(true)
    try {
      const name = display_name.trim()
      await register({
        email,
        password,
        ...(name ? { display_name: name } : {}),
      })
      navigate(target, { replace: true })
    } catch (reason) {
      if (reason instanceof ApiError && reason.status === 409) {
        set_error('Email đã được sử dụng')
      } else if (reason instanceof ApiError && reason.status === 400) {
        set_error(reason.message)
      } else {
        set_error('Đã có lỗi xảy ra, vui lòng thử lại')
      }
    } finally {
      set_submitting(false)
    }
  }

  return (
    <Box
      sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2 }}
    >
      <Paper
        component="form"
        onSubmit={handle_submit}
        sx={{ p: 4, width: '100%', maxWidth: 400, display: 'grid', gap: 2 }}
      >
        <Typography variant="h5" fontWeight={800}>
          Đăng ký
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(event) => set_email(event.target.value)}
          required
          autoComplete="email"
        />
        <TextField
          label="Mật khẩu"
          type="password"
          value={password}
          onChange={(event) => set_password(event.target.value)}
          required
          autoComplete="new-password"
        />
        <TextField
          label="Tên hiển thị (không bắt buộc)"
          value={display_name}
          onChange={(event) => set_display_name(event.target.value)}
          autoComplete="name"
        />
        <Button type="submit" variant="contained" disabled={submitting}>
          Đăng ký
        </Button>
        <Link component={RouterLink} to="/login" state={location.state}>
          Đã có tài khoản? Đăng nhập
        </Link>
      </Paper>
    </Box>
  )
}
