import { useEffect, useRef, useState } from 'react'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded'
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { alpha, type Theme } from '@mui/material/styles'
import { useNavigate, useParams } from 'react-router-dom'
import { AnswerOutcome } from '../components/AnswerOutcome'
import { LearningHeader } from '../components/LearningHeader'
import { useStudyDirection } from '../hooks/useStudyDirection'
import { useSubmitAnswer } from '../hooks/useSubmitAnswer'
import { useTopic } from '../hooks/useTopic'
import type { SubmitAnswerResult, VocabularyWord } from '../types/vocabulary'
import { answer_label, prompt_of, speak } from '../utils/direction'
import { pop, reduced_motion, shake, slide_in } from '../utils/motion'

type Outcome = 'correct' | 'wrong' | 'ungraded'

const outcome_of = (result: SubmitAnswerResult | null): Outcome | null =>
  result === null
    ? null
    : result.is_correct === true
      ? 'correct'
      : result.is_correct === false
        ? 'wrong'
        : 'ungraded'

const outcome_color = (theme: Theme, outcome: Outcome | null) =>
  outcome === 'correct'
    ? theme.palette.success.main
    : outcome === 'wrong'
      ? theme.palette.error.main
      : outcome === 'ungraded'
        ? theme.palette.text.secondary
        : theme.palette.primary.main

const face_sx = (theme: Theme, outcome: Outcome | null) => ({
  gridArea: '1 / 1',
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minHeight: { xs: 300, sm: 340 },
  p: { xs: 3, sm: 5 },
  borderRadius: 4,
  border: 2,
  borderColor: outcome
    ? alpha(outcome_color(theme, outcome), 0.5)
    : theme.palette.divider,
  bgcolor: outcome
    ? `color-mix(in srgb, ${outcome_color(theme, outcome)} 5%, ${theme.palette.background.paper})`
    : 'background.paper',
  boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)',
})

const escape_regex = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function HighlightedExample({ example, word }: { example: string; word: string }) {
  const parts = example.split(new RegExp(`(${escape_regex(word)})`, 'gi'))
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === word.toLowerCase() ? (
          <Box component="mark" key={index} sx={{ bgcolor: 'transparent', color: 'primary.main', fontWeight: 700 }}>
            {part}
          </Box>
        ) : (
          part
        ),
      )}
    </>
  )
}

function SpeakButton({ word }: { word: string }) {
  return (
    <IconButton
      color="primary"
      aria-label={`Phát âm ${word}`}
      onClick={() => speak(word)}
      sx={(theme) => ({ bgcolor: alpha(theme.palette.primary.main, 0.08) })}
    >
      <VolumeUpRoundedIcon />
    </IconButton>
  )
}

function CardBack({ word }: { word: VocabularyWord }) {
  return (
    <Stack spacing={2}>
      <Box>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Typography
            variant="h3"
            fontWeight={750}
            sx={{ fontSize: { xs: 32, sm: 42 }, wordBreak: 'break-word' }}
          >
            {word.word}
          </Typography>
          <SpeakButton word={word.word} />
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
          {word.pronunciation && (
            <Typography color="text.secondary" fontSize={17}>
              {word.pronunciation}
            </Typography>
          )}
          {word.part_of_speech && (
            <Chip size="small" label={word.part_of_speech} sx={{ fontWeight: 650 }} />
          )}
        </Stack>
      </Box>
      <Divider />
      <Typography
        variant="h5"
        fontWeight={750}
        color="primary"
        sx={{ fontSize: { xs: 22, sm: 26 } }}
      >
        {word.meaning}
      </Typography>
      {word.example && (
        <Box
          sx={{
            borderLeft: 3,
            borderColor: 'primary.light',
            pl: 2,
            py: 0.5,
          }}
        >
          <Typography fontSize={17} fontStyle="italic">
            “<HighlightedExample example={word.example} word={word.word} />”
          </Typography>
          {word.example_meaning && (
            <Typography color="text.secondary" mt={0.5}>
              {word.example_meaning}
            </Typography>
          )}
        </Box>
      )}
    </Stack>
  )
}

export function FlashcardPage() {
  const { topic_id = '' } = useParams()
  const navigate = useNavigate()
  const { topic, loading, error, reload } = useTopic(topic_id)
  const [direction] = useStudyDirection()
  const { grading, failed, result, submit, clear } = useSubmitAnswer(
    'flashcard',
    direction,
  )
  const [word_index, set_word_index] = useState(0)
  const [answer_input, set_answer_input] = useState('')
  const [finished, set_finished] = useState(false)
  const [tally, set_tally] = useState({ correct: 0, wrong: 0, ungraded: 0 })
  const last_answer = useRef('')

  useEffect(() => {
    set_word_index(0)
    set_answer_input('')
    set_finished(false)
    set_tally({ correct: 0, wrong: 0, ungraded: 0 })
    clear()
  }, [topic_id, clear])

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !topic || !topic.words.length) {
    return (
      <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight={750}>
          {error ? 'Không kết nối được máy chủ' : 'Chưa có dữ liệu cho chủ đề này'}
        </Typography>
        <Stack direction="row" justifyContent="center" spacing={1.5} mt={3}>
          {error && (
            <Button variant="outlined" onClick={reload}>
              Thử lại
            </Button>
          )}
          <Button onClick={() => navigate('/')}>Về trang chủ</Button>
        </Stack>
      </Container>
    )
  }

  const word = topic.words[word_index]
  const is_last = word_index === topic.words.length - 1
  const remaining = topic.words.length - word_index - 1
  const answered = result !== null
  const outcome = outcome_of(result)

  const run = async (answer: string) => {
    last_answer.current = answer
    const graded: SubmitAnswerResult | null = await submit(word.id, answer)
    if (!graded) return
    set_tally((current) =>
      graded.is_correct === true
        ? { ...current, correct: current.correct + 1 }
        : graded.is_correct === false
          ? { ...current, wrong: current.wrong + 1 }
          : { ...current, ungraded: current.ungraded + 1 },
    )
  }

  const handle_check = () => {
    if (grading || answered || !answer_input.trim()) return
    void run(answer_input.trim())
  }

  const handle_skip = () => {
    if (grading || answered) return
    void run('')
  }

  const handle_next = () => {
    clear()
    set_answer_input('')
    if (is_last) set_finished(true)
    else set_word_index((index) => index + 1)
  }

  const restart = () => {
    set_word_index(0)
    set_answer_input('')
    set_finished(false)
    set_tally({ correct: 0, wrong: 0, ungraded: 0 })
    clear()
  }

  const prompt = prompt_of(word, direction)

  return (
    <Box
      sx={(theme) => ({
        minHeight: '100vh',
        bgcolor: 'background.default',
        backgroundImage: `radial-gradient(circle at 15% 10%, ${alpha(theme.palette.primary.main, 0.08)}, transparent 40%), radial-gradient(circle at 85% 90%, ${alpha(theme.palette.secondary.main, 0.06)}, transparent 40%)`,
      })}
    >
      <LearningHeader
        title={topic.title}
        current={finished ? topic.words.length : word_index + 1}
        total={topic.words.length}
        counter_label={`Từ ${finished ? topic.words.length : word_index + 1}/${topic.words.length}`}
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

      <Container maxWidth="sm" component="main" sx={{ py: { xs: 3, sm: 6 } }}>
        {finished ? (
          <Paper
            variant="outlined"
            sx={{ p: { xs: 3, sm: 6 }, borderRadius: 4, textAlign: 'center' }}
          >
            <CheckCircleOutlineRoundedIcon
              color="success"
              sx={{ fontSize: 72 }}
            />
            <Typography variant="h4" fontWeight={750} mt={2}>
              Hoàn thành lượt học!
            </Typography>
            <Typography color="text.secondary" mt={1}>
              {tally.correct} đúng · {tally.wrong} sai
            </Typography>
            {tally.ungraded > 0 && (
              <Typography color="text.secondary" variant="body2" mt={0.5}>
                {tally.ungraded} chưa chấm được
              </Typography>
            )}
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
            {/* Deck: the cards peeking out behind show how many words remain. */}
            <Box
              sx={(theme) => ({
                position: 'relative',
                mb: remaining > 0 ? 3 : 0,
                '&::before, &::after': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 4,
                  border: 2,
                  borderColor: theme.palette.divider,
                  bgcolor: 'background.paper',
                },
                '&::before': {
                  display: remaining > 1 ? 'block' : 'none',
                  transform: 'translateY(22px) scale(0.92)',
                  opacity: 0.5,
                },
                '&::after': {
                  display: remaining > 0 ? 'block' : 'none',
                  transform: 'translateY(11px) scale(0.96)',
                  opacity: 0.8,
                },
              })}
            >
              {/* Keyed by word so a new card mounts face-up instead of flipping back and leaking its answer. */}
              <Box
                key={word.id}
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  perspective: 1400,
                  animation: `${slide_in} 0.35s ease-out`,
                  ...reduced_motion,
                }}
              >
                <Box
                  sx={{
                    animation:
                      outcome === 'wrong'
                        ? `${shake} 0.5s ease-in-out 0.45s`
                        : outcome === 'correct'
                          ? `${pop} 0.4s ease-out 0.45s`
                          : 'none',
                    ...reduced_motion,
                  }}
                >
                  <Box
                    sx={{
                      display: 'grid',
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)',
                      transform: answered ? 'rotateY(180deg)' : 'none',
                      ...reduced_motion,
                    }}
                  >
                    <Box
                      inert={answered}
                      sx={(theme) => ({
                        ...face_sx(theme, null),
                        alignItems: 'center',
                        textAlign: 'center',
                        gap: 2,
                      })}
                    >
                      <Chip
                        size="small"
                        color="primary"
                        variant="outlined"
                        label={word.part_of_speech ?? 'từ vựng'}
                        sx={{ fontWeight: 650 }}
                      />
                      <Typography
                        variant="h2"
                        fontWeight={750}
                        sx={{ fontSize: { xs: 42, sm: 56 }, wordBreak: 'break-word' }}
                      >
                        {prompt}
                      </Typography>
                      {direction === 'en_vi' && (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          {word.pronunciation && (
                            <Typography color="text.secondary" fontSize={18}>
                              {word.pronunciation}
                            </Typography>
                          )}
                          <SpeakButton word={word.word} />
                        </Stack>
                      )}
                    </Box>
                    <Box
                      inert={!answered}
                      sx={(theme) => ({
                        ...face_sx(theme, outcome),
                        transform: 'rotateY(180deg)',
                      })}
                    >
                      <CardBack word={word} />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: 4 }}>
              <TextField
                fullWidth
                autoFocus
                key={word.id}
                placeholder={`${answer_label(direction)}…`}
                slotProps={{ htmlInput: { 'aria-label': answer_label(direction) } }}
                value={answer_input}
                disabled={grading || answered}
                onChange={(event) => set_answer_input(event.target.value)}
                onKeyDown={(event) => {
                  if (event.nativeEvent.isComposing || event.keyCode === 229) return
                  if (event.key === 'Enter') handle_check()
                  if (event.key === 'Escape') handle_skip()
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'background.paper',
                    borderRadius: 3,
                    fontSize: { xs: 18, sm: 22 },
                  },
                  '& input': { textAlign: 'center', py: 2 },
                }}
              />
              {!answered && !grading && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  component="p"
                  textAlign="center"
                  mt={1}
                  sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                  Nhấn <b>Enter</b> để kiểm tra · <b>Esc</b> để bỏ qua
                </Typography>
              )}
              <AnswerOutcome
                grading={grading}
                failed={failed}
                result={result}
                on_retry={() => void run(last_answer.current)}
              />
              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={1.5}
                mt={3}
              >
                {answered ? (
                  <Box />
                ) : (
                  <Button disabled={grading} onClick={handle_skip}>
                    Bỏ qua
                  </Button>
                )}
                {answered ? (
                  <Button
                    autoFocus
                    size="large"
                    variant="contained"
                    color={outcome === 'correct' ? 'success' : 'primary'}
                    endIcon={<ArrowForwardRoundedIcon />}
                    onClick={handle_next}
                    sx={{ px: 4 }}
                  >
                    {is_last ? 'Xem kết quả' : 'Tiếp'}
                  </Button>
                ) : (
                  <Button
                    size="large"
                    variant="contained"
                    disabled={grading || !answer_input.trim()}
                    onClick={handle_check}
                    sx={{ px: 4 }}
                  >
                    Kiểm tra
                  </Button>
                )}
              </Stack>
            </Box>
          </>
        )}
      </Container>
    </Box>
  )
}
