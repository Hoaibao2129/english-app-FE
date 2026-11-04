import { useState } from 'react'
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import { AppNavigation } from '../components/AppNavigation'
import { TopicCard } from '../components/TopicCard'
import { VocabularyHeader } from '../components/VocabularyHeader'
import { useStudyDirection } from '../hooks/useStudyDirection'
import { useVocabulary } from '../hooks/useVocabulary'
import type { TopicFilter, VocabularyTopic } from '../types/vocabulary'

const filters: { value: TopicFilter; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'not_started', label: 'Chưa học' },
  { value: 'in_progress', label: 'Đang học' },
  { value: 'completed', label: 'Hoàn thành' },
]

export function VocabularyPage() {
  const navigate = useNavigate()
  const [mobile_navigation_open, set_mobile_navigation_open] = useState(false)
  const {
    topics,
    loading,
    error,
    query,
    set_query,
    filter,
    set_filter,
    learned_words,
    total_words,
    reset_progress,
    reset_topic,
    reload,
  } = useVocabulary()
  const [direction, set_direction] = useStudyDirection()
  const [reset_error, set_reset_error] = useState(false)

  const [topic_to_reset, set_topic_to_reset] = useState<VocabularyTopic | null>(
    null,
  )
  const [resetting_topic, set_resetting_topic] = useState(false)

  const handle_reset = () => {
    set_reset_error(false)
    reset_progress().catch(() => set_reset_error(true))
  }

  const confirm_reset_topic = () => {
    if (!topic_to_reset) return
    set_reset_error(false)
    set_resetting_topic(true)
    reset_topic(topic_to_reset.id)
      .catch(() => set_reset_error(true))
      .finally(() => {
        set_resetting_topic(false)
        set_topic_to_reset(null)
      })
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
      }}
    >
      <AppNavigation
        mobile_open={mobile_navigation_open}
        on_mobile_close={() => set_mobile_navigation_open(false)}
      />

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <VocabularyHeader
          learned_words={learned_words}
          total_words={total_words}
          direction={direction}
          on_direction_change={set_direction}
          on_reset={handle_reset}
          on_menu_click={() => set_mobile_navigation_open(true)}
        />

        <Box
          component="main"
          sx={{ px: { xs: 2, sm: 3, lg: 3.5 }, py: { xs: 3.5, lg: 4 } }}
        >
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', lg: 'flex-end' }}
            spacing={2.5}
          >
            <Box sx={{ maxWidth: 672 }}>
              <Typography
                variant="overline"
                component="p"
                color="primary"
                sx={{ mb: 1 }}
              >
                1000 TỪ VỰNG CƠ BẢN
              </Typography>
              <Typography
                component="h2"
                sx={{
                  fontSize: { xs: '1.875rem', sm: '2.5rem' },
                  lineHeight: 1.2,
                  fontWeight: 600,
                  letterSpacing: '-0.05em',
                }}
              >
                Danh mục chủ đề
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1.25 }}>
                Bắt đầu bài học mới hoặc tiếp tục lộ trình hiện tại của bạn.
              </Typography>
            </Box>

            <TextField
              type="search"
              value={query}
              onChange={(event) => set_query(event.target.value)}
              placeholder="Tìm kiếm chủ đề..."
              sx={{
                width: { xs: '100%', lg: 360 },
                '& .MuiOutlinedInput-root': { height: 48, fontSize: 14 },
              }}
              slotProps={{
                htmlInput: { 'aria-label': 'Tìm kiếm chủ đề' },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon
                        sx={{ fontSize: 18, color: 'text.secondary' }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Stack>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={2}
            sx={{ mt: 3.5, mb: 2.5 }}
          >
            <Stack
              role="group"
              aria-label="Lọc chủ đề"
              direction="row"
              flexWrap="wrap"
              useFlexGap
              spacing={1}
            >
              {filters.map((item) => {
                const selected = filter === item.value
                return (
                  <Chip
                    key={item.value}
                    label={item.label}
                    clickable
                    aria-pressed={selected}
                    color={selected ? 'primary' : 'default'}
                    variant={selected ? 'filled' : 'outlined'}
                    onClick={() => set_filter(item.value)}
                    sx={{
                      height: 36,
                      px: 0.75,
                      fontSize: 14,
                      bgcolor: selected ? undefined : 'background.paper',
                      borderColor: 'divider',
                    }}
                  />
                )
              })}
            </Stack>
            {!loading && !error && (
              <Typography variant="body2" color="text.secondary">
                Hiển thị{' '}
                <Box
                  component="span"
                  sx={{ fontWeight: 600, color: 'text.primary' }}
                >
                  {topics.length}
                </Box>{' '}
                chủ đề
              </Typography>
            )}
          </Stack>

          {reset_error && (
            <Alert severity="error" sx={{ mb: 2.5 }}>
              Không đặt lại được tiến độ. Vui lòng thử lại.
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'grid', placeItems: 'center', py: 14 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert
              severity="error"
              action={
                <Button color="inherit" size="small" onClick={reload}>
                  Thử lại
                </Button>
              }
            >
              Không kết nối được máy chủ
            </Alert>
          ) : topics.length ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, minmax(0, 1fr))',
                  xl: 'repeat(3, minmax(0, 1fr))',
                },
                gap: 2,
              }}
            >
              {topics.map((topic) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  on_flashcards={(item) =>
                    navigate(`/topics/${item.id}/flashcards`)
                  }
                  on_quiz={(item) => navigate(`/topics/${item.id}/quiz`)}
                  on_review={(item) => navigate(`/topics/${item.id}/review`)}
                  on_reset={set_topic_to_reset}
                />
              ))}
            </Box>
          ) : (
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={(theme) => ({
                minHeight: 260,
                px: 3,
                py: 5,
                textAlign: 'center',
                borderRadius: '16px',
                border: `1px dashed ${theme.palette.divider}`,
                bgcolor: alpha(theme.palette.background.paper, 0.7),
              })}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '16px',
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: 'secondary.main',
                  color: 'primary.main',
                }}
              >
                <SearchRoundedIcon sx={{ fontSize: 20 }} />
              </Box>
              <Typography fontWeight={600} mt={2}>
                Chưa tìm thấy chủ đề phù hợp
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={0.75}>
                Thử đổi từ khóa hoặc chọn một bộ lọc khác nhé.
              </Typography>
              <Button
                size="small"
                onClick={() => {
                  set_query('')
                  set_filter('all')
                }}
                sx={{ mt: 1.5 }}
              >
                Đặt lại bộ lọc
              </Button>
            </Stack>
          )}
        </Box>
      </Box>

      <Dialog
        open={topic_to_reset !== null}
        onClose={() => !resetting_topic && set_topic_to_reset(null)}
      >
        <DialogTitle>Reset chủ đề này?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Toàn bộ tiến độ của chủ đề <b>{topic_to_reset?.title}</b> sẽ bị xoá
            để bạn học lại từ đầu. Các chủ đề khác không bị ảnh hưởng.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            variant="outlined"
            disabled={resetting_topic}
            onClick={() => set_topic_to_reset(null)}
          >
            Huỷ
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={resetting_topic}
            startIcon={<RestartAltRoundedIcon />}
            onClick={confirm_reset_topic}
          >
            Reset chủ đề
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
