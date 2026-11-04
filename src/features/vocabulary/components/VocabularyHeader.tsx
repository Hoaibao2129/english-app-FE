import AutoStoriesRoundedIcon from '@mui/icons-material/AutoStoriesRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded'
import {
  AppBar,
  Box,
  Button,
  IconButton,
  LinearProgress,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import type { Direction } from '../types/vocabulary'

interface VocabularyHeaderProps {
  learned_words: number
  total_words: number
  direction: Direction
  on_direction_change: (direction: Direction) => void
  on_reset: () => void
  on_menu_click: () => void
}

export function VocabularyHeader({
  learned_words,
  total_words,
  direction,
  on_direction_change,
  on_reset,
  on_menu_click,
}: VocabularyHeaderProps) {
  const progress = total_words ? (learned_words / total_words) * 100 : 0

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={(theme) => ({
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: alpha(theme.palette.background.default, 0.95),
        backdropFilter: 'blur(8px)',
      })}
    >
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        alignItems={{ xs: 'stretch', lg: 'center' }}
        justifyContent="space-between"
        spacing={2}
        sx={{ px: { xs: 2, sm: 3, lg: 3.5 }, py: 2 }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.75}
          sx={{ minWidth: 0 }}
        >
          <IconButton
            onClick={on_menu_click}
            aria-label="Mở menu"
            sx={{
              display: { xs: 'inline-flex', md: 'none' },
              border: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <MenuRoundedIcon />
          </IconButton>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '16px',
              bgcolor: 'secondary.main',
              color: 'primary.main',
              display: { xs: 'none', sm: 'grid' },
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            <AutoStoriesRoundedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              component="h1"
              noWrap
              sx={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.035em' }}
            >
              1000 từ vựng cơ bản
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              Học từng chút, tiến bộ mỗi ngày
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          flexWrap="wrap"
          useFlexGap
          spacing={{ xs: 1.5, sm: 2 }}
        >
          <Box sx={{ width: { xs: '100%', sm: 170 } }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="baseline"
              mb={1}
            >
              <Typography variant="caption" color="text.secondary">
                Tiến độ
              </Typography>
              <Typography
                variant="caption"
                fontWeight={600}
                sx={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {learned_words}
                <Box
                  component="span"
                  sx={{ fontWeight: 400, color: 'text.secondary' }}
                >
                  /{total_words}
                </Box>
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={progress}
              aria-label="Tiến độ toàn bộ từ vựng"
            />
          </Box>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={direction}
            aria-label="Chọn hướng luyện tập"
            onChange={(_, next: Direction | null) => {
              if (next) on_direction_change(next)
            }}
          >
            <ToggleButton value="en_vi" sx={{ whiteSpace: 'nowrap' }}>
              Anh → Việt
            </ToggleButton>
            <ToggleButton value="vi_en" sx={{ whiteSpace: 'nowrap' }}>
              Việt → Anh
            </ToggleButton>
          </ToggleButtonGroup>
          <Button
            color="inherit"
            onClick={on_reset}
            startIcon={<RestartAltRoundedIcon />}
            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
          >
            Đặt lại
          </Button>
        </Stack>
      </Stack>
    </AppBar>
  )
}
