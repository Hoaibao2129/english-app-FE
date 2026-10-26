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
  onFlashcards: (topic: VocabularyTopic) => void
  onQuiz: (topic: VocabularyTopic) => void
}

const statusConfig: Record<
  TopicStatus,
  { label: string; color: 'default' | 'primary' | 'success' }
> = {
  'not-started': { label: 'Chưa học', color: 'default' },
  'in-progress': { label: 'Đang học', color: 'primary' },
  completed: { label: 'Hoàn thành', color: 'success' },
}

export function TopicCard({
  topic,
  onFlashcards,
  onQuiz,
}: TopicCardProps) {
  const status: TopicStatus =
    topic.learnedWords === 0
      ? 'not-started'
      : topic.learnedWords >= topic.totalWords
        ? 'completed'
        : 'in-progress'
  const statusInfo = statusConfig[status]
  const progress = (topic.learnedWords / topic.totalWords) * 100

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
          Chủ đề {topic.id}
        </Typography>
        <Chip
          size="small"
          color={statusInfo.color}
          label={statusInfo.label}
          icon={
            status === 'completed' ? (
              <CheckCircleRoundedIcon />
            ) : status === 'in-progress' ? (
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
        {topic.titleVi}
      </Typography>

      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <LinearProgress
          variant="determinate"
          value={progress}
          color={status === 'completed' ? 'success' : 'primary'}
          sx={{ flex: 1, height: 6, borderRadius: 10 }}
        />
        <Typography variant="body2" color="text.secondary" fontWeight={700}>
          {topic.learnedWords}/{topic.totalWords}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1}>
        <Button
          fullWidth
          size="small"
          variant="contained"
          startIcon={<StyleRoundedIcon />}
          onClick={() => onFlashcards(topic)}
        >
          Học thẻ
        </Button>
        <Button
          fullWidth
          size="small"
          variant="outlined"
          startIcon={<QuizOutlinedIcon />}
          onClick={() => onQuiz(topic)}
        >
          Quiz
        </Button>
      </Stack>
    </Paper>
  )
}
