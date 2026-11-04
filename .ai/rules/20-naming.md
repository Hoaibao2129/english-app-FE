---
title: Naming conventions
description: snake_case for values, PascalCase for components/types, file naming
globs: ['src/**/*.ts', 'src/**/*.tsx']
always_apply: true
---

# Naming

This repo uses **snake_case for values**, which differs from the usual JS
default. Follow it exactly.

| Kind                              | Style                   | Example                              |
| --------------------------------- | ----------------------- | ------------------------------------ |
| Variables, params, functions      | snake_case              | `topic_id`, `fetch_topic`, `give_up` |
| State setters                     | `set_` + name           | `[topic, set_topic] = useState()`    |
| Object/interface fields, props    | snake_case              | `total_words`, `on_reset`            |
| Event-handler props               | `on_` + verb            | `on_flashcards`, `on_quiz`           |
| Service objects & their methods   | snake_case              | `vocabulary_service.get_topic`       |
| React components                  | PascalCase              | `TopicCard`, `VocabularyPage`        |
| Hooks                             | camelCase `use`         | `useTopic`, `useStudyDirection`      |
| Types / interfaces                | PascalCase              | `VocabularyTopic`, `TopicCardProps`  |
| String-literal union members      | snake_case              | `'not_started' \| 'in_progress'`     |
| Module constants (true constants) | UPPER_SNAKE_CASE        | `ACCESS_TOKEN_KEY`, `EXPIRY_SKEW_MS` |
| Storage keys / custom event names | `study_english:` prefix | `'study_english:unauthorized'`       |

## Files

| Content              | File name        |
| -------------------- | ---------------- |
| Component / page     | `PascalCase.tsx` |
| Hook                 | `useXxx.ts`      |
| Service, util, types | `camelCase.ts`   |

- Pages end with `Page` (`QuizPage.tsx`); props interfaces end with `Props`.
- Booleans read as a question: `loading`, `review`, `active`, `is_*`/`has_*`.

- Hooks stay camelCase (`useXxx`) even though values are snake_case: the
  `react-hooks` ESLint plugin only recognises hooks named `use` + capital.
