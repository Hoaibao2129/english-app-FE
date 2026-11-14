import type { FormEvent } from 'react'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import { Box, Button, CircularProgress } from '@mui/material'
import { AuthTextField } from './AuthTextField'

interface ForgotEmailFormProps {
  email: string
  submitting: boolean
  on_email_change: (value: string) => void
  on_submit: () => void
}

export function ForgotEmailForm({
  email,
  submitting,
  on_email_change,
  on_submit,
}: ForgotEmailFormProps) {
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
      <AuthTextField
        id="email"
        label="Email"
        type="email"
        icon={<MailOutlineRoundedIcon />}
        placeholder="ban@email.com"
        value={email}
        on_change={on_email_change}
        auto_complete="email"
        max_length={254}
        required
      />
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
        Gửi mã xác thực
      </Button>
    </Box>
  )
}
