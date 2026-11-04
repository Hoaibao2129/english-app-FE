import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded'
import { Box, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'

const BRAND_NAME = 'Dailly English'

interface BrandMarkProps {
  // `inverted` sits on the dark-green panel of the login screen.
  inverted?: boolean
}

export function BrandMark({ inverted = false }: BrandMarkProps) {
  return (
    <Stack direction="row" alignItems="center" spacing={1.5}>
      <Box
        sx={(theme) => ({
          width: 40,
          height: 40,
          borderRadius: '12px',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
          color: inverted ? 'common.white' : 'primary.main',
          bgcolor: inverted
            ? alpha(theme.palette.common.white, 0.1)
            : alpha(theme.palette.primary.main, 0.1),
          boxShadow: `inset 0 0 0 1px ${
            inverted
              ? alpha(theme.palette.common.white, 0.15)
              : alpha(theme.palette.primary.main, 0.1)
          }`,
        })}
      >
        <MenuBookRoundedIcon sx={{ fontSize: 20 }} />
      </Box>
      <Typography
        component="span"
        sx={{
          fontSize: '1.15rem',
          fontWeight: 600,
          letterSpacing: '-0.045em',
          color: inverted ? 'common.white' : 'text.primary',
          whiteSpace: 'nowrap',
        }}
      >
        {BRAND_NAME}
      </Typography>
    </Stack>
  )
}
