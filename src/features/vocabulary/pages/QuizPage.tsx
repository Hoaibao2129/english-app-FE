import { useEffect, useRef, useState } from 'react'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { AccentChip } from '../components/AccentChip'
import { AnswerOutcome } from '../components/AnswerOutcome'
import { CompletionCard } from '../components/CompletionCard'
import { LearningHeader } from '../components/LearningHeader'
import { useStudyDirection } from '../hooks/useStudyDirection'
import { useSubmitAnswer } from '../hooks/useSubmitAnswer'
import { useTopic } from '../hooks/useTopic'
import type { SubmitAnswerResult, VocabularyWord } from '../types/vocabulary'
import { pick_quiz_words } from '../utils/createQuiz'
import { answer_label, prompt_of, speak } from '../utils/direction'

interface QuizAnswer {
  word: VocabularyWord
  answer: string
  result: SubmitAnswerResult
}

export function QuizPage() {
  const { topic_id = '' } = useParams()
  const navigate = useNavigate()
  const { topic, loading, error, reload } = useTopic(topic_id)
  const [direction] = useStudyDirection()
  const { grading, failed, result, submit, clear } = useSubmitAnswer(
    'quiz',
    direction,
  )
  const [questions, set_questions] = useState<VocabularyWord[]>([])
  const [question_index, set_question_index] = useState(0)
  const [answer_input, set_answer_input] = useState('')
  const [answers, set_answers] = useState<QuizAnswer[]>([])
  const [finished, set_finished] = useState(false)
  const last_answer = useRef('')

  useEffect(() => {
    if (topic) set_questions(pick_quiz_words(topic.words))
  }, [topic])

  const score = answers.filter(({ result: r }) => r.is_correct === true).length
  const skipped = answers.filter(({ answer }) => !answer).length
  const ungraded = answers.filter(
    ({ answer, result: r }) => answer && r.is_correct === null,
  ).length

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !topic || topic.words.length < 1) {
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
          {error ? 'Không kết nối được máy chủ' : 'Chưa đủ dữ liệu để tạo quiz'}
        </Alert>
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button onClick={() => navigate('/')}>Về trang chủ</Button>
        </Box>
      </Container>
    )
  }

  if (!questions.length) return null

  const question = questions[question_index]
  const is_last = question_index === questions.length - 1
  const answered = result !== null

  const restart = () => {
    set_questions(pick_quiz_words(topic.words))
    set_question_index(0)
    set_answer_input('')
    set_answers([])
    set_finished(false)
    clear()
  }

  const run = async (answer: string) => {
    last_answer.current = answer
    const graded = await submit(question.id, answer)
    if (!graded) return
    set_answers((current) => [
      ...current,
      { word: question, answer, result: graded },
    ])
    // A skip has nothing to review, so move on right away.
    if (!answer) go_next()
  }

  const go_next = () => {
    clear()
    set_answer_input('')
    if (is_last) set_finished(true)
    else set_question_index((current) => current + 1)
  }

  const handle_check_or_continue = () => {
    if (grading) return
    if (answered) {
      go_next()
      return
    }
    if (answer_input.trim()) void run(answer_input.trim())
  }

  const prompt = prompt_of(question, direction)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <LearningHeader
        title="Ôn tập hôm nay"
        subtitle={topic.title}
        current={finished ? questions.length : question_index + 1}
        total={questions.length}
        counter_label={`Câu ${finished ? questions.length : question_index + 1}/${questions.length}`}
        stats={
          <Stack direction="row" spacing={2} sx={{ whiteSpace: 'nowrap' }}>
            <Typography variant="body2" color="success.main" fontWeight={600}>
              {score} đúng
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              {skipped} bỏ qua
            </Typography>
            {ungraded > 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={600}
              >
                {ungraded} chưa chấm
              </Typography>
            )}
          </Stack>
        }
      />

      <Container
        maxWidth="md"
        component="main"
        sx={{ py: { xs: 4, sm: 5, lg: 6 }, maxWidth: '768px !important' }}
      >
        {finished ? (
          <>
            <CompletionCard
              eyebrow="KẾT QUẢ CỦA BẠN"
              highlight={
                <Typography
                  color={
                    score >= questions.length * 0.8
                      ? 'success.main'
                      : 'primary.main'
                  }
                  sx={{
                    fontSize: { xs: 64, sm: 80 },
                    lineHeight: 1.1,
                    fontWeight: 700,
                    letterSpacing: '-0.05em',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {score}/{questions.length}
                </Typography>
              }
              title={
                score === questions.length
                  ? 'Xuất sắc!'
                  : score >= questions.length * 0.8
                    ? 'Làm rất tốt!'
                    : 'Tiếp tục cố gắng nhé!'
              }
              description={
                <>
                  Bạn đã trả lời đúng {score}/{questions.length} câu và bỏ qua{' '}
                  {skipped} câu.
                  {ungraded > 0 && ` ${ungraded} câu chưa chấm được.`}
                </>
              }
              actions={
                <>
                  <Button
                    variant="outlined"
                    startIcon={<HomeRoundedIcon />}
                    onClick={() => navigate('/')}
                  >
                    Trang chủ
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<ReplayRoundedIcon />}
                    onClick={restart}
                  >
                    Làm lại quiz
                  </Button>
                </>
              }
            />

            <Typography variant="h6" component="h2" mt={5} mb={2}>
              Xem lại đáp án
            </Typography>
            <Stack spacing={1.5}>
              {answers.map(({ word, answer, result: graded }, index) => (
                <Paper
                  key={word.id}
                  variant="outlined"
                  sx={{ p: 2, borderRadius: '16px' }}
                >
                  <Stack direction="row" spacing={1.5}>
                    {graded.is_correct === true ? (
                      <CheckCircleRoundedIcon color="success" />
                    ) : graded.is_correct === false ? (
                      <CloseRoundedIcon color="error" />
                    ) : (
                      <HelpOutlineRoundedIcon color="disabled" />
                    )}
                    <Box>
                      <Typography fontWeight={600}>
                        {index + 1}. {prompt_of(word, direction)}
                      </Typography>
                      <Typography
                        variant="body2"
                        color={
                          !answer || graded.is_correct === null
                            ? 'text.secondary'
                            : graded.is_correct
                              ? 'success.main'
                              : 'error.main'
                        }
                      >
                        {answer ? `Bạn trả lời: ${answer}` : 'Đã bỏ qua'}
                        {answer &&
                          graded.is_correct === null &&
                          ' (chưa chấm được)'}
                      </Typography>
                      {graded.is_correct !== true && (
                        <Typography variant="body2" color="text.secondary">
                          Đáp án đúng: {graded.correct_answer}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </>
        ) : (
          <Box>
            <Paper
              variant="outlined"
              sx={{
                p: { xs: 2.5, sm: 4 },
                borderRadius: '24px',
                boxShadow: '0 12px 32px rgba(15, 36, 24, 0.05)',
              }}
            >
              <AccentChip
                label={direction === 'en_vi' ? 'ANH → VIỆT' : 'VIỆT → ANH'}
              />
              <Typography
                component="h2"
                sx={{
                  mt: 2,
                  fontSize: { xs: 20, sm: 24 },
                  fontWeight: 600,
                  letterSpacing: '-0.04em',
                }}
              >
                {direction === 'en_vi'
                  ? 'Nghĩa tiếng Việt của từ này là gì?'
                  : 'Từ tiếng Anh của nghĩa này là gì?'}
              </Typography>
              <Stack
                direction="row"
                alignItems="center"
                flexWrap="wrap"
                useFlexGap
                spacing={1.5}
                mt={3}
              >
                <Typography
                  sx={{
                    fontSize: { xs: 36, sm: 56 },
                    lineHeight: 1.15,
                    fontWeight: 700,
                    letterSpacing: '-0.055em',
                    wordBreak: 'break-word',
                  }}
                >
                  {prompt}
                </Typography>
                {direction === 'en_vi' && (
                  <>
                    {question.pronunciation && (
                      <Typography
                        color="text.secondary"
                        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                      >
                        {question.pronunciation}
                      </Typography>
                    )}
                    <IconButton
                      color="primary"
                      aria-label={`Phát âm ${question.word}`}
                      onClick={() => speak(question.word)}
                      sx={{
                        borderRadius: '50%',
                        '&:hover': { bgcolor: 'secondary.main' },
                      }}
                    >
                      <VolumeUpRoundedIcon />
                    </IconButton>
                  </>
                )}
              </Stack>
            </Paper>

            <Typography
              component="label"
              htmlFor="quiz-answer"
              variant="body2"
              color="text.secondary"
              fontWeight={600}
              sx={{ display: 'block', mt: 3 }}
            >
              {answer_label(direction)}
            </Typography>
            <TextField
              id="quiz-answer"
              key={question.id}
              fullWidth
              autoFocus
              value={answer_input}
              disabled={grading || answered}
              placeholder="Gõ câu trả lời rồi nhấn Enter..."
              onChange={(event) => set_answer_input(event.target.value)}
              onKeyDown={(event) => {
                if (event.nativeEvent.isComposing || event.keyCode === 229)
                  return
                if (event.key === 'Enter') handle_check_or_continue()
              }}
              error={result?.is_correct === false}
              color={result?.is_correct === true ? 'success' : 'primary'}
              sx={{
                mt: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '17px',
                  fontSize: { xs: 17, sm: 19 },
                },
                '& input': { py: 2 },
              }}
            />

            <AnswerOutcome
              grading={grading}
              failed={failed}
              result={result}
              on_retry={() => void run(last_answer.current)}
            />

            <Box
              sx={{ borderTop: 1, borderColor: 'divider', mt: 3.5, pt: 2.5 }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1.5}
              >
                {answered ? (
                  <Typography variant="body2" color="text.secondary">
                    Nhấn <b>Enter</b> để tiếp tục
                  </Typography>
                ) : (
                  <Button
                    variant="outlined"
                    disabled={grading}
                    onClick={() => void run('')}
                    sx={{ px: { xs: 2, sm: 2.5 } }}
                  >
                    Bỏ qua câu này
                  </Button>
                )}
                <Button
                  variant="contained"
                  size="large"
                  key={answered ? 'next' : 'check'}
                  autoFocus
                  disabled={grading || (!answered && !answer_input.trim())}
                  onClick={handle_check_or_continue}
                  endIcon={answered ? <ArrowForwardRoundedIcon /> : undefined}
                  sx={{ minWidth: 160, px: { xs: 3, sm: 3.5 } }}
                >
                  {answered
                    ? is_last
                      ? 'Xem kết quả'
                      : 'Câu tiếp theo'
                    : 'Kiểm tra'}
                </Button>
              </Stack>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  )
}
