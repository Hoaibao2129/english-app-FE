import { useState } from 'react'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import StyleRoundedIcon from '@mui/icons-material/StyleRounded'
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import {
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
  { label: string; color: 'default' | 'primary' | 'success' }
> = {
  'not_started': { label: 'Chưa học', color: 'default' },
  'in_progress': { label: 'Đang học', color: 'primary' },
  completed: { label: 'Hoàn thành', color: 'success' },
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
      variant="outlined"
      sx={{
        p: 2.5,
        minHeight: 190,
        borderRadius: 2.5,
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)',
        transition: 'transform 160ms ease, box-shadow 160ms ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 22px rgba(15, 23, 42, 0.09)',
        },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={1.4}
      >
        <Typography variant="body2" color="text.secondary" fontWeight={650}>
          Chủ đề {topic.order}
        </Typography>
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          sx={{ mr: status === 'not_started' ? 0 : -1 }}
        >
          <Chip
            size="small"
            color={status_info.color}
            label={status_info.label}
            icon={
              status === 'completed' ? (
                <CheckCircleRoundedIcon />
              ) : status === 'in_progress' ? (
                <PlayArrowRoundedIcon />
              ) : undefined
            }
            sx={{ height: 23, fontWeight: 650 }}
          />
          {status !== 'not_started' && (
            <IconButton
              size="small"
              aria-label={`Tùy chọn chủ đề ${topic.title}`}
              onClick={(event) => set_menu_anchor(event.currentTarget)}
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

      <Typography fontSize={17} fontWeight={750} lineHeight={1.35}>
        {topic.title}
      </Typography>
      <Typography color="text.secondary" mb={2.25}>
        {topic.title_vi}
      </Typography>

      <Stack direction="row" alignItems="center" spacing={1} mb={0.75}>
        <LinearProgress
          variant="determinate"
          value={progress}
          color={status === 'completed' ? 'success' : 'primary'}
          sx={{ flex: 1, height: 6, borderRadius: 10 }}
        />
        <Typography variant="body2" color="text.secondary" fontWeight={700}>
          {topic.correct}/{topic.total_words}
        </Typography>
      </Stack>
      <Typography variant="caption" color="text.secondary" display="block" mb={2}>
        {topic.correct} đúng · {topic.wrong} sai · {topic.not_started} chưa học
      </Typography>

      <Stack direction="row" spacing={1}>
        <Button
          fullWidth
          size="small"
          variant="contained"
          startIcon={<StyleRoundedIcon />}
          onClick={() => on_flashcards(topic)}
        >
          Học thẻ
        </Button>
        <Button
          fullWidth
          size="small"
          variant="outlined"
          startIcon={<QuizOutlinedIcon />}
          onClick={() => on_quiz(topic)}
        >
          Quiz
        </Button>
      </Stack>
      {topic.wrong > 0 && (
        <Button
          fullWidth
          size="small"
          variant="outlined"
          color="error"
          startIcon={<ReplayRoundedIcon />}
          onClick={() => on_review(topic)}
          sx={{ mt: 1 }}
        >
          Học lại {topic.wrong} từ sai
        </Button>
      )}
    </Paper>
  )
}
