import type { VocabularyWord } from '../types/vocabulary'

/** Random sample without replacement (Fisher-Yates partial shuffle). */
export function pick_quiz_words(
  words: VocabularyWord[],
  count = 10,
): VocabularyWord[] {
  const pool = [...words]
  const size = Math.min(count, pool.length)

  for (let i = 0; i < size; i++) {
    const j = i + Math.floor(Math.random() * (pool.length - i))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }

  return pool.slice(0, size)
}
