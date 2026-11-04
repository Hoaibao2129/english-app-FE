import { useState } from 'react'
import type { FormEvent } from 'react'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Link,
  Stack,
} from '@mui/material'
import {
  Link as RouterLink,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { AuthTextField } from '../components/AuthTextField'
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
    <AuthLayout
      eyebrow="BẮT ĐẦU HÀNH TRÌNH"
      title="Tạo tài khoản mới"
      description="Mỗi ngày một chút — bắt đầu từ hôm nay nhé."
      footer={
        <>
          Đã có tài khoản?{' '}
          <Link
            component={RouterLink}
            to="/login"
            state={location.state}
            underline="hover"
            fontWeight={600}
          >
            Đăng nhập
          </Link>
        </>
      }
    >
      <Box
        component="form"
        onSubmit={handle_submit}
        aria-labelledby="auth-heading"
      >
        <Stack spacing={2.5}>
          {error && <Alert severity="error">{error}</Alert>}
          <AuthTextField
            id="display_name"
            label="Tên hiển thị (không bắt buộc)"
            icon={<PersonOutlineRoundedIcon />}
            placeholder="Tên của bạn"
            value={display_name}
            on_change={set_display_name}
            auto_complete="name"
          />
          <AuthTextField
            id="email"
            label="Email"
            type="email"
            icon={<MailOutlineRoundedIcon />}
            placeholder="ban@email.com"
            value={email}
            on_change={set_email}
            auto_complete="email"
            required
          />
          <AuthTextField
            id="password"
            label="Mật khẩu"
            type="password"
            icon={<LockRoundedIcon />}
            placeholder="Nhập mật khẩu"
            value={password}
            on_change={set_password}
            auto_complete="new-password"
            required
          />
        </Stack>
        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={submitting}
          endIcon={
            submitting ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <ArrowForwardRoundedIcon />
            )
          }
          sx={{ mt: 3.5 }}
        >
          Đăng ký miễn phí
        </Button>
      </Box>
    </AuthLayout>
  )
}
