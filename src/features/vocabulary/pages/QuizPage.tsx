import { useEffect, useRef, useState } from 'react'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
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
  TextField,
  Typography,
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { AnswerOutcome } from '../components/AnswerOutcome'
import { LearningHeader } from '../components/LearningHeader'
import { useStudyDirection } from '../hooks/useStudyDirection'
import { useSubmitAnswer } from '../hooks/useSubmitAnswer'
import { useTopic } from '../hooks/useTopic'
import type { SubmitAnswerResult, VocabularyWord } from '../types/vocabulary'
import { pick_quiz_words } from '../utils/createQuiz'
import {
  answer_label,
  direction_label,
  prompt_of,
  speak,
} from '../utils/direction'

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
      <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight={750}>
          {error ? 'Không kết nối được máy chủ' : 'Chưa đủ dữ liệu để tạo quiz'}
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
        current={finished ? questions.length : question_index + 1}
        total={questions.length}
        counter_label={`Câu ${finished ? questions.length : question_index + 1}/${questions.length}`}
        stats={
          <Stack direction="row" spacing={2}>
            <Typography variant="body2" color="success.main" fontWeight={700}>
              {score} đúng
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={700}>
              {skipped} bỏ qua
            </Typography>
            {ungraded > 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={700}
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
        sx={{ py: { xs: 3, sm: 7 }, maxWidth: '820px !important' }}
      >
        {finished ? (
          <>
            <Paper
              variant="outlined"
              sx={{ p: { xs: 3, sm: 5 }, borderRadius: 3, textAlign: 'center' }}
            >
              <Typography color="text.secondary" fontWeight={650}>
                KẾT QUẢ CỦA BẠN
              </Typography>
              <Typography
                color={
                  score >= questions.length * 0.8
                    ? 'success.main'
                    : 'primary.main'
                }
                fontSize={{ xs: 64, sm: 80 }}
                lineHeight={1.2}
                fontWeight={800}
                mt={1}
              >
                {score}/{questions.length}
              </Typography>
              <Typography variant="h5" fontWeight={750}>
                {score === questions.length
                  ? 'Xuất sắc!'
                  : score >= questions.length * 0.8
                    ? 'Làm rất tốt!'
                    : 'Tiếp tục cố gắng nhé!'}
              </Typography>
              {ungraded > 0 && (
                <Typography color="text.secondary" variant="body2" mt={1}>
                  {ungraded} câu chưa chấm được
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
                  Làm lại
                </Button>
              </Stack>
            </Paper>

            <Typography variant="h6" fontWeight={750} mt={4} mb={2}>
              Xem lại đáp án
            </Typography>
            <Stack spacing={1.5}>
              {answers.map(({ word, answer, result: graded }, index) => (
                <Paper
                  key={word.id}
                  variant="outlined"
                  sx={{ p: 2, borderRadius: 2.5 }}
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
                      <Typography fontWeight={700}>
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
          <Paper
            elevation={0}
            sx={{ p: { xs: 1, sm: 0 }, bgcolor: 'transparent' }}
          >
            <Chip
              label={direction_label(direction)}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 700 }}
            />
            <Typography variant="h5" fontWeight={750} mt={2}>
              {direction === 'en_vi'
                ? 'Nghĩa tiếng Việt của từ này là gì?'
                : 'Từ tiếng Anh của nghĩa này là gì?'}
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              mt={3}
              mb={4}
            >
              <Typography
                variant="h3"
                fontWeight={750}
                sx={{ fontSize: { xs: 36, sm: 48 } }}
              >
                {prompt}
              </Typography>
              {direction === 'en_vi' && (
                <>
                  {question.pronunciation && (
                    <Typography color="text.secondary">
                      {question.pronunciation}
                    </Typography>
                  )}
                  <IconButton
                    color="primary"
                    aria-label={`Phát âm ${question.word}`}
                    onClick={() => speak(question.word)}
                  >
                    <VolumeUpRoundedIcon />
                  </IconButton>
                </>
              )}
            </Stack>

            <Typography
              component="label"
              htmlFor="quiz-answer"
              variant="body2"
              color="text.secondary"
              fontWeight={700}
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
                  bgcolor: 'background.paper',
                  fontSize: { xs: 18, sm: 22 },
                },
              }}
            />

            <AnswerOutcome
              grading={grading}
              failed={failed}
              result={result}
              on_retry={() => void run(last_answer.current)}
            />

            <Box sx={{ borderTop: 1, borderColor: 'divider', mt: 4, pt: 3 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={1.5}
              >
                <Button
                  variant="outlined"
                  disabled={grading || answered}
                  onClick={() => void run('')}
                  sx={{ px: { xs: 2, sm: 3 } }}
                >
                  Không biết, bỏ qua
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  key={answered ? 'next' : 'check'}
                  autoFocus
                  disabled={grading || (!answered && !answer_input.trim())}
                  onClick={handle_check_or_continue}
                  sx={{ px: { xs: 3, sm: 5 } }}
                >
                  {answered
                    ? is_last
                      ? 'Xem kết quả'
                      : 'Câu tiếp theo'
                    : 'Kiểm tra'}
                </Button>
              </Stack>
            </Box>
          </Paper>
        )}
      </Container>
    </Box>
  )
}
