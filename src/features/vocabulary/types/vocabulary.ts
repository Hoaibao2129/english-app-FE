export type TopicStatus = 'not-started' | 'in-progress' | 'completed'

export interface VocabularyWord {
  id: number
  word: string
  pronunciation: string
  partOfSpeech?: string
  meaning: string
  example: string
  exampleMeaning: string
}

export interface VocabularyTopic {
  id: number
  title: string
  titleVi: string
  totalWords: number
  learnedWords: number
  words: VocabularyWord[]
}

export type TopicFilter = 'all' | TopicStatus

export interface QuizQuestion {
  wordId: number
  prompt: string
  pronunciation: string
  correctAnswer: string
  options: string[]
}
