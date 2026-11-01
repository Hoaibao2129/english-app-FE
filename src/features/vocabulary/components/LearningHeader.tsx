import type { ReactNode } from 'react'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  LinearProgress,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

interface LearningHeaderProps {
  title: string
  current: number
  total: number
  counter_label?: string
  stats?: ReactNode
  action?: ReactNode
}

export function LearningHeader({
  title,
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
      sx={{ borderBottom: 1, borderColor: 'divider' }}
    >
      <Container maxWidth="md">
        <Toolbar disableGutters sx={{ minHeight: { xs: 68, sm: 76 } }}>
          <IconButton
            onClick={() => navigate('/')}
            aria-label="Về trang chủ"
            sx={{ display: { xs: 'inline-flex', sm: 'none' }, mr: 0.5 }}
          >
            <ArrowBackRoundedIcon />
          </IconButton>
          <Button
            color="inherit"
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate('/')}
            sx={{
              display: { xs: 'none', sm: 'inline-flex' },
              mr: 2,
              color: 'text.secondary',
            }}
          >
            Thoát
          </Button>
          <Typography
            fontWeight={750}
            noWrap
            sx={{ minWidth: 0, width: { xs: 120, sm: 180 } }}
          >
            {title}
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            spacing={{ xs: 1, sm: 2 }}
            sx={{ flex: 1, ml: { xs: 1, sm: 2 } }}
          >
            <LinearProgress
              variant="determinate"
              value={total ? (current / total) * 100 : 0}
              sx={{ flex: 1, height: 7, borderRadius: 5 }}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={700}
              whiteSpace="nowrap"
            >
              {counter_label ?? `${current}/${total}`}
            </Typography>
          </Stack>
          {stats && (
            <Box sx={{ display: { xs: 'none', md: 'block' }, ml: 2 }}>
              {stats}
            </Box>
          )}
          {action && (
            <Box sx={{ display: { xs: 'none', sm: 'block' }, ml: 2 }}>
              {action}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  )
}
