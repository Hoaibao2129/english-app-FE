import { lazy, Suspense } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { Navigate, Route, Routes } from 'react-router-dom'

const VocabularyPage = lazy(() =>
  import('./features/vocabulary/pages/VocabularyPage').then((module) => ({
    default: module.VocabularyPage,
  })),
)
const FlashcardPage = lazy(() =>
  import('./features/vocabulary/pages/FlashcardPage').then((module) => ({
    default: module.FlashcardPage,
  })),
)
const QuizPage = lazy(() =>
  import('./features/vocabulary/pages/QuizPage').then((module) => ({
    default: module.QuizPage,
  })),
)

function App() {
  return (
    <Suspense
      fallback={
        <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
          <CircularProgress />
        </Box>
      }
    >
      <Routes>
        <Route path="/" element={<VocabularyPage />} />
        <Route
          path="/topics/:topicId/flashcards"
          element={<FlashcardPage />}
        />
        <Route path="/topics/:topicId/quiz" element={<QuizPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
