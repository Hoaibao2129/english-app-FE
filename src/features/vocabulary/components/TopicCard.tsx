import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import StyleRoundedIcon from '@mui/icons-material/StyleRounded'
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import {
  Button,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import type { TopicStatus, VocabularyTopic } from '../types/vocabulary'

interface TopicCardProps {
  topic: VocabularyTopic
  on_flashcards: (topic: VocabularyTopic) => void
  on_quiz: (topic: VocabularyTopic) => void
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
}: TopicCardProps) {
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
      <Stack direction="row" justifyContent="space-between" mb={1.4}>
        <Typography variant="body2" color="text.secondary" fontWeight={650}>
          Chủ đề {topic.order}
        </Typography>
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
    </Paper>
  )
}
