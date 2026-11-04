import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded'
import { Box, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { BrandMark } from '../../../shared/components/BrandMark'

const LEARNING_IMAGE = '/images/english-learning.jpg'

export function LearningAside() {
  return (
    <Box
      component="aside"
      aria-label="Giới thiệu Dailly English"
      sx={(theme) => ({
        position: 'relative',
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        overflow: 'hidden',
        minHeight: 'calc(100svh - 48px)',
        borderRadius: '32px',
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        px: { lg: 4, xl: 5 },
        py: { lg: 4, xl: 4.5 },
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          borderRadius: '50%',
          pointerEvents: 'none',
        },
        '&::before': {
          width: 320,
          height: 320,
          top: -96,
          right: -80,
          border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
          bgcolor: alpha(theme.palette.common.white, 0.04),
        },
        '&::after': {
          width: 208,
          height: 208,
          top: '34%',
          right: '22%',
          bgcolor: alpha(theme.palette.common.white, 0.035),
          filter: 'blur(40px)',
        },
      })}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <BrandMark inverted />
      </Box>

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          mt: { lg: 7, xl: 8 },
          maxWidth: 540,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={(theme) => ({
            display: 'inline-flex',
            px: 1.75,
            py: 1,
            borderRadius: '999px',
            border: `1px solid ${alpha(theme.palette.common.white, 0.15)}`,
            bgcolor: alpha(theme.palette.common.white, 0.06),
          })}
        >
          <AutoAwesomeRoundedIcon sx={{ fontSize: 14, color: 'accent.main' }} />
          <Typography
            variant="overline"
            sx={{ letterSpacing: '0.16em', opacity: 0.85 }}
          >
            HỌC TIẾNG ANH MỖI NGÀY
          </Typography>
        </Stack>
        <Typography
          component="h2"
          sx={{
            mt: 3,
            fontSize: { lg: '2.65rem', xl: '3.4rem' },
            lineHeight: 1.08,
            fontWeight: 600,
            letterSpacing: '-0.055em',
          }}
        >
          Mỗi ngày một chút,
          <Box component="span" sx={{ display: 'block', color: 'accent.main' }}>
            tự tin thêm một chút.
          </Box>
        </Typography>
        <Typography
          sx={{ mt: 2.5, maxWidth: 420, lineHeight: 1.75, opacity: 0.75 }}
        >
          Tích lũy vốn từ, luyện nghe và biến tiếng Anh thành thói quen nhỏ bạn
          có thể duy trì mỗi ngày.
        </Typography>
      </Box>

      <Box
        component="figure"
        sx={{
          position: 'relative',
          zIndex: 1,
          mt: 'auto',
          mb: 0,
          mx: 0,
          pt: 4.5,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            height: 275,
            overflow: 'hidden',
            borderRadius: '24px',
          }}
        >
          <Box
            component="img"
            src={LEARNING_IMAGE}
            alt="Một bạn trẻ đang luyện viết tiếng Anh bên cửa sổ quán cà phê."
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 58%',
              display: 'block',
            }}
          />
          <Box
            aria-hidden
            sx={(theme) => ({
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(to top, ${alpha(theme.palette.primary.main, 0.9)}, ${alpha(theme.palette.primary.main, 0.1)} 50%, ${alpha(theme.palette.primary.main, 0.05)})`,
            })}
          />
          <Typography
            component="figcaption"
            sx={{
              position: 'absolute',
              left: 24,
              right: 24,
              bottom: 24,
              maxWidth: 330,
              fontSize: 14,
              lineHeight: 1.7,
              fontWeight: 500,
              color: 'common.white',
            }}
          >
            Học thêm một từ mới. Tự tin nói thêm một câu.
          </Typography>
        </Box>

        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={(theme) => ({
            position: 'absolute',
            top: 56,
            right: 20,
            px: 1.75,
            py: 1.5,
            borderRadius: '16px',
            border: `1px solid ${alpha(theme.palette.common.white, 0.7)}`,
            bgcolor: alpha(theme.palette.background.paper, 0.95),
            color: 'text.primary',
            boxShadow: '0 10px 24px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(8px)',
          })}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              display: 'grid',
              placeItems: 'center',
              bgcolor: 'warning.light',
              color: 'warning.main',
            }}
          >
            <LocalFireDepartmentRoundedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: '0.68rem',
                fontWeight: 500,
                color: 'text.secondary',
              }}
            >
              Chuỗi luyện tập
            </Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              Học đều mỗi ngày
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}
