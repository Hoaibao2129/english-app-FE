import type {
  Direction,
  SubmitAnswerInput,
  SubmitAnswerResult,
  Summary,
  VocabularyTopic,
  VocabularyTopicDetail,
} from '../types/vocabulary'
import { api_fetch } from '../../auth/services/apiClient'

async function request_json<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await api_fetch(path, init)
  return (await response.json()) as T
}

/** Builds `?direction=...`; omitted direction means "both directions". */
function direction_query(direction?: Direction) {
  return direction ? `?${new URLSearchParams({ direction }).toString()}` : ''
}

export const vocabulary_service = {
  get_topics: (direction: Direction) =>
    request_json<VocabularyTopic[]>(
      `/vocabulary/topics${direction_query(direction)}`,
    ),

  get_topic: (id: string, direction: Direction) =>
    request_json<VocabularyTopicDetail>(
      `/vocabulary/topics/${encodeURIComponent(id)}${direction_query(direction)}`,
    ),

  get_topic_review: (id: string, direction: Direction) =>
    request_json<VocabularyTopicDetail>(
      `/vocabulary/topics/${encodeURIComponent(id)}/review${direction_query(direction)}`,
    ),

  submit_answer: (input: SubmitAnswerInput) =>
    request_json<SubmitAnswerResult>('/vocabulary/answers', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  get_summary: (direction: Direction) =>
    request_json<Summary>(`/vocabulary/summary${direction_query(direction)}`),

  /** Without a direction, progress in both directions is cleared. */
  async reset_progress(direction?: Direction): Promise<void> {
    await api_fetch(`/vocabulary/progress${direction_query(direction)}`, {
      method: 'DELETE',
    })
  },

  /** Without a direction, the topic's progress in both directions is cleared. */
  async reset_topic(id: string, direction?: Direction): Promise<void> {
    await api_fetch(
      `/vocabulary/topics/${encodeURIComponent(id)}/progress${direction_query(direction)}`,
      { method: 'DELETE' },
    )
  },
}
