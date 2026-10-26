import { useEffect, useMemo, useState } from 'react'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
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
import { LearningHeader } from '../components/LearningHeader'
import { useTopic } from '../hooks/useTopic'
import type { QuizQuestion } from '../types/vocabulary'
import { createQuiz } from '../utils/createQuiz'

interface QuizAnswer {
  question: QuizQuestion
  selectedAnswer: string
}

const normalizeAnswer = (value: string) =>
  value
    .trim()
    .toLocaleLowerCase('vi')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')

export function QuizPage() {
  const { topicId = '' } = useParams()
  const navigate = useNavigate()
  const { topic, loading } = useTopic(Number(topicId))
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answerInput, setAnswerInput] = useState('')
  const [checked, setChecked] = useState(false)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    if (topic) setQuestions(createQuiz(topic.words))
  }, [topic])

  const score = useMemo(
    () =>
      answers.filter(
        ({ question, selectedAnswer: answer }) =>
          normalizeAnswer(answer) === normalizeAnswer(question.correctAnswer),
      ).length,
    [answers],
  )
  const skipped = answers.filter(({ selectedAnswer: answer }) => !answer).length

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!topic || topic.words.length < 4) {
    return (
      <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight={750}>
          Chưa đủ dữ liệu để tạo quiz
        </Typography>
        <Typography color="text.secondary" mt={1}>
          Quiz cần ít nhất 4 từ. Dữ liệu sẽ được bổ sung từ backend.
        </Typography>
        <Button onClick={() => navigate('/')} sx={{ mt: 3 }}>
          Về trang chủ
        </Button>
      </Container>
    )
  }

  const restart = () => {
    setQuestions(createQuiz(topic.words))
    setQuestionIndex(0)
    setAnswerInput('')
    setChecked(false)
    setAnswers([])
    setFinished(false)
  }

  const saveAnswerAndContinue = (answer: string) => {
    const nextAnswers = [
      ...answers,
      { question: questions[questionIndex], selectedAnswer: answer },
    ]
    setAnswers(nextAnswers)

    if (questionIndex === questions.length - 1) {
      setFinished(true)
    } else {
      setQuestionIndex((current) => current + 1)
      setAnswerInput('')
      setChecked(false)
    }
  }

  const handleCheckOrContinue = () => {
    if (!answerInput.trim()) return
    if (checked) {
      saveAnswerAndContinue(answerInput.trim())
      return
    }
    setChecked(true)
  }

  if (!questions.length) return null

  const question = questions[questionIndex]
  const isCorrect =
    normalizeAnswer(answerInput) === normalizeAnswer(question.correctAnswer)

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <LearningHeader
        title="Ôn tập hôm nay"
        current={finished ? questions.length : questionIndex + 1}
        total={questions.length}
        counterLabel={`Câu ${finished ? questions.length : questionIndex + 1}/${questions.length}`}
        stats={
          <Stack direction="row" spacing={2}>
            <Typography variant="body2" color="success.main" fontWeight={700}>
              {score} đúng
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={700}>
              {skipped} bỏ qua
            </Typography>
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
                color={score >= questions.length * 0.8 ? 'success.main' : 'primary.main'}
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
              {answers.map(({ question: item, selectedAnswer: answer }, index) => {
                const correct =
                  normalizeAnswer(answer) ===
                  normalizeAnswer(item.correctAnswer)
                return (
                  <Paper
                    key={item.wordId}
                    variant="outlined"
                    sx={{ p: 2, borderRadius: 2.5 }}
                  >
                    <Stack direction="row" spacing={1.5}>
                      {correct ? (
                        <CheckCircleRoundedIcon color="success" />
                      ) : (
                        <CloseRoundedIcon color="error" />
                      )}
                      <Box>
                        <Typography fontWeight={700}>
                          {index + 1}. {item.prompt}
                        </Typography>
                        <Typography
                          variant="body2"
                          color={
                            !answer
                              ? 'text.secondary'
                              : correct
                                ? 'success.main'
                                : 'error.main'
                          }
                        >
                          {answer ? `Bạn chọn: ${answer}` : 'Đã bỏ qua'}
                        </Typography>
                        {!correct && (
                          <Typography variant="body2" color="text.secondary">
                            Đáp án đúng: {item.correctAnswer}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </Paper>
                )
              })}
            </Stack>
          </>
        ) : (
          <Paper
            elevation={0}
            sx={{ p: { xs: 1, sm: 0 }, bgcolor: 'transparent' }}
          >
            <Chip
              label="Anh → Việt"
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 700 }}
            />
            <Typography variant="h5" fontWeight={750} mt={2}>
              Nghĩa tiếng Việt của từ này là gì?
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1.5} mt={3} mb={4}>
              <Typography
                variant="h3"
                fontWeight={750}
                sx={{ fontSize: { xs: 36, sm: 48 } }}
              >
                {question.prompt}
              </Typography>
              <Typography color="text.secondary">
                {question.pronunciation}
              </Typography>
              <IconButton
                color="primary"
                aria-label={`Phát âm ${question.prompt}`}
                onClick={() => {
                  window.speechSynthesis.cancel()
                  window.speechSynthesis.speak(
                    new SpeechSynthesisUtterance(question.prompt),
                  )
                }}
              >
                <VolumeUpRoundedIcon />
              </IconButton>
            </Stack>

            <Typography
              component="label"
              htmlFor="quiz-answer"
              variant="body2"
              color="text.secondary"
              fontWeight={700}
            >
              Nghĩa tiếng Việt
            </Typography>
            <TextField
              id="quiz-answer"
              fullWidth
              autoFocus
              value={answerInput}
              disabled={checked}
              placeholder="Gõ câu trả lời rồi nhấn Enter..."
              onChange={(event) => setAnswerInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') handleCheckOrContinue()
              }}
              error={checked && !isCorrect}
              color={checked && isCorrect ? 'success' : 'primary'}
              sx={{
                mt: 1,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.paper',
                  fontSize: { xs: 18, sm: 22 },
                },
              }}
            />
            <Typography variant="body2" color="text.secondary" mt={1}>
              Gõ có dấu hoặc không dấu đều được.
            </Typography>

            {checked && (
              <Typography
                mt={2.5}
                color={isCorrect ? 'success.main' : 'error.main'}
                fontWeight={700}
              >
                {isCorrect
                  ? 'Chính xác!'
                  : `Chưa đúng. Đáp án là “${question.correctAnswer}”.`}
              </Typography>
            )}

            <Box sx={{ borderTop: 1, borderColor: 'divider', mt: 4, pt: 3 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={1.5}
            >
              <Button
                variant="outlined"
                disabled={checked}
                onClick={() => saveAnswerAndContinue('')}
                sx={{ px: { xs: 2, sm: 3 } }}
              >
                Không biết, bỏ qua
              </Button>
              <Button
                variant="contained"
                size="large"
                disabled={!answerInput.trim()}
                onClick={handleCheckOrContinue}
                sx={{ px: { xs: 3, sm: 5 } }}
              >
                {checked
                  ? questionIndex === questions.length - 1
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
