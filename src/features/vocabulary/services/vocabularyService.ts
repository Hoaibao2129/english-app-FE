import type {
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

export const vocabulary_service = {
  get_topics: () => request_json<VocabularyTopic[]>('/vocabulary/topics'),

  get_topic: (id: string) =>
    request_json<VocabularyTopicDetail>(
      `/vocabulary/topics/${encodeURIComponent(id)}`,
    ),

  get_topic_review: (id: string) =>
    request_json<VocabularyTopicDetail>(
      `/vocabulary/topics/${encodeURIComponent(id)}/review`,
    ),

  submit_answer: (input: SubmitAnswerInput) =>
    request_json<SubmitAnswerResult>('/vocabulary/answers', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  get_summary: () => request_json<Summary>('/vocabulary/summary'),

  async reset_progress(): Promise<void> {
    await api_fetch('/vocabulary/progress', { method: 'DELETE' })
  },

  async reset_topic(id: string): Promise<void> {
    await api_fetch(`/vocabulary/topics/${encodeURIComponent(id)}/progress`, {
      method: 'DELETE',
    })
  },
}
