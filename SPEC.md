# SPEC — LinguaQuest: техническая спецификация

**Версия:** 1.0 · соответствует PRD 1.0

## 1. Стек

| Слой | Технология |
|---|---|
| Фреймворк | Next.js 15 (App Router, TypeScript, Server Actions / Route Handlers) |
| UI | Tailwind CSS v4 + собственные компоненты; иконки lucide-react |
| Аутентификация | better-auth (email + пароль, сессии в БД) |
| БД | Turso (libSQL) + Drizzle ORM, миграции drizzle-kit |
| AI | Claude API (`@anthropic-ai/sdk`), модель `claude-haiku-5-5` для разбора/оценки (дёшево и быстро) |
| Speaking (STT) | Web Speech API (`SpeechRecognition`) в браузере |
| Listening (TTS) | Web Speech API (`speechSynthesis`) |
| Деплой (позже) | Vercel + Turso |

Локальная разработка: `turso dev` (локальный файл libSQL) либо file: URL — без необходимости облачной БД.

## 2. Структура проекта

```
/src
  /app
    /(marketing)/page.tsx           # лендинг
    /(auth)/login, /register
    /(app)/dashboard                # ЛК: прогресс, стрик, карточки, лимит
    /(app)/learn                    # карта уровней (общий курс)
    /(app)/learn/[levelId]          # прохождение урока
    /(app)/exams/{ege,ielts}        # экзаменационные треки
    /(app)/collection               # коллекция карточек
    /(app)/settings                 # профиль, сложность, тариф
    /api/auth/[...all]              # better-auth
    /api/ai/review                  # разбор ошибок урока
    /api/ai/evaluate                # оценка speaking / свободного ответа
  /db  (schema.ts, index.ts, seed.ts)
  /lib (auth.ts, limits.ts, xp.ts, ai.ts)
  /components
/content/levels/*.json              # исходники 20 уровней (seed)
```

## 3. Схема БД (Drizzle / libSQL)

```
users            id, email, name, passwordHash (через better-auth таблицы),
                 plan ('free'|'pro'), difficulty ('beginner'|'intermediate'|'advanced'),
                 xp, streakCount, lastCheckinAt, createdAt
sessions/accounts/verifications    # таблицы better-auth

levels           id, track ('general'|'ege'|'ielts'), orderIndex, title,
                 difficulty, theoryMd, cardId, createdAt
exercises        id, levelId, orderIndex, type
                 ('quiz'|'multi_quiz'|'gap_fill'|'word_order'|'translate'|'listening'|'speaking'),
                 prompt, dataJson (варианты, эталон, аудио-текст), answerJson
cards            id, title, description, imageEmoji/imageUrl, rarity
user_progress    userId, levelId, status ('locked'|'available'|'completed'),
                 bestScore, attempts, completedAt
user_answers     id, userId, levelId, attemptNo, exerciseId,
                 givenJson, isCorrect, createdAt
user_cards       userId, cardId, earnedAt
usage_log        id, userId, kind ('lesson_start'|'lesson_finish'), levelId,
                 minutesSpent, createdAt        # для лимита Free
ai_reviews       id, userId, levelId, attemptNo, reviewJson, createdAt  # кэш разборов
```

## 4. Ключевая логика

### 4.1 Лимит Free
`lib/limits.ts`:
- Окно = 24 часа от самого раннего `usage_log.lesson_start` в пределах последних 24ч.
- Лимит исчерпан, если за окно: `lesson_start ≥ 5` **или** `sum(minutesSpent) ≥ 20`.
- Free не может открыть уровень с `orderIndex > 5` независимо от лимита.
- Проверка на сервере при старте урока (route handler / server action); клиент только отображает остаток и таймер сброса.

### 4.2 Прохождение урока
1. `POST lesson_start` → проверка лимита → запись в `usage_log`.
2. Клиент ведёт пользователя по упражнениям; ответы отправляются батчем в конце (`lesson_finish`) + `minutesSpent`.
3. Сервер проверяет закрытые типы заданий локально; `translate`/`speaking` — через `/api/ai/evaluate`.
4. score ≥ 70% → `user_progress.completed`, открытие следующего уровня, выдача карточки, начисление XP.
5. Разбор ошибок: `/api/ai/review` — один вызов Claude на попытку, результат кэшируется в `ai_reviews`.

### 4.3 Speaking / Listening
- Speaking: браузер распознаёт речь → текст отправляется на сервер → Claude сравнивает с эталоном, возвращает `{score 0..100, feedback}`. Порог зачёта 60. Если `SpeechRecognition` недоступен — упражнение помечается skipped и не влияет на score.
- Listening: `speechSynthesis.speak()` произносит `dataJson.audioText` (en-US); пользователь выбирает/печатает услышанное; проверка точная (нормализация регистра/пунктуации).

### 4.4 Стрик и daily check-in
- При первом заходе в день (сравнение дат в TZ пользователя, хранить UTC): если вчера был вход — `streakCount+1`, иначе сброс в 1; бонус XP = 10 + 2×streak (cap 50).

### 4.5 AI-промпты (`lib/ai.ts`)
- Системный промпт: «Ты — доброжелательный репетитор английского, отвечай по-русски, кратко…».
- `reviewLesson(errors[])` → JSON: по каждой ошибке — объяснение + правило + рекомендация.
- `evaluateSpeaking(expected, recognized)` / `evaluateTranslation(src, expected, given)` → `{score, feedback}`.
- Все ответы запрашиваются как строгий JSON, парс с fallback.

## 5. Контент: 20 уровней (seed)

Треки difficulty: уровни 1–8 beginner (A1–A2), 9–15 intermediate (B1), 16–20 advanced (B2).
Темы (ориентир): алфавит/приветствия, to be, артикли, Present Simple, множественное число, местоимения, Present Continuous, предлоги места, Past Simple, неправильные глаголы, Future, сравнения, Present Perfect, модальные глаголы, условные 0/1, пассив, косвенная речь, условные 2/3, фразовые глаголы, идиомы/стиль.
Каждый уровень: theoryMd (RU-объяснение + EN-примеры), 10±2 упражнений (минимум 1 listening и 1 speaking с уровня 3+), карточка-приз.
ЕГЭ/IELTS: по 2 демо-урока в формате соответствующих заданий.

## 6. Переменные окружения

```
TURSO_DATABASE_URL, TURSO_AUTH_TOKEN
BETTER_AUTH_SECRET, BETTER_AUTH_URL
ANTHROPIC_API_KEY
```

## 7. Безопасность
- Все проверки лимитов, ответов, выдачи наград — только на сервере.
- Ответы на упражнения (answerJson) не отдаются клиенту до завершения.
- Rate-limit на AI-эндпоинты (напр. 20 вызовов/час на пользователя).
