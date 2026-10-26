import type {
  QuizQuestion,
  VocabularyWord,
} from '../types/vocabulary'

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5)
}

export function createQuiz(
  words: VocabularyWord[],
  questionCount = 10,
): QuizQuestion[] {
  const selectedWords = shuffle(words).slice(
    0,
    Math.min(questionCount, words.length),
  )

  return selectedWords.map((word) => {
    const wrongAnswers = shuffle(
      words
        .filter((item) => item.id !== word.id)
        .map((item) => item.meaning),
    ).slice(0, 3)

    return {
      wordId: word.id,
      prompt: word.word,
      pronunciation: word.pronunciation,
      correctAnswer: word.meaning,
      options: shuffle([word.meaning, ...wrongAnswers]),
    }
  })
}
