import type { ReactNode } from 'react'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import {
  AppBar,
  Box,
  Button,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

interface LearningHeaderProps {
  title: string
  subtitle?: string
  current: number
  total: number
  counter_label?: string
  stats?: ReactNode
  action?: ReactNode
}

export function LearningHeader({
  title,
  subtitle,
  current,
  total,
  counter_label,
  stats,
  action,
}: LearningHeaderProps) {
  const navigate = useNavigate()

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={{ xs: 1.5, sm: 2 }}
        sx={{
          mx: 'auto',
          width: '100%',
          maxWidth: 1152,
          minHeight: { xs: 64, sm: 72 },
          px: { xs: 2, sm: 3 },
          py: 1.5,
        }}
      >
        <Button
          color="inherit"
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => navigate('/')}
          aria-label="Thoát về trang chủ"
          sx={{
            flexShrink: 0,
            px: 1.25,
            color: 'text.secondary',
            '& .MuiButton-startIcon': { mr: { xs: 0, sm: 1 } },
          }}
        >
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
            Thoát
          </Box>
        </Button>
        <Box sx={{ minWidth: 0, width: { xs: 110, sm: 200, lg: 260 } }}>
          <Typography
            noWrap
            sx={{ fontSize: { xs: 14, sm: 16 }, fontWeight: 600 }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              component="p"
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        <LinearProgress
          variant="determinate"
          value={total ? (current / total) * 100 : 0}
          aria-label="Tiến độ lượt học"
          sx={{ flex: 1, minWidth: 64 }}
        />
        <Typography
          variant="body2"
          color="text.secondary"
          fontWeight={600}
          whiteSpace="nowrap"
          sx={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {counter_label ?? `${current}/${total}`}
        </Typography>
        {stats && (
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>{stats}</Box>
        )}
        {action && (
          <Box sx={{ display: { xs: 'none', sm: 'block' }, flexShrink: 0 }}>
            {action}
          </Box>
        )}
      </Stack>
    </AppBar>
  )
}
