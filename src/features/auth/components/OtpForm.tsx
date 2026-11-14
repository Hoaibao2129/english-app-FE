import type { FormEvent } from 'react'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import PinRoundedIcon from '@mui/icons-material/PinRounded'
import {
  Box,
  Button,
  CircularProgress,
  Link,
  Stack,
  Typography,
} from '@mui/material'
import { OTP_LENGTH, format_countdown } from '../utils/passwordReset'
import { AuthTextField } from './AuthTextField'

interface OtpFormProps {
  otp: string
  remaining_seconds: number
  resend_seconds: number
  submitting: boolean
  resending: boolean
  on_otp_change: (value: string) => void
  on_submit: () => void
  on_resend: () => void
  on_change_email: () => void
}

export function OtpForm({
  otp,
  remaining_seconds,
  resend_seconds,
  submitting,
  resending,
  on_otp_change,
  on_submit,
  on_resend,
  on_change_email,
}: OtpFormProps) {
  const expired = remaining_seconds === 0
  const busy = submitting || resending

  function handle_submit(event: FormEvent) {
    event.preventDefault()
    if (!busy && !expired) on_submit()
  }

  return (
    <Box
      component="form"
      onSubmit={handle_submit}
      aria-labelledby="auth-heading"
    >
      <AuthTextField
        id="otp"
        label="Mã xác thực"
        icon={<PinRoundedIcon />}
        placeholder="Nhập mã 6 số"
        value={otp}
        on_change={on_otp_change}
        auto_complete="one-time-code"
        input_mode="numeric"
        max_length={OTP_LENGTH}
        required
        helper_text={
          expired
            ? 'Mã đã hết hạn, hãy bấm "Gửi lại mã" để nhận mã mới'
            : `Mã hết hạn sau ${format_countdown(remaining_seconds)}`
        }
        error={expired}
      />

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mt: 1.5 }}
      >
        <Link
          component="button"
          type="button"
          underline="hover"
          onClick={on_change_email}
          disabled={busy}
          sx={{ fontSize: 14 }}
        >
          Đổi email
        </Link>
        <Button
          type="button"
          size="small"
          onClick={on_resend}
          disabled={busy || resend_seconds > 0}
          startIcon={
            resending ? <CircularProgress size={14} color="inherit" /> : null
          }
        >
          {resend_seconds > 0
            ? `Gửi lại mã (${resend_seconds}s)`
            : 'Gửi lại mã'}
        </Button>
      </Stack>

      <Typography
        variant="caption"
        color="text.secondary"
        component="p"
        sx={{ mt: 1.5 }}
      >
        Không thấy email? Hãy kiểm tra cả mục Spam.
      </Typography>

      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        disabled={busy || expired || otp.length !== OTP_LENGTH}
        endIcon={
          submitting ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            <ArrowForwardRoundedIcon />
          )
        }
        sx={{ mt: 3 }}
      >
        Xác nhận
      </Button>
    </Box>
  )
}
