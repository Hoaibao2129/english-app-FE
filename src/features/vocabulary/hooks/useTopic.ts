import { useEffect, useState } from 'react'
import { vocabularyService } from '../services/vocabularyService'
import type { VocabularyTopic } from '../types/vocabulary'

const STORAGE_KEY = 'study-english:progress'

export function useTopic(topicId: number) {
  const [topic, setTopic] = useState<VocabularyTopic | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    vocabularyService.getTopics().then((topics) => {
      if (!active) return

      const selectedTopic = topics.find((item) => item.id === topicId) ?? null
      let progress: Record<number, number> = {}

      try {
        progress = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
      } catch {
        progress = {}
      }

      setTopic(
        selectedTopic
          ? {
              ...selectedTopic,
              learnedWords: progress[topicId] ?? selectedTopic.learnedWords,
            }
          : null,
      )
      setLoading(false)
    })

    return () => {
      active = false
    }
  }, [topicId])

  const updateProgress = (learnedWords: number) => {
    if (!topic) return

    const nextValue = Math.min(learnedWords, topic.totalWords)
    let progress: Record<number, number> = {}

    try {
      progress = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    } catch {
      progress = {}
    }

    progress[topic.id] = nextValue
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    setTopic((current) =>
      current ? { ...current, learnedWords: nextValue } : current,
    )
  }

  return { topic, loading, updateProgress }
}
