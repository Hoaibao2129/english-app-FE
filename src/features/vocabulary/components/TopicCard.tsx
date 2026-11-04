import { useState } from 'react'
import type { ReactElement } from 'react'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import RadioButtonCheckedRoundedIcon from '@mui/icons-material/RadioButtonCheckedRounded'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded'
import StyleRoundedIcon from '@mui/icons-material/StyleRounded'
import {
  Box,
  Button,
  Chip,
  IconButton,
  LinearProgress,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import type { TopicStatus, VocabularyTopic } from '../types/vocabulary'

interface TopicCardProps {
  topic: VocabularyTopic
  on_flashcards: (topic: VocabularyTopic) => void
  on_quiz: (topic: VocabularyTopic) => void
  on_review: (topic: VocabularyTopic) => void
  on_reset: (topic: VocabularyTopic) => void
}

const status_config: Record<
  TopicStatus,
  { label: string; icon: ReactElement; bgcolor: string; color: string }
> = {
  not_started: {
    label: 'Chưa học',
    icon: <RadioButtonCheckedRoundedIcon />,
    bgcolor: 'background.muted',
    color: 'text.secondary',
  },
  in_progress: {
    label: 'Đang học',
    icon: <PlayArrowRoundedIcon />,
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
  },
  completed: {
    label: 'Hoàn thành',
    icon: <CheckRoundedIcon />,
    bgcolor: 'success.main',
    color: 'success.contrastText',
  },
}

export function TopicCard({
  topic,
  on_flashcards,
  on_quiz,
  on_review,
  on_reset,
}: TopicCardProps) {
  const [menu_anchor, set_menu_anchor] = useState<HTMLElement | null>(null)
  const { status } = topic
  const status_info = status_config[status]
  const progress = topic.total_words
    ? (topic.correct / topic.total_words) * 100
    : 0

  return (
    <Paper
      component="article"
      variant="outlined"
      sx={{
        p: 2.5,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        boxShadow: '0 1px 3px rgba(15, 36, 24, 0.05)',
        transition: 'transform 200ms ease, box-shadow 200ms ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 12px 28px rgba(15, 36, 24, 0.08)',
        },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={1.5}
        sx={{ minHeight: 32 }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontWeight: 600, letterSpacing: '0.12em' }}
        >
          CHỦ ĐỀ {String(topic.order).padStart(2, '0')}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <Chip
            size="small"
            label={status_info.label}
            icon={status_info.icon}
            sx={{
              height: 28,
              px: 0.5,
              fontSize: 12,
              bgcolor: status_info.bgcolor,
              color: status_info.color,
              '& .MuiChip-icon': { color: 'inherit', fontSize: 14 },
            }}
          />
          {status !== 'not_started' && (
            <IconButton
              size="small"
              aria-label={`Tùy chọn chủ đề ${topic.title}`}
              onClick={(event) => set_menu_anchor(event.currentTarget)}
              sx={{ color: 'text.secondary' }}
            >
              <MoreVertRoundedIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
        <Menu
          anchorEl={menu_anchor}
          open={menu_anchor !== null}
          onClose={() => set_menu_anchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{ paper: { sx: { borderRadius: '12px', minWidth: 224 } } }}
        >
          <MenuItem
            onClick={() => {
              set_menu_anchor(null)
              on_reset(topic)
            }}
          >
            <ListItemIcon>
              <RestartAltRoundedIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Reset, học lại từ đầu</ListItemText>
          </MenuItem>
        </Menu>
      </Stack>

      <Box sx={{ mt: 2, minHeight: 72 }}>
        <Typography
          component="h3"
          sx={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em' }}
        >
          {topic.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          {topic.title_vi}
        </Typography>
      </Box>

      <Box sx={{ mt: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" mb={1}>
          <Typography variant="body2" color="text.secondary">
            Tiến độ
          </Typography>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {topic.correct}/{topic.total_words}
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={progress}
          color={status === 'completed' ? 'success' : 'primary'}
          aria-label={`Tiến độ ${topic.title}`}
        />
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          mt={1.25}
        >
          {topic.correct} đúng · {topic.wrong} sai · {topic.not_started} chưa
          học
        </Typography>
      </Box>

      <Stack spacing={1.25} sx={{ mt: 'auto', pt: 2.5 }}>
        <Stack direction="row" spacing={1}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<StyleRoundedIcon />}
            onClick={() => on_flashcards(topic)}
          >
            Học thẻ
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<HelpOutlineRoundedIcon />}
            onClick={() => on_quiz(topic)}
          >
            Quiz
          </Button>
        </Stack>
        {topic.wrong > 0 && (
          <Button
            fullWidth
            variant="outlined"
            startIcon={<ReplayRoundedIcon />}
            onClick={() => on_review(topic)}
            sx={{
              borderColor: (theme) => alpha(theme.palette.primary.main, 0.35),
              '&:hover': { bgcolor: 'secondary.main' },
            }}
          >
            Học lại {topic.wrong} từ sai
          </Button>
        )}
      </Stack>
    </Paper>
  )
}
