import { useCallback, useEffect, useMemo, useState } from 'react'
import { vocabulary_service } from '../services/vocabularyService'
import type {
  Direction,
  Summary,
  TopicFilter,
  VocabularyTopic,
} from '../types/vocabulary'

/** Topics and summary are fetched for `direction`; switching it re-fetches. */
export function useVocabulary(direction: Direction) {
  const [topics, set_topics] = useState<VocabularyTopic[]>([])
  const [summary, set_summary] = useState<Summary | null>(null)
  const [loading, set_loading] = useState(true)
  const [error, set_error] = useState<Error | null>(null)
  const [query, set_query] = useState('')
  const [filter, set_filter] = useState<TopicFilter>('all')
  const [reload_key, set_reload_key] = useState(0)

  useEffect(() => {
    let active = true

    set_loading(true)
    set_error(null)
    Promise.all([
      vocabulary_service.get_topics(direction),
      vocabulary_service.get_summary(direction),
    ])
      .then(([topic_data, summary_data]) => {
        if (!active) return
        set_topics(topic_data)
        set_summary(summary_data)
      })
      .catch((reason: unknown) => {
        if (!active) return
        set_error(reason instanceof Error ? reason : new Error(String(reason)))
      })
      .finally(() => {
        if (active) set_loading(false)
      })

    return () => {
      active = false
    }
  }, [direction, reload_key])

  const reload = useCallback(() => set_reload_key((key) => key + 1), [])

  // Clears progress in both directions.
  const reset_progress = useCallback(async () => {
    await vocabulary_service.reset_progress()
    reload()
  }, [reload])

  // Clears the topic's progress in the current direction only.
  const reset_topic = useCallback(
    async (topic_id: string) => {
      await vocabulary_service.reset_topic(topic_id, direction)
      reload()
    },
    [direction, reload],
  )

  const filtered_topics = useMemo(() => {
    const normalized_query = query.trim().toLocaleLowerCase()

    return topics.filter((topic) => {
      const matches_query =
        !normalized_query ||
        topic.title.toLocaleLowerCase().includes(normalized_query) ||
        topic.title_vi.toLocaleLowerCase().includes(normalized_query)

      return matches_query && (filter === 'all' || filter === topic.status)
    })
  }, [filter, query, topics])

  return {
    topics: filtered_topics,
    loading,
    error,
    query,
    set_query,
    filter,
    set_filter,
    learned_words: summary?.learned_words ?? 0,
    total_words: summary?.total_words ?? 0,
    reset_progress,
    reset_topic,
    reload,
  }
}
