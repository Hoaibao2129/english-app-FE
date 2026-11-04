import { useState } from 'react'
import type { ReactNode } from 'react'
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material'

interface AuthTextFieldProps {
  id: string
  label: string
  icon: ReactNode
  value: string
  on_change: (value: string) => void
  type?: 'text' | 'email' | 'password'
  placeholder?: string
  auto_complete?: string
  required?: boolean
  helper_text?: string
}

// Label above the input, leading icon and, for passwords, a show/hide toggle.
export function AuthTextField({
  id,
  label,
  icon,
  value,
  on_change,
  type = 'text',
  placeholder,
  auto_complete,
  required = false,
  helper_text,
}: AuthTextFieldProps) {
  const [visible, set_visible] = useState(false)
  const is_password = type === 'password'

  return (
    <Box>
      <Typography
        component="label"
        htmlFor={id}
        sx={{ display: 'block', mb: 1.25, fontSize: 14, fontWeight: 500 }}
      >
        {label}
      </Typography>
      <TextField
        id={id}
        fullWidth
        type={is_password && visible ? 'text' : type}
        value={value}
        onChange={(event) => on_change(event.target.value)}
        placeholder={placeholder}
        autoComplete={auto_complete}
        required={required}
        helperText={helper_text}
        slotProps={{
          htmlInput: {
            autoCapitalize: type === 'email' ? 'none' : undefined,
            spellCheck: type === 'email' ? false : undefined,
          },
          input: {
            startAdornment: (
              <InputAdornment
                position="start"
                sx={{ color: 'text.secondary', '& svg': { fontSize: 18 } }}
              >
                {icon}
              </InputAdornment>
            ),
            endAdornment: is_password ? (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  aria-pressed={visible}
                  onClick={() => set_visible((current) => !current)}
                  sx={{ color: 'text.secondary' }}
                >
                  {visible ? (
                    <VisibilityOffRoundedIcon fontSize="small" />
                  ) : (
                    <VisibilityRoundedIcon fontSize="small" />
                  )}
                </IconButton>
              </InputAdornment>
            ) : undefined,
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': { height: 48, fontSize: 15 },
          '& .MuiFormHelperText-root': { mx: 0, mt: 1 },
        }}
      />
    </Box>
  )
}
