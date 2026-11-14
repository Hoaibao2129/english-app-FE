import { useCallback, useEffect, useState } from 'react'
import { vocabulary_service } from '../services/vocabularyService'
import type { Direction, VocabularyTopicDetail } from '../types/vocabulary'

/**
 * Progress is tracked per direction, so the topic is fetched for `direction`.
 * review: only fetch the words the learner last answered wrong.
 */
export function useTopic(
  topic_id: string,
  direction: Direction,
  review = false,
) {
  const [topic, set_topic] = useState<VocabularyTopicDetail | null>(null)
  const [loading, set_loading] = useState(true)
  const [error, set_error] = useState<Error | null>(null)
  const [reload_key, set_reload_key] = useState(0)

  useEffect(() => {
    let active = true

    set_loading(true)
    set_error(null)
    const fetch_topic = review
      ? vocabulary_service.get_topic_review
      : vocabulary_service.get_topic
    fetch_topic(topic_id, direction)
      .then((data) => {
        if (active) set_topic(data)
      })
      .catch((reason: unknown) => {
        if (!active) return
        set_topic(null)
        set_error(reason instanceof Error ? reason : new Error(String(reason)))
      })
      .finally(() => {
        if (active) set_loading(false)
      })

    return () => {
      active = false
    }
  }, [topic_id, direction, review, reload_key])

  const reload = useCallback(() => set_reload_key((key) => key + 1), [])

  return { topic, loading, error, reload }
}
