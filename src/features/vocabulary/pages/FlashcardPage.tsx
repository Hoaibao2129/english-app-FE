import { useEffect, useMemo, useRef, useState } from 'react'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { alpha, type Theme } from '@mui/material/styles'
import { useNavigate, useParams } from 'react-router-dom'
import { AccentChip } from '../components/AccentChip'
import { AnswerOutcome } from '../components/AnswerOutcome'
import { CompletionCard } from '../components/CompletionCard'
import { LearningHeader } from '../components/LearningHeader'
import { useKeyboardOpen } from '../hooks/useKeyboardOpen'
import { useStudyDirection } from '../hooks/useStudyDirection'
import { useSubmitAnswer } from '../hooks/useSubmitAnswer'
import { useTopic } from '../hooks/useTopic'
import type { SubmitAnswerResult, VocabularyWord } from '../types/vocabulary'
import { shuffle } from '../utils/createQuiz'
import {
  answer_label,
  direction_label,
  prompt_of,
  speak,
} from '../utils/direction'
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

// compact: the on-screen keyboard is up, so the card shrinks to stay visible above it.
const face_sx = (theme: Theme, outcome: Outcome | null, compact: boolean) => ({
  gridArea: '1 / 1',
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minHeight: compact ? 0 : { xs: 300, sm: 430 },
  p: compact ? 2 : { xs: 3, sm: 6 },
  borderRadius: { xs: '32px', sm: '40px' },
  border: 2,
  borderColor: outcome
    ? alpha(outcome_color(theme, outcome), 0.5)
    : theme.palette.divider,
  bgcolor: outcome
    ? `color-mix(in srgb, ${outcome_color(theme, outcome)} 5%, ${theme.palette.background.paper})`
    : 'background.paper',
  boxShadow: '0 18px 42px rgba(15, 36, 24, 0.07)',
})

const escape_regex = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function HighlightedExample({
  example,
  word,
}: {
  example: string
  word: string
}) {
  const parts = example.split(new RegExp(`(${escape_regex(word)})`, 'gi'))
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === word.toLowerCase() ? (
          <Box
            component="mark"
            key={index}
            sx={{
              bgcolor: 'transparent',
              color: 'primary.main',
              fontWeight: 700,
            }}
          >
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
      sx={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        bgcolor: 'secondary.main',
        '&:hover': { bgcolor: 'secondary.main', opacity: 0.85 },
      }}
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
            sx={{ fontSize: { xs: 32, sm: 44 }, wordBreak: 'break-word' }}
          >
            {word.word}
          </Typography>
          <SpeakButton word={word.word} />
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
          {word.pronunciation && (
            <Typography
              color="text.secondary"
              fontSize={17}
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            >
              {word.pronunciation}
            </Typography>
          )}
          {word.part_of_speech && (
            <Chip
              size="small"
              label={word.part_of_speech}
              sx={{ fontWeight: 650 }}
            />
          )}
        </Stack>
      </Box>
      <Divider />
      <Typography
        variant="h5"
        color="primary"
        sx={{ fontSize: { xs: 24, sm: 30 } }}
      >
        {word.meaning}
      </Typography>
      {word.example && (
        <Box
          sx={{
            borderLeft: 3,
            borderColor: 'accent.main',
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

/**
 * Flashcards cover only words not yet studied; review covers only words last
 * answered wrong (a correct answer marks them learned). Both run shuffled.
 */
export function FlashcardPage({ review = false }: { review?: boolean }) {
  const { topic_id = '' } = useParams()
  const navigate = useNavigate()
  const { topic, loading, error, reload } = useTopic(topic_id, review)
  const [direction] = useStudyDirection()
  const { grading, failed, result, submit, clear } = useSubmitAnswer(
    review ? 'review' : 'flashcard',
    direction,
  )
  const [word_index, set_word_index] = useState(0)
  const [answer_input, set_answer_input] = useState('')
  const [finished, set_finished] = useState(false)
  const [tally, set_tally] = useState({ correct: 0, wrong: 0, ungraded: 0 })
  const last_answer = useRef('')
  const input_ref = useRef<HTMLInputElement>(null)
  // Shuffled once per fetch so the order stays put while answering.
  const deck = useMemo(
    () =>
      topic
        ? shuffle(
            review
              ? topic.words
              : topic.words.filter((w) => w.status === 'new'),
          )
        : [],
    [topic, review],
  )
  const keyboard_open = useKeyboardOpen()
  // Touch devices: don't pop the keyboard over a card the learner hasn't read yet.
  const is_touch = useMediaQuery('(hover: none) and (pointer: coarse)', {
    noSsr: true,
  })

  // iOS scrolls the page to keep the input above the keyboard, pushing the card
  // under the sticky header. Once the card has compacted, bring it back into view.
  useEffect(() => {
    if (!keyboard_open) return
    const frame = requestAnimationFrame(() => {
      window.scrollTo({ top: 0 })
      const input = input_ref.current
      const viewport = window.visualViewport
      if (
        input &&
        viewport &&
        input.getBoundingClientRect().bottom > viewport.height
      ) {
        input.scrollIntoView({ block: 'end' })
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [keyboard_open])

  useEffect(() => {
    set_word_index(0)
    set_answer_input('')
    set_finished(false)
    set_tally({ correct: 0, wrong: 0, ungraded: 0 })
    clear()
  }, [topic_id, review, clear])

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (topic && !error && topic.words.length && !deck.length) {
    return (
      <Box
        component="main"
        sx={{
          minHeight: '100svh',
          display: 'grid',
          placeItems: 'center',
          px: 2,
          py: 5,
          bgcolor: 'background.default',
        }}
      >
        <CompletionCard
          title={
            review ? 'Không còn từ nào cần học lại' : 'Bạn đã học hết từ mới'
          }
          description={
            review
              ? `Bạn đã trả lời đúng hết các từ của chủ đề ${topic.title}.`
              : topic.wrong > 0
                ? `Còn ${topic.wrong} từ sai trong chủ đề ${topic.title}, hãy học lại nhé.`
                : `Bạn đã hoàn thành chủ đề ${topic.title}.`
          }
          actions={
            <>
              <Button onClick={() => navigate('/')}>Về trang chủ</Button>
              {!review && topic.wrong > 0 && (
                <Button
                  variant="outlined"
                  startIcon={<ReplayRoundedIcon />}
                  onClick={() => navigate(`/topics/${topic.id}/review`)}
                >
                  Học lại {topic.wrong} từ sai
                </Button>
              )}
              <Button
                variant="contained"
                startIcon={<HelpOutlineRoundedIcon />}
                onClick={() => navigate(`/topics/${topic.id}/quiz`)}
              >
                Làm quiz
              </Button>
            </>
          }
        />
      </Box>
    )
  }

  if (error || !topic || !topic.words.length) {
    return (
      <Container maxWidth="sm" sx={{ py: 12 }}>
        <Alert
          severity={error ? 'error' : 'info'}
          action={
            error && (
              <Button color="inherit" size="small" onClick={reload}>
                Thử lại
              </Button>
            )
          }
        >
          {error
            ? 'Không kết nối được máy chủ'
            : 'Chưa có dữ liệu cho chủ đề này'}
        </Alert>
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button onClick={() => navigate('/')}>Về trang chủ</Button>
        </Box>
      </Container>
    )
  }

  const word = deck[word_index]
  const is_last = word_index === deck.length - 1
  const remaining = deck.length - word_index - 1
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
    // Refetch so words answered this round drop out of the next deck.
    reload()
  }

  const prompt = prompt_of(word, direction)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <LearningHeader
        title={topic.title}
        subtitle={review ? 'Ôn tập từ vựng' : direction_label(direction)}
        current={finished ? deck.length : word_index + 1}
        total={deck.length}
        counter_label={`Từ ${finished ? deck.length : word_index + 1}/${deck.length}`}
        action={
          <Button
            variant="outlined"
            startIcon={<HelpOutlineRoundedIcon />}
            onClick={() => navigate(`/topics/${topic.id}/quiz`)}
          >
            Luyện tập chủ đề
          </Button>
        }
      />

      <Container
        maxWidth="md"
        component="main"
        sx={{ py: keyboard_open ? 1.5 : { xs: 4, sm: 6, lg: 8 } }}
      >
        {finished ? (
          <CompletionCard
            title={review ? 'Hoàn thành lượt học lại!' : 'Hoàn thành lượt học!'}
            description={
              <>
                {tally.correct} đúng · {tally.wrong} sai
                {tally.ungraded > 0 && ` · ${tally.ungraded} chưa chấm được`}
              </>
            }
            actions={
              review ? (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<HomeRoundedIcon />}
                    onClick={() => navigate('/')}
                  >
                    Trang chủ
                  </Button>
                  {tally.wrong > 0 && (
                    <Button
                      variant="contained"
                      startIcon={<ReplayRoundedIcon />}
                      onClick={restart}
                    >
                      Học lại {tally.wrong} từ sai
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<ReplayRoundedIcon />}
                    onClick={restart}
                  >
                    Học tiếp
                  </Button>
                  {tally.wrong > 0 && (
                    <Button
                      variant="outlined"
                      startIcon={<ReplayRoundedIcon />}
                      onClick={() => navigate(`/topics/${topic.id}/review`)}
                    >
                      Học lại {tally.wrong} từ sai
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    startIcon={<HelpOutlineRoundedIcon />}
                    onClick={() => navigate(`/topics/${topic.id}/quiz`)}
                  >
                    Làm quiz
                  </Button>
                </>
              )
            }
          />
        ) : (
          <>
            {/* Deck: the cards peeking out behind show how many words remain. */}
            <Box
              sx={(theme) => ({
                position: 'relative',
                mb: remaining > 0 && !keyboard_open ? 3 : 0,
                '&::before, &::after': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  borderRadius: { xs: '32px', sm: '40px' },
                  border: 1,
                  borderColor: theme.palette.divider,
                  bgcolor: 'background.paper',
                },
                '&::before': {
                  display: remaining > 1 && !keyboard_open ? 'block' : 'none',
                  transform: 'translateY(20px) scale(0.97)',
                  opacity: 0.75,
                  boxShadow: '0 10px 24px rgba(15, 36, 24, 0.04)',
                },
                '&::after': {
                  display: remaining > 0 && !keyboard_open ? 'block' : 'none',
                  transform: 'translateY(10px) scale(0.985)',
                  opacity: 0.9,
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
                      transition:
                        'transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)',
                      transform: answered ? 'rotateY(180deg)' : 'none',
                      ...reduced_motion,
                    }}
                  >
                    <Box
                      inert={answered}
                      sx={(theme) => ({
                        ...face_sx(theme, null, keyboard_open),
                        alignItems: 'center',
                        textAlign: 'center',
                        gap: keyboard_open ? 1 : 2,
                      })}
                    >
                      {!keyboard_open && (
                        <AccentChip
                          label={review ? 'CẦN ÔN TẬP' : 'CHƯA HỌC'}
                        />
                      )}
                      <Typography
                        variant="h2"
                        sx={{
                          fontSize: keyboard_open
                            ? 34
                            : { xs: 44, sm: 64, lg: 76 },
                          fontWeight: 700,
                          lineHeight: 1.15,
                          letterSpacing: '-0.055em',
                          wordBreak: 'break-word',
                        }}
                      >
                        {prompt}
                      </Typography>
                      {direction === 'en_vi' && (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          {word.pronunciation && (
                            <Typography
                              color="text.secondary"
                              fontSize={18}
                              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                            >
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
                        ...face_sx(theme, outcome, keyboard_open),
                        transform: 'rotateY(180deg)',
                      })}
                    >
                      <CardBack word={word} />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: keyboard_open ? 2 : 4 }}>
              {!keyboard_open && (
                <Typography
                  component="label"
                  htmlFor="flashcard-answer"
                  variant="body2"
                  color="text.secondary"
                  fontWeight={600}
                  sx={{ display: 'block', mb: 1 }}
                >
                  {answer_label(direction)}
                </Typography>
              )}
              <TextField
                id="flashcard-answer"
                fullWidth
                autoFocus={!is_touch}
                key={word.id}
                inputRef={input_ref}
                placeholder="Nhập câu trả lời..."
                slotProps={{
                  htmlInput: { 'aria-label': answer_label(direction) },
                }}
                value={answer_input}
                disabled={grading || answered}
                onChange={(event) => set_answer_input(event.target.value)}
                onKeyDown={(event) => {
                  if (event.nativeEvent.isComposing || event.keyCode === 229)
                    return
                  if (event.key === 'Enter') handle_check()
                  if (event.key === 'Escape') handle_skip()
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '17px',
                    fontSize: { xs: 17, sm: 20 },
                  },
                  '& input': {
                    textAlign: 'center',
                    py: keyboard_open ? 1.75 : 2.75,
                  },
                }}
              />
              {!grading && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  component="p"
                  textAlign="center"
                  mt={1.25}
                  sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                  {answered ? (
                    <>
                      Nhấn <b>Enter</b> để{' '}
                      {is_last ? 'xem kết quả' : 'tiếp tục'}
                    </>
                  ) : (
                    <>
                      <b>Enter</b>: kiểm tra · <b>Esc</b>: bỏ qua
                    </>
                  )}
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
                alignItems="center"
                spacing={1.5}
                mt={3.5}
              >
                {answered ? (
                  <Box />
                ) : (
                  <Button
                    size="large"
                    disabled={grading}
                    onClick={handle_skip}
                    sx={{ px: 2.5 }}
                  >
                    Bỏ qua
                  </Button>
                )}
                {/* Distinct keys remount the button so autoFocus moves focus to
                    "Tiếp" once graded, letting Enter continue to the next card. */}
                {answered ? (
                  <Button
                    key="next"
                    autoFocus
                    size="large"
                    variant="contained"
                    endIcon={<ArrowForwardRoundedIcon />}
                    onClick={handle_next}
                    sx={{ minWidth: 160, px: 3 }}
                  >
                    {is_last ? 'Xem kết quả' : 'Tiếp'}
                  </Button>
                ) : (
                  <Button
                    key="check"
                    size="large"
                    variant="contained"
                    disabled={grading || !answer_input.trim()}
                    onClick={handle_check}
                    sx={{
                      minWidth: { xs: 160, sm: 208 },
                      minHeight: 56,
                      px: 3.5,
                    }}
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
