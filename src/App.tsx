import { lazy, Suspense } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { RequireAuth } from './features/auth/components/RequireAuth'
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

const LoginPage = lazy(() =>
  import('./features/auth/pages/LoginPage').then((module) => ({
    default: module.LoginPage,
  })),
)
const RegisterPage = lazy(() =>
  import('./features/auth/pages/RegisterPage').then((module) => ({
    default: module.RegisterPage,
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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <VocabularyPage />
            </RequireAuth>
          }
        />
        <Route
          path="/topics/:topic_id/flashcards"
          element={
            <RequireAuth>
              <FlashcardPage />
            </RequireAuth>
          }
        />
        <Route
          path="/topics/:topic_id/review"
          element={
            <RequireAuth>
              <FlashcardPage review />
            </RequireAuth>
          }
        />
        <Route
          path="/topics/:topic_id/quiz"
          element={
            <RequireAuth>
              <QuizPage />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
