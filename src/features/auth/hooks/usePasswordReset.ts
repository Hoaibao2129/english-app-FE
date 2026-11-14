import { useCallback, useEffect, useState } from 'react'
import { ApiError, auth_service } from '../services/authService'
import type { ResetStep } from '../types/passwordReset'
import {
  OTP_LENGTH,
  PASSWORD_MAX_BYTES,
  PASSWORD_MIN_BYTES,
  deadline_from,
  sanitize_otp,
  seconds_until,
  utf8_byte_length,
} from '../utils/passwordReset'
import { useNow } from './useNow'

// The backend has no rate limit on sending OTPs yet.
const RESEND_COOLDOWN_MS = 30_000

const GENERIC_ERROR = 'Đã có lỗi xảy ra, vui lòng thử lại'
const NOT_REGISTERED_ERROR = 'Email này chưa được đăng ký'
const SESSION_EXPIRED_ERROR =
  'Phiên đặt lại mật khẩu đã hết hạn, vui lòng thực hiện lại từ đầu'
const PASSWORD_LENGTH_ERROR = `Mật khẩu phải dài từ ${PASSWORD_MIN_BYTES} đến ${PASSWORD_MAX_BYTES} byte (chữ có dấu tính nhiều byte hơn)`
const CONFIRM_MISMATCH_ERROR = 'Mật khẩu xác nhận không khớp'

const OTP_INVALID_MESSAGE = 'OTP is invalid or expired'
const PASSWORD_LENGTH_MESSAGE = 'new_password must be between 8 and 72 bytes'
const CONFIRM_MISMATCH_MESSAGE = 'confirm_password must match new_password'

function send_otp_error(reason: unknown): string {
  if (!(reason instanceof ApiError)) return GENERIC_ERROR
  if (reason.status === 404) return NOT_REGISTERED_ERROR
  if (reason.status === 503) {
    return 'Không gửi được email, vui lòng thử lại sau'
  }
  if (reason.status === 400) return 'Email không hợp lệ'
  return GENERIC_ERROR
}

/**
 * Three-step forgot-password flow. The reset token only ever lives in
 * React state: never persist or log it.
 */
export function usePasswordReset() {
  const now = useNow()

  const [step, set_step] = useState<ResetStep>('email')
  const [email, set_email] = useState('')
  const [otp, set_otp_value] = useState('')
  const [new_password, set_new_password] = useState('')
  const [confirm_password, set_confirm_password] = useState('')
  const [reset_token, set_reset_token] = useState<string | null>(null)
  const [deadline, set_deadline] = useState<number | null>(null)
  const [resend_at, set_resend_at] = useState<number | null>(null)
  const [submitting, set_submitting] = useState(false)
  const [resending, set_resending] = useState(false)
  const [error, set_error] = useState<string | null>(null)
  const [notice, set_notice] = useState<string | null>(null)
  const [password_error, set_password_error] = useState<string | null>(null)
  const [confirm_error, set_confirm_error] = useState<string | null>(null)

  const remaining_seconds = seconds_until(deadline, now)
  const resend_seconds = seconds_until(resend_at, now)
  const busy = submitting || resending

  const restart = useCallback((message: string | null = null) => {
    set_step('email')
    set_otp_value('')
    set_new_password('')
    set_confirm_password('')
    set_reset_token(null)
    set_deadline(null)
    set_password_error(null)
    set_confirm_error(null)
    set_notice(null)
    set_error(message)
  }, [])

  // An expired reset token is useless: send the user back to step 1.
  useEffect(() => {
    if (step !== 'password' || deadline === null) return
    const id = window.setTimeout(
      () => restart(SESSION_EXPIRED_ERROR),
      Math.max(0, deadline - Date.now()),
    )
    return () => window.clearTimeout(id)
  }, [step, deadline, restart])

  const start_otp_window = useCallback((expires_in_seconds: number) => {
    set_deadline(deadline_from(expires_in_seconds))
    set_resend_at(Date.now() + RESEND_COOLDOWN_MS)
    set_otp_value('')
  }, [])

  const set_otp = useCallback((value: string) => {
    set_otp_value(sanitize_otp(value))
  }, [])

  const submit_email = useCallback(async () => {
    const trimmed = email.trim()
    set_error(null)
    set_notice(null)
    set_submitting(true)
    try {
      const result = await auth_service.forgot_password(trimmed)
      set_email(trimmed)
      start_otp_window(result.expires_in_seconds)
      set_step('otp')
    } catch (reason) {
      set_error(send_otp_error(reason))
    } finally {
      set_submitting(false)
    }
  }, [email, start_otp_window])

  const resend_otp = useCallback(async () => {
    set_error(null)
    set_notice(null)
    set_resending(true)
    try {
      const result = await auth_service.forgot_password(email)
      start_otp_window(result.expires_in_seconds)
      set_notice('Đã gửi mã mới, mã cũ không còn dùng được')
    } catch (reason) {
      if (reason instanceof ApiError && reason.status === 404) {
        restart(NOT_REGISTERED_ERROR)
      } else {
        set_error(send_otp_error(reason))
      }
    } finally {
      set_resending(false)
    }
  }, [email, start_otp_window, restart])

  const submit_otp = useCallback(async () => {
    set_error(null)
    set_notice(null)
    if (otp.length !== OTP_LENGTH) {
      set_error(`Mã xác thực gồm ${OTP_LENGTH} chữ số`)
      return
    }
    set_submitting(true)
    try {
      const result = await auth_service.verify_reset_otp({ email, otp })
      set_reset_token(result.reset_token)
      set_deadline(deadline_from(result.expires_in_seconds))
      set_otp_value('')
      set_step('password')
    } catch (reason) {
      if (
        reason instanceof ApiError &&
        reason.message === OTP_INVALID_MESSAGE
      ) {
        set_error(
          'Mã không đúng hoặc đã hết hạn. Hãy nhập lại hoặc bấm "Gửi lại mã".',
        )
      } else if (reason instanceof ApiError && reason.status === 404) {
        restart(NOT_REGISTERED_ERROR)
      } else if (reason instanceof ApiError && reason.status === 400) {
        restart('Email không hợp lệ, vui lòng nhập lại')
      } else {
        set_error(GENERIC_ERROR)
      }
    } finally {
      set_submitting(false)
    }
  }, [email, otp, restart])

  const submit_password = useCallback(async (): Promise<boolean> => {
    set_error(null)
    set_password_error(null)
    set_confirm_error(null)

    const bytes = utf8_byte_length(new_password)
    const length_ok = bytes >= PASSWORD_MIN_BYTES && bytes <= PASSWORD_MAX_BYTES
    if (!length_ok) set_password_error(PASSWORD_LENGTH_ERROR)
    if (confirm_password !== new_password) {
      set_confirm_error(CONFIRM_MISMATCH_ERROR)
    }
    if (!length_ok || confirm_password !== new_password) return false
    if (!reset_token) {
      restart(SESSION_EXPIRED_ERROR)
      return false
    }

    set_submitting(true)
    try {
      await auth_service.reset_password({
        reset_token,
        new_password,
        confirm_password,
      })
      return true
    } catch (reason) {
      if (!(reason instanceof ApiError)) {
        set_error(GENERIC_ERROR)
      } else if (reason.message === CONFIRM_MISMATCH_MESSAGE) {
        // the backend revoked the old token and issued a new one
        const next_token = reason.data?.reset_token
        const expires_in = reason.data?.expires_in_seconds
        if (typeof next_token === 'string' && typeof expires_in === 'number') {
          set_reset_token(next_token)
          set_deadline(deadline_from(expires_in))
          set_confirm_error(CONFIRM_MISMATCH_ERROR)
        } else {
          restart(SESSION_EXPIRED_ERROR)
        }
      } else if (reason.message === PASSWORD_LENGTH_MESSAGE) {
        set_password_error(PASSWORD_LENGTH_ERROR)
      } else if (reason.status === 400 || reason.status === 401) {
        restart(SESSION_EXPIRED_ERROR)
      } else {
        set_error(GENERIC_ERROR)
      }
      return false
    } finally {
      set_submitting(false)
    }
  }, [new_password, confirm_password, reset_token, restart])

  const change_email = useCallback(() => restart(), [restart])

  return {
    step,
    email,
    set_email,
    otp,
    set_otp,
    new_password,
    set_new_password,
    confirm_password,
    set_confirm_password,
    remaining_seconds,
    resend_seconds,
    submitting,
    resending,
    busy,
    error,
    notice,
    password_error,
    confirm_error,
    submit_email,
    resend_otp,
    submit_otp,
    submit_password,
    change_email,
  }
}
