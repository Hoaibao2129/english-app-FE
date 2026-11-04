import type { ReactNode } from 'react'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import CloudOffRoundedIcon from '@mui/icons-material/CloudOffRounded'
import HelpRoundedIcon from '@mui/icons-material/HelpRounded'
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import type { SubmitAnswerResult } from '../types/vocabulary'
import { fade_up, reduced_motion } from '../utils/motion'

interface AnswerOutcomeProps {
  grading: boolean
  failed: boolean
  result: SubmitAnswerResult | null
  on_retry: () => void
}

type Tone = 'info' | 'success' | 'error' | 'neutral'

interface BannerProps {
  tone: Tone
  icon: ReactNode
  title: string
  detail?: ReactNode
  action?: ReactNode
}

function Banner({ tone, icon, title, detail, action }: BannerProps) {
  return (
    <Box
      role="status"
      sx={(theme) => {
        const color =
          tone === 'neutral'
            ? theme.palette.text.secondary
            : theme.palette[tone].main
        return {
          mt: 2.5,
          px: { xs: 2.5, sm: 3 },
          py: 2,
          borderRadius: '16px',
          border: 1,
          borderColor: alpha(color, 0.35),
          bgcolor: alpha(color, 0.05),
          color,
          animation: `${fade_up} 0.25s ease-out`,
          ...reduced_motion,
        }
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{ display: 'flex', fontSize: 32 }}>{icon}</Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography fontWeight={700} fontSize={18}>
            {title}
          </Typography>
          {detail && (
            <Typography color="text.primary" fontSize={15}>
              {detail}
            </Typography>
          )}
        </Box>
        {action}
      </Stack>
    </Box>
  )
}

const answer_detail = (answer: string) => (
  <>
    Đáp án: <Box component="strong">{answer}</Box>
  </>
)

export function AnswerOutcome({
  grading,
  failed,
  result,
  on_retry,
}: AnswerOutcomeProps) {
  if (grading) {
    return (
      <Banner
        tone="info"
        icon={<CircularProgress size={24} color="inherit" />}
        title="Đang chấm…"
      />
    )
  }

  if (failed) {
    return (
      <Banner
        tone="error"
        icon={<CloudOffRoundedIcon fontSize="inherit" />}
        title="Không kết nối được máy chủ"
        action={
          <Button color="inherit" size="small" onClick={on_retry}>
            Thử lại
          </Button>
        }
      />
    )
  }

  if (!result) return null

  if (result.is_correct === true) {
    return (
      <Banner
        tone="success"
        icon={<CheckCircleRoundedIcon fontSize="inherit" />}
        title="Chính xác!"
      />
    )
  }

  if (result.is_correct === false) {
    return (
      <Banner
        tone="error"
        icon={<CancelRoundedIcon fontSize="inherit" />}
        title="Chưa đúng"
        detail={answer_detail(result.correct_answer)}
      />
    )
  }

  return (
    <Banner
      tone="neutral"
      icon={<HelpRoundedIcon fontSize="inherit" />}
      title="Chưa chấm được"
      detail={answer_detail(result.correct_answer)}
    />
  )
}
