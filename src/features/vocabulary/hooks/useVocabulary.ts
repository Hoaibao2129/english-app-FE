import { useCallback, useEffect, useMemo, useState } from 'react'
import { vocabularyService } from '../services/vocabularyService'
import type {
  TopicFilter,
  VocabularyTopic,
} from '../types/vocabulary'

const STORAGE_KEY = 'study-english:progress'

function getStoredProgress(): Record<number, number> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

export function useVocabulary() {
  const [topics, setTopics] = useState<VocabularyTopic[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<TopicFilter>('all')

  useEffect(() => {
    let active = true

    vocabularyService.getTopics().then((data) => {
      if (!active) return

      const progress = getStoredProgress()
      setTopics(
        data.map((topic) => ({
          ...topic,
          learnedWords: Math.min(
            progress[topic.id] ?? topic.learnedWords,
            topic.totalWords,
          ),
        })),
      )
      setLoading(false)
    })

    return () => {
      active = false
    }
  }, [])

  const updateProgress = useCallback((topicId: number, learnedWords: number) => {
    setTopics((current) => {
      const next = current.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              learnedWords: Math.min(learnedWords, topic.totalWords),
            }
          : topic,
      )
      const progress = Object.fromEntries(
        next.map((topic) => [topic.id, topic.learnedWords]),
      )
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
      return next
    })
  }, [])

  const resetProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setTopics((current) =>
      current.map((topic) => ({ ...topic, learnedWords: 0 })),
    )
  }, [])

  const filteredTopics = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()

    return topics.filter((topic) => {
      const matchesQuery =
        !normalizedQuery ||
        topic.title.toLocaleLowerCase().includes(normalizedQuery) ||
        topic.titleVi.toLocaleLowerCase().includes(normalizedQuery)

      const status =
        topic.learnedWords === 0
          ? 'not-started'
          : topic.learnedWords >= topic.totalWords
            ? 'completed'
            : 'in-progress'

      return matchesQuery && (filter === 'all' || filter === status)
    })
  }, [filter, query, topics])

  const learnedWords = topics.reduce(
    (total, topic) => total + topic.learnedWords,
    0,
  )
  const totalWords = topics.reduce(
    (total, topic) => total + topic.totalWords,
    0,
  )

  return {
    topics: filteredTopics,
    loading,
    query,
    setQuery,
    filter,
    setFilter,
    learnedWords,
    totalWords,
    updateProgress,
    resetProgress,
  }
}
