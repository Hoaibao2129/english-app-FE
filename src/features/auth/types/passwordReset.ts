export type ResetStep = 'email' | 'otp' | 'password'

export interface ForgotPasswordResult {
  message: string
  expires_in_seconds: number
}

export interface VerifyOtpResult {
  reset_token: string
  expires_in_seconds: number
}

export interface ResetPasswordInput {
  reset_token: string
  new_password: string
  confirm_password: string
}
