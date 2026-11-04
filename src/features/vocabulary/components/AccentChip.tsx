import { Chip } from '@mui/material'
import { alpha } from '@mui/material/styles'

interface AccentChipProps {
  label: string
}

export function AccentChip({ label }: AccentChipProps) {
  return (
    <Chip
      size="small"
      label={label}
      sx={(theme) => ({
        height: 26,
        fontSize: 12,
        letterSpacing: '0.02em',
        color: 'accent.contrastText',
        bgcolor: alpha(theme.palette.accent.main, 0.4),
        border: `1px solid ${alpha(theme.palette.accent.main, 0.7)}`,
      })}
    />
  )
}
