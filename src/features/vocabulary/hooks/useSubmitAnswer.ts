import { useCallback, useState } from 'react'
import { vocabulary_service } from '../services/vocabularyService'
import type {
  Direction,
  StudyMode,
  SubmitAnswerResult,
} from '../types/vocabulary'

/** Submits one answer to the API and tracks grading / error state. */
export function useSubmitAnswer(mode: StudyMode, direction: Direction) {
  const [grading, set_grading] = useState(false)
  const [failed, set_failed] = useState(false)
  const [result, set_result] = useState<SubmitAnswerResult | null>(null)

  const submit = useCallback(
    async (word_id: string, answer: string) => {
      set_grading(true)
      set_failed(false)
      try {
        const graded = await vocabulary_service.submit_answer({
          word_id,
          direction,
          mode,
          answer,
        })
        set_result(graded)
        return graded
      } catch {
        set_failed(true)
        return null
      } finally {
        set_grading(false)
      }
    },
    [direction, mode],
  )

  const clear = useCallback(() => {
    set_result(null)
    set_failed(false)
  }, [])

  return { grading, failed, result, submit, clear }
}
