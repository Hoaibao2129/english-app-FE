import type { ReactNode } from 'react'
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded'
import { Box, Stack, Typography } from '@mui/material'
import { BrandMark } from '../../../shared/components/BrandMark'
import { LearningAside } from './LearningAside'

interface AuthLayoutProps {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
  footer: ReactNode
}

export function AuthLayout({
  eyebrow,
  title,
  description,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <Box
      component="main"
      sx={{ minHeight: '100svh', bgcolor: 'background.default', p: { lg: 3 } }}
    >
      <Box
        sx={{
          mx: 'auto',
          maxWidth: 1440,
          minHeight: { xs: '100svh', lg: 'calc(100svh - 48px)' },
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: 'minmax(0, 1.03fr) minmax(400px, 0.97fr)',
          },
        }}
      >
        <LearningAside />

        <Box
          component="section"
          aria-labelledby="auth-heading"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: 2.5, sm: 5, lg: 7, xl: 10 },
            py: { xs: 5, lg: 6 },
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 440 }}>
            <Box sx={{ display: { lg: 'none' }, mb: 5.5 }}>
              <BrandMark />
            </Box>

            <Box component="header" sx={{ mb: 4 }}>
              <Typography
                variant="overline"
                component="p"
                color="primary"
                sx={{ mb: 1.5 }}
              >
                {eyebrow}
              </Typography>
              <Typography
                id="auth-heading"
                component="h1"
                sx={{
                  fontSize: { xs: '2rem', sm: '2.35rem' },
                  lineHeight: 1.14,
                  fontWeight: 600,
                  letterSpacing: '-0.05em',
                }}
              >
                {title}
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ mt: 1.5, maxWidth: 390, fontSize: 14, lineHeight: 1.7 }}
              >
                {description}
              </Typography>
            </Box>

            {children}

            <Typography
              component="div"
              color="text.secondary"
              sx={{ mt: 3.5, textAlign: 'center', fontSize: 14 }}
            >
              {footer}
            </Typography>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={1}
              sx={{ mt: 5, color: 'text.secondary' }}
            >
              <VerifiedUserRoundedIcon
                sx={{ fontSize: 16, color: 'primary.light' }}
              />
              <Typography variant="caption">
                Thông tin tài khoản của bạn luôn được bảo mật.
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
