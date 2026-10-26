import { useEffect, useState } from 'react'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { LearningHeader } from '../components/LearningHeader'
import { useTopic } from '../hooks/useTopic'

export function FlashcardPage() {
  const { topicId = '' } = useParams()
  const navigate = useNavigate()
  const { topic, loading, updateProgress } = useTopic(Number(topicId))
  const [wordIndex, setWordIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [finished, setFinished] = useState(false)
  const [knownWords, setKnownWords] = useState<Set<number>>(new Set())

  useEffect(() => {
    setWordIndex(0)
    setFlipped(false)
    setFinished(false)
    setKnownWords(new Set())
  }, [topicId])

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!topic || !topic.words.length) {
    return (
      <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight={750}>
          Chưa có dữ liệu cho chủ đề này
        </Typography>
        <Typography color="text.secondary" mt={1}>
          Dữ liệu sẽ hiển thị tại đây sau khi kết nối backend.
        </Typography>
        <Button onClick={() => navigate('/')} sx={{ mt: 3 }}>
          Về trang chủ
        </Button>
      </Container>
    )
  }

  const word = topic.words[wordIndex]

  const goToWord = (index: number) => {
    setWordIndex(index)
    setFlipped(false)
  }

  const handleAnswer = (known: boolean) => {
    if (known && !knownWords.has(word.id)) {
      const nextKnownWords = new Set(knownWords).add(word.id)
      setKnownWords(nextKnownWords)
      updateProgress(topic.learnedWords + 1)
    }

    if (wordIndex === topic.words.length - 1) {
      setFinished(true)
    } else {
      goToWord(wordIndex + 1)
    }
  }

  const restart = () => {
    setWordIndex(0)
    setFlipped(false)
    setFinished(false)
    setKnownWords(new Set())
  }

  const speak = () => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(word.word))
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <LearningHeader
        title={topic.title}
        current={finished ? topic.words.length : wordIndex + 1}
        total={topic.words.length}
        counterLabel={`Từ ${finished ? topic.words.length : wordIndex + 1}/${topic.words.length}`}
        action={
          <Button
            variant="outlined"
            startIcon={<QuizOutlinedIcon />}
            onClick={() => navigate(`/topics/${topic.id}/quiz`)}
          >
            Làm quiz chủ đề
          </Button>
        }
      />

      <Container maxWidth="md" component="main" sx={{ py: { xs: 3, sm: 6 } }}>
        {finished ? (
          <Paper
            variant="outlined"
            sx={{ p: { xs: 3, sm: 6 }, borderRadius: 3, textAlign: 'center' }}
          >
            <CheckCircleOutlineRoundedIcon
              color="success"
              sx={{ fontSize: 72 }}
            />
            <Typography variant="h4" fontWeight={750} mt={2}>
              Hoàn thành lượt học!
            </Typography>
            <Typography color="text.secondary" mt={1}>
              Bạn đã ghi nhớ {knownWords.size}/{topic.words.length} từ trong
              lượt này.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="center"
              spacing={1.5}
              mt={4}
            >
              <Button
                variant="outlined"
                startIcon={<ReplayRoundedIcon />}
                onClick={restart}
              >
                Học lại
              </Button>
              <Button
                variant="contained"
                startIcon={<QuizOutlinedIcon />}
                onClick={() => navigate(`/topics/${topic.id}/quiz`)}
              >
                Làm quiz
              </Button>
            </Stack>
          </Paper>
        ) : (
          <>
            <Paper
              component="button"
              type="button"
              onClick={() => setFlipped((value) => !value)}
              variant="outlined"
              sx={{
                width: '100%',
                minHeight: { xs: 350, sm: 410 },
                p: { xs: 3, sm: 5 },
                borderRadius: 3,
                borderColor: flipped ? 'primary.light' : 'divider',
                bgcolor: flipped ? '#F5F5FF' : 'background.paper',
                cursor: 'pointer',
                color: 'text.primary',
                display: 'grid',
                placeItems: 'center',
                boxShadow: '0 12px 35px rgba(15, 23, 42, 0.07)',
              }}
            >
              <Stack alignItems="center" spacing={2}>
                {flipped ? (
                  <>
                    <Typography
                      variant="h3"
                      fontWeight={750}
                      sx={{ fontSize: { xs: 36, sm: 48 } }}
                    >
                      {word.meaning}
                    </Typography>
                    <Typography fontSize={18}>{word.example}</Typography>
                    <Typography color="text.secondary">
                      {word.exampleMeaning}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Chip
                      size="small"
                      label={word.partOfSpeech ?? 'từ vựng'}
                      sx={{ fontWeight: 650 }}
                    />
                    <Typography
                      variant="h2"
                      fontWeight={750}
                      sx={{ fontSize: { xs: 46, sm: 60 } }}
                    >
                      {word.word}
                    </Typography>
                    <Stack direction="row" alignItems="center">
                      <Typography color="text.secondary" fontSize={18}>
                        {word.pronunciation}
                      </Typography>
                      <IconButton
                        color="primary"
                        aria-label={`Phát âm ${word.word}`}
                        onClick={(event) => {
                          event.stopPropagation()
                          speak()
                        }}
                      >
                        <VolumeUpRoundedIcon />
                      </IconButton>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      Chạm vào thẻ để xem nghĩa
                    </Typography>
                  </>
                )}
              </Stack>
            </Paper>

            <Stack direction="row" justifyContent="space-between" mt={2}>
              <Button
                startIcon={<ArrowBackRoundedIcon />}
                disabled={wordIndex === 0}
                onClick={() => goToWord(wordIndex - 1)}
              >
                Trước
              </Button>
              <Button
                endIcon={<ArrowForwardRoundedIcon />}
                disabled={wordIndex === topic.words.length - 1}
                onClick={() => goToWord(wordIndex + 1)}
              >
                Tiếp
              </Button>
            </Stack>

            <Stack direction="row" spacing={1.5} mt={3}>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                startIcon={<CloseRoundedIcon />}
                onClick={() => handleAnswer(false)}
                sx={{ py: 1.4 }}
              >
                Chưa nhớ
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="success"
                startIcon={<CheckCircleOutlineRoundedIcon />}
                onClick={() => handleAnswer(true)}
                sx={{ py: 1.4 }}
              >
                Đã nhớ
              </Button>
            </Stack>
          </>
        )}
      </Container>
    </Box>
  )
}
