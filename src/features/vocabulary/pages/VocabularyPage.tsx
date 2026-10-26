import { useState } from 'react'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import {
  Box,
  Chip,
  CircularProgress,
  Container,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { AppNavigation } from '../components/AppNavigation'
import { TopicCard } from '../components/TopicCard'
import { VocabularyHeader } from '../components/VocabularyHeader'
import { useVocabulary } from '../hooks/useVocabulary'
import type { TopicFilter } from '../types/vocabulary'

const filters: { value: TopicFilter; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'not-started', label: 'Chưa học' },
  { value: 'in-progress', label: 'Đang học' },
  { value: 'completed', label: 'Hoàn thành' },
]

export function VocabularyPage() {
  const navigate = useNavigate()
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false)
  const {
    topics,
    loading,
    query,
    setQuery,
    filter,
    setFilter,
    learnedWords,
    totalWords,
    resetProgress,
  } = useVocabulary()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
      }}
    >
      <AppNavigation
        mobileOpen={mobileNavigationOpen}
        onMobileClose={() => setMobileNavigationOpen(false)}
      />

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <VocabularyHeader
          learnedWords={learnedWords}
          totalWords={totalWords}
          onReset={resetProgress}
          onMenuClick={() => setMobileNavigationOpen(true)}
        />

        <Container maxWidth="lg" component="main" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', md: 'flex-end' }}
          spacing={3}
          mb={4}
        >
          <Box>
            <Typography
              variant="h4"
              component="h2"
              fontWeight={750}
              gutterBottom
            >
              Chủ đề & tiến độ
            </Typography>
            <Typography color="text.secondary">
              Chọn một chủ đề và bắt đầu học theo tốc độ của bạn.
            </Typography>
          </Box>

          <TextField
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm kiếm chủ đề..."
            size="small"
            sx={{ width: { xs: '100%', md: 300 } }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          mb={3}
          sx={{ overflowX: 'auto', pb: 0.5 }}
        >
          {filters.map((item) => (
            <Chip
              key={item.value}
              label={item.label}
              clickable
              color={filter === item.value ? 'primary' : 'default'}
              variant={filter === item.value ? 'filled' : 'outlined'}
              onClick={() => setFilter(item.value)}
              sx={{ flexShrink: 0, fontWeight: 650 }}
            />
          ))}
        </Stack>

        {loading ? (
          <Box sx={{ display: 'grid', placeItems: 'center', py: 14 }}>
            <CircularProgress />
          </Box>
        ) : topics.length ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, minmax(0, 1fr))',
                lg: 'repeat(3, minmax(0, 1fr))',
              },
              gap: 3,
            }}
          >
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onFlashcards={(item) =>
                  navigate(`/topics/${item.id}/flashcards`)
                }
                onQuiz={(item) => navigate(`/topics/${item.id}/quiz`)}
              />
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 12 }}>
            <Typography variant="h6" fontWeight={700}>
              Không tìm thấy chủ đề
            </Typography>
            <Typography color="text.secondary" mt={1}>
              Hãy thử từ khóa hoặc bộ lọc khác.
            </Typography>
          </Box>
        )}
        </Container>
      </Box>
    </Box>
  )
}
