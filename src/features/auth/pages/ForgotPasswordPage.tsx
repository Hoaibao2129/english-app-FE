import { Alert, Box, CircularProgress, Link, Stack } from '@mui/material'
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { ForgotEmailForm } from '../components/ForgotEmailForm'
import { NewPasswordForm } from '../components/NewPasswordForm'
import { OtpForm } from '../components/OtpForm'
import { useAuth } from '../hooks/useAuth'
import { usePasswordReset } from '../hooks/usePasswordReset'
import type { ResetStep } from '../types/passwordReset'

const STEP_COPY: Record<ResetStep, { eyebrow: string; title: string }> = {
  email: { eyebrow: 'QUÊN MẬT KHẨU · BƯỚC 1/3', title: 'Quên mật khẩu?' },
  otp: { eyebrow: 'QUÊN MẬT KHẨU · BƯỚC 2/3', title: 'Nhập mã xác thực' },
  password: { eyebrow: 'QUÊN MẬT KHẨU · BƯỚC 3/3', title: 'Đặt mật khẩu mới' },
}

export function ForgotPasswordPage() {
  const { status } = useAuth()
  const navigate = useNavigate()
  const reset = usePasswordReset()

  if (status === 'loading') {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (status === 'authenticated') return <Navigate to="/" replace />

  async function handle_submit_password() {
    const done = await reset.submit_password()
    if (done) {
      navigate('/login', { replace: true, state: { password_reset: true } })
    }
  }

  const description: Record<ResetStep, string> = {
    email: 'Nhập email đã đăng ký, chúng tôi sẽ gửi cho bạn mã xác thực 6 số.',
    otp: `Mã xác thực đã được gửi tới ${reset.email}.`,
    password: 'Tạo mật khẩu mới cho tài khoản của bạn.',
  }

  return (
    <AuthLayout
      eyebrow={STEP_COPY[reset.step].eyebrow}
      title={STEP_COPY[reset.step].title}
      description={description[reset.step]}
      footer={
        <>
          Nhớ ra mật khẩu rồi?{' '}
          <Link
            component={RouterLink}
            to="/login"
            underline="hover"
            fontWeight={600}
          >
            Đăng nhập
          </Link>
        </>
      }
    >
      <Stack spacing={2.5}>
        {reset.error && <Alert severity="error">{reset.error}</Alert>}
        {reset.notice && <Alert severity="success">{reset.notice}</Alert>}

        {reset.step === 'email' && (
          <ForgotEmailForm
            email={reset.email}
            submitting={reset.submitting}
            on_email_change={reset.set_email}
            on_submit={reset.submit_email}
          />
        )}
        {reset.step === 'otp' && (
          <OtpForm
            otp={reset.otp}
            remaining_seconds={reset.remaining_seconds}
            resend_seconds={reset.resend_seconds}
            submitting={reset.submitting}
            resending={reset.resending}
            on_otp_change={reset.set_otp}
            on_submit={reset.submit_otp}
            on_resend={reset.resend_otp}
            on_change_email={reset.change_email}
          />
        )}
        {reset.step === 'password' && (
          <NewPasswordForm
            new_password={reset.new_password}
            confirm_password={reset.confirm_password}
            password_error={reset.password_error}
            confirm_error={reset.confirm_error}
            remaining_seconds={reset.remaining_seconds}
            submitting={reset.submitting}
            on_new_password_change={reset.set_new_password}
            on_confirm_password_change={reset.set_confirm_password}
            on_submit={handle_submit_password}
          />
        )}
      </Stack>
    </AuthLayout>
  )
}
