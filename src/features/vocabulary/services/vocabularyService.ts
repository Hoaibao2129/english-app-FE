import { mockTopics } from '../data/mockVocabulary'
import type { VocabularyTopic } from '../types/vocabulary'

const delay = (duration: number) =>
  new Promise((resolve) => window.setTimeout(resolve, duration))

/**
 * API boundary for the vocabulary feature.
 * Replace the mock implementation with your backend request later.
 */
export const vocabularyService = {
  async getTopics(): Promise<VocabularyTopic[]> {
    await delay(250)
    return structuredClone(mockTopics)
  },
}
