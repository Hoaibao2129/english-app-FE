import type { ReactNode } from 'react'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import { Box, Paper, Stack, Typography } from '@mui/material'

interface CompletionCardProps {
  eyebrow?: string
  title: string
  description?: ReactNode
  // Replaces the check badge, e.g. with a quiz score.
  highlight?: ReactNode
  actions: ReactNode
}

export function CompletionCard({
  eyebrow = 'TIẾN ĐỘ HỌC TẬP',
  title,
  description,
  highlight,
  actions,
}: CompletionCardProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        mx: 'auto',
        width: '100%',
        maxWidth: 576,
        px: { xs: 3, sm: 5 },
        py: { xs: 4.5, sm: 6 },
        borderRadius: '28px',
        textAlign: 'center',
        boxShadow: '0 18px 42px rgba(15, 36, 24, 0.06)',
      }}
    >
      <Stack alignItems="center">
        {highlight ?? (
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              bgcolor: 'secondary.main',
              color: 'primary.main',
            }}
          >
            <CheckRoundedIcon sx={{ fontSize: 32 }} />
          </Box>
        )}
        <Typography
          variant="overline"
          component="p"
          color="primary"
          sx={{ mt: 3, letterSpacing: '0.16em' }}
        >
          {eyebrow}
        </Typography>
        <Typography
          component="h1"
          sx={{
            mt: 1,
            fontSize: { xs: 24, sm: 30 },
            fontWeight: 600,
            letterSpacing: '-0.04em',
          }}
        >
          {title}
        </Typography>
        {description && (
          <Typography
            color="text.secondary"
            sx={{ mt: 1.5, maxWidth: 512, lineHeight: 1.75 }}
          >
            {description}
          </Typography>
        )}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          flexWrap="wrap"
          justifyContent="center"
          useFlexGap
          spacing={1.25}
          sx={{
            mt: 3.5,
            width: { xs: '100%', sm: 'auto' },
            '& .MuiButton-root': { minHeight: 48 },
          }}
        >
          {actions}
        </Stack>
      </Stack>
    </Paper>
  )
}
