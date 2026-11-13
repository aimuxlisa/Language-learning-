# LinguaQuest — AI-репетитор по английскому

SaaS для изучения английского в игровой форме: 20 уровней, AI-разбор ошибок (Claude),
speaking/listening через Web Speech API, карточки-призы, стрики, подготовка к ЕГЭ и IELTS.

Документы: [PRD.md](PRD.md) · [SPEC.md](SPEC.md) · [TASKS.md](TASKS.md)

## Запуск

```bash
npm install
cp .env.example .env.local   # заполните переменные
npm run db:push              # применить схему к БД
npm run db:seed              # залить 24 урока, 204 упражнения, 20 карточек
npm run dev                  # http://localhost:3000
```

## Переменные окружения

| Переменная | Описание |
|---|---|
| `TURSO_DATABASE_URL` | URL БД. Локально — `file:local.db`, в проде — `libsql://…` от Turso |
| `TURSO_AUTH_TOKEN` | Токен Turso (для локального file: не нужен) |
| `BETTER_AUTH_SECRET` | Длинная случайная строка для сессий |
| `BETTER_AUTH_URL` | Базовый URL приложения |
| `ANTHROPIC_API_KEY` | Ключ Claude API. Без него AI-разбор работает в режиме фолбэка (сравнение с эталоном) |

## Стек

Next.js 16 (App Router) · Tailwind v4 · Drizzle ORM + Turso (libSQL) · better-auth ·
Claude API (`claude-haiku-5-5`) · Web Speech API (TTS + распознавание речи).

## Тарифы

- **Free** — 5 уроков или 20 минут в сутки (скользящее окно 24ч), уровни 1–5.
- **Pro** — без ограничений (платёжная интеграция — заглушка, подключается позже).

## Структура

- `content/` — исходники уроков (уровни, упражнения, карточки), заливаются сидом
- `src/db/` — схема Drizzle, подключение, seed
- `src/lib/` — auth, лимиты, XP/стрики, AI (оценка + разбор), проверка ответов
- `src/app/(auth)` — вход/регистрация; `src/app/(app)` — кабинет, уроки, экзамены, коллекция
- `src/components/lesson/` — плеер урока и компоненты упражнений

## Примечания

- Speaking-задания используют `SpeechRecognition` — стабильно в Chrome/Edge; в остальных
  браузерах задание можно пропустить без штрафа.
- AI-вызовы ограничены 30/час на пользователя (in-memory), разбор ошибок кэшируется по попытке.
