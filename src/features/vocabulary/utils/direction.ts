import type { Direction, VocabularyWord } from '../types/vocabulary'

export const prompt_of = (word: VocabularyWord, direction: Direction) =>
  direction === 'en_vi' ? word.word : word.meaning

export const answer_label = (direction: Direction) =>
  direction === 'en_vi' ? 'Nghĩa tiếng Việt' : 'Từ tiếng Anh'

export const direction_label = (direction: Direction) =>
  direction === 'en_vi' ? 'Anh → Việt' : 'Việt → Anh'

export const speak = (text: string) => {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(text))
}
