import type { FormEvent } from 'react'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material'
import { format_countdown } from '../utils/passwordReset'
import { AuthTextField } from './AuthTextField'

interface NewPasswordFormProps {
  new_password: string
  confirm_password: string
  password_error: string | null
  confirm_error: string | null
  remaining_seconds: number
  submitting: boolean
  on_new_password_change: (value: string) => void
  on_confirm_password_change: (value: string) => void
  on_submit: () => void
}

export function NewPasswordForm({
  new_password,
  confirm_password,
  password_error,
  confirm_error,
  remaining_seconds,
  submitting,
  on_new_password_change,
  on_confirm_password_change,
  on_submit,
}: NewPasswordFormProps) {
  function handle_submit(event: FormEvent) {
    event.preventDefault()
    if (!submitting) on_submit()
  }

  return (
    <Box
      component="form"
      onSubmit={handle_submit}
      aria-labelledby="auth-heading"
    >
      <Stack spacing={2.5}>
        <AuthTextField
          id="new_password"
          label="Mật khẩu mới"
          type="password"
          icon={<LockRoundedIcon />}
          placeholder="Ít nhất 8 ký tự"
          value={new_password}
          on_change={on_new_password_change}
          auto_complete="new-password"
          required
          error={password_error !== null}
          helper_text={password_error ?? undefined}
        />
        <AuthTextField
          id="confirm_password"
          label="Xác nhận mật khẩu mới"
          type="password"
          icon={<LockRoundedIcon />}
          placeholder="Nhập lại mật khẩu mới"
          value={confirm_password}
          on_change={on_confirm_password_change}
          auto_complete="new-password"
          required
          error={confirm_error !== null}
          helper_text={confirm_error ?? undefined}
        />
      </Stack>

      <Typography
        variant="caption"
        color="text.secondary"
        component="p"
        sx={{ mt: 1.5 }}
      >
        Phiên đặt lại mật khẩu còn {format_countdown(remaining_seconds)}
      </Typography>

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
            <CheckRoundedIcon />
          )
        }
        sx={{ mt: 3 }}
      >
        Đặt lại mật khẩu
      </Button>
    </Box>
  )
}
