import type { LevelDef } from "./types";

// Уровни 6–10 (beginner → низкий intermediate, A2)
export const levelsB: LevelDef[] = [
  {
    id: "gen-06",
    track: "general",
    orderIndex: 6,
    title: "Местоимения",
    subtitle: "I — me — my — mine",
    difficulty: "beginner",
    cardId: "card-06",
    theoryMd: `## Местоимения

| Кто? | Кого/кому? | Чей? (+сущ.) | Чей? (без сущ.) |
|---|---|---|---|
| I | me | my | mine |
| you | you | your | yours |
| he | him | his | his |
| she | her | her | hers |
| it | it | its | — |
| we | us | our | ours |
| they | them | their | theirs |

- **She** loves **him**. — Она любит его.
- This is **my** book. The book is **mine**. — Моя книга. Книга моя.
- Give it to **us**. — Дай это нам.`,
    exercises: [
      { type: "quiz", skill: "grammar", prompt: "This is my sister. I love ___.", data: { options: ["she", "her", "hers", "him"] }, answer: { index: 1 } },
      { type: "gap_fill", skill: "grammar", prompt: "«Это их дом.» → «It is ___ house.»", data: { text: "It is ___ house." }, answer: { accept: ["their"] } },
      { type: "quiz", skill: "grammar", prompt: "Whose pen is this? — It's ___.", data: { options: ["my", "me", "mine", "I"] }, answer: { index: 2 } },
      { type: "word_order", skill: "grammar", prompt: "Соберите: «Он даёт нам книги»", data: { words: ["gives", "He", "books", "us"] }, answer: { sentence: "He gives us books" } },
      { type: "gap_fill", skill: "grammar", prompt: "«Я вижу его каждый день.» → «I see ___ every day.»", data: { text: "I see ___ every day." }, answer: { accept: ["him"] } },
      { type: "listening", skill: "listening", prompt: "Прослушайте и напечатайте", data: { audioText: "She gave me her phone number" }, answer: { accept: ["She gave me her phone number"] } },
      { type: "multi_quiz", skill: "grammar", prompt: "Отметьте правильные варианты:", data: { options: ["Me is happy", "This book is hers", "Us like pizza", "Their car is red"] }, answer: { indices: [1, 3] } },
      { type: "speaking", skill: "speaking", prompt: "Произнесите:", data: { text: "This is our house and that is theirs" }, answer: { reference: "This is our house and that is theirs" } },
      { type: "translate", skill: "grammar", prompt: "Переведите: «Эта книга моя, а та — её.»", data: { source: "Эта книга моя, а та — её." }, answer: { reference: "This book is mine, and that one is hers." } },
    ],
  },
  {
    id: "gen-07",
    track: "general",
    orderIndex: 7,
    title: "Present Continuous",
    subtitle: "I am reading now",
    difficulty: "beginner",
    cardId: "card-07",
    theoryMd: `## Present Continuous — происходит сейчас

**to be + глагол-ing**: действие в момент речи (*now, at the moment*).

- I **am reading** a book. — Я читаю (прямо сейчас).
- She **is cooking** dinner. — Она готовит ужин.
- They **are playing** football. — Они играют в футбол.

**Вопрос:** **Are** you listening? **Is** he sleeping?
**Отрицание:** I'm **not** working. He is**n't** watching TV.

**Сравните:**
- I **work** every day. (регулярно → Present Simple)
- I **am working** now. (сейчас → Present Continuous)

> Глаголы состояния (know, like, want, love) обычно НЕ используются в Continuous.`,
    exercises: [
      { type: "quiz", skill: "grammar", prompt: "Look! She ___ a letter.", data: { options: ["writes", "is writing", "write", "writing"] }, answer: { index: 1 } },
      { type: "gap_fill", skill: "grammar", prompt: "«They ___ (play) chess now.»", data: { text: "They ___ chess now." }, answer: { accept: ["are playing"] } },
      { type: "quiz", skill: "grammar", prompt: "Выберите правильное предложение:", data: { options: ["I am knowing him", "I know him", "I knowing him", "I is know him"] }, answer: { index: 1 } },
      { type: "word_order", skill: "grammar", prompt: "Соберите вопрос: «Ты меня слушаешь?»", data: { words: ["listening", "you", "Are", "to", "me"] }, answer: { sentence: "Are you listening to me" } },
      { type: "quiz", skill: "grammar", prompt: "I ___ TV now, I'm busy.", data: { options: ["don't watch", "am not watching", "not watch", "doesn't watch"] }, answer: { index: 1 } },
      { type: "listening", skill: "listening", prompt: "Прослушайте и напечатайте", data: { audioText: "The children are sleeping now" }, answer: { accept: ["The children are sleeping now"] } },
      { type: "multi_quiz", skill: "grammar", prompt: "Где Present Continuous уместен?", data: { options: ["Я сейчас обедаю", "Он работает каждый день", "Смотри, идёт дождь!", "Вода кипит при 100°C"] }, answer: { indices: [0, 2] } },
      { type: "speaking", skill: "speaking", prompt: "Произнесите:", data: { text: "I am learning English right now" }, answer: { reference: "I am learning English right now" } },
      { type: "translate", skill: "grammar", prompt: "Переведите: «Она сейчас готовит ужин.»", data: { source: "Она сейчас готовит ужин." }, answer: { reference: "She is cooking dinner now." } },
    ],
  },
  {
    id: "gen-08",
    track: "general",
    orderIndex: 8,
    title: "Предлоги места",
    subtitle: "In, on, under, between",
    difficulty: "beginner",
    cardId: "card-08",
    theoryMd: `## Предлоги места

- **in** — внутри: in the box, in the room, in Moscow
- **on** — на поверхности: on the table, on the wall
- **under** — под: under the bed
- **next to / near** — рядом: next to the window
- **between** — между (двумя): between the chairs
- **behind** — за, позади: behind the house
- **in front of** — перед: in front of the door
- **above / over** — над: above the sofa

> Запомните: **in** the picture, **on** the left/right, **at** home/school/work.`,
    exercises: [
      { type: "quiz", skill: "vocabulary", prompt: "The cat is ___ the table. (под)", data: { options: ["on", "in", "under", "between"] }, answer: { index: 2 } },
      { type: "gap_fill", skill: "vocabulary", prompt: "«Книга на столе.» → «The book is ___ the table.»", data: { text: "The book is ___ the table." }, answer: { accept: ["on"] } },
      { type: "quiz", skill: "vocabulary", prompt: "The bank is ___ the shop and the cafe.", data: { options: ["under", "between", "on", "above"] }, answer: { index: 1 } },
      { type: "gap_fill", skill: "vocabulary", prompt: "«Я дома.» → «I am ___ home.»", data: { text: "I am ___ home." }, answer: { accept: ["at"] } },
      { type: "word_order", skill: "grammar", prompt: "Соберите: «Машина перед домом»", data: { words: ["in", "the", "The", "front", "car", "is", "of", "house"] }, answer: { sentence: "The car is in front of the house" } },
      { type: "listening", skill: "listening", prompt: "Прослушайте и напечатайте", data: { audioText: "The keys are under the chair" }, answer: { accept: ["The keys are under the chair"] } },
      { type: "quiz", skill: "vocabulary", prompt: "Лампа висит НАД столом:", data: { options: ["The lamp is under the table", "The lamp is above the table", "The lamp is behind the table", "The lamp is in the table"] }, answer: { index: 1 } },
      { type: "speaking", skill: "speaking", prompt: "Произнесите:", data: { text: "My bag is next to the door" }, answer: { reference: "My bag is next to the door" } },
      { type: "translate", skill: "vocabulary", prompt: "Переведите: «Кошка спит под кроватью.»", data: { source: "Кошка спит под кроватью." }, answer: { reference: "The cat is sleeping under the bed." } },
    ],
  },
  {
    id: "gen-09",
    track: "general",
    orderIndex: 9,
    title: "Past Simple",
    subtitle: "I worked yesterday",
    difficulty: "intermediate",
    cardId: "card-09",
    theoryMd: `## Past Simple — простое прошедшее

Завершённые действия в прошлом: *yesterday, last week, in 2010, ago*.

**Правильные глаголы:** + **-ed**: work → work**ed**, play → play**ed**, stop → stop**ped**, study → stud**ied**.

**Отрицание:** didn't + глагол: I **didn't see** him.
**Вопрос:** Did + подлежащее + глагол: **Did** you call her?

> После did/didn't — глагол в начальной форме: Did you work**~~ed~~**? → Did you work?

**to be в прошлом:** was (I/he/she/it), were (you/we/they): I **was** tired. They **were** happy.`,
    exercises: [
      { type: "quiz", skill: "grammar", prompt: "I ___ football yesterday.", data: { options: ["play", "played", "plays", "playing"] }, answer: { index: 1 } },
      { type: "gap_fill", skill: "grammar", prompt: "«She ___ (study) English last year.»", data: { text: "She ___ English last year." }, answer: { accept: ["studied"] } },
      { type: "quiz", skill: "grammar", prompt: "___ you watch the film?", data: { options: ["Do", "Does", "Did", "Was"] }, answer: { index: 2 } },
      { type: "quiz", skill: "grammar", prompt: "They ___ at home last night.", data: { options: ["was", "were", "did", "are"] }, answer: { index: 1 } },
      { type: "word_order", skill: "grammar", prompt: "Соберите отрицание: «Я не звонил тебе вчера»", data: { words: ["didn't", "I", "yesterday", "call", "you"] }, answer: { sentence: "I didn't call you yesterday" } },
      { type: "listening", skill: "listening", prompt: "Прослушайте и напечатайте", data: { audioText: "We visited our grandmother last weekend" }, answer: { accept: ["We visited our grandmother last weekend"] } },
      { type: "multi_quiz", skill: "grammar", prompt: "Отметьте правильные предложения:", data: { options: ["Did she called you?", "I was at school", "He didn't come", "They was late"] }, answer: { indices: [1, 2] } },
      { type: "speaking", skill: "speaking", prompt: "Произнесите:", data: { text: "I worked a lot yesterday" }, answer: { reference: "I worked a lot yesterday" } },
      { type: "translate", skill: "grammar", prompt: "Переведите: «Мы смотрели фильм вчера вечером.»", data: { source: "Мы смотрели фильм вчера вечером." }, answer: { reference: "We watched a film last night." } },
    ],
  },
  {
    id: "gen-10",
    track: "general",
    orderIndex: 10,
    title: "Неправильные глаголы",
    subtitle: "Go — went, see — saw",
    difficulty: "intermediate",
    cardId: "card-10",
    theoryMd: `## Неправильные глаголы

Самые частые глаголы не подчиняются правилу -ed. Вторую форму нужно запомнить:

| Глагол | Past | Перевод |
|---|---|---|
| go | **went** | идти |
| see | **saw** | видеть |
| have | **had** | иметь |
| do | **did** | делать |
| say | **said** | сказать |
| get | **got** | получать |
| make | **made** | делать |
| take | **took** | брать |
| come | **came** | приходить |
| buy | **bought** | покупать |
| eat | **ate** | есть |
| drink | **drank** | пить |

> В вопросах и отрицаниях — начальная форма: Did you **go**? I didn't **see**.`,
    exercises: [
      { type: "gap_fill", skill: "grammar", prompt: "go → ___ (прошедшая форма)", data: { text: "go → ___" }, answer: { accept: ["went"] } },
      { type: "gap_fill", skill: "grammar", prompt: "buy → ___", data: { text: "buy → ___" }, answer: { accept: ["bought"] } },
      { type: "quiz", skill: "grammar", prompt: "She ___ a new phone last week.", data: { options: ["buyed", "bought", "buy", "buys"] }, answer: { index: 1 } },
      { type: "quiz", skill: "grammar", prompt: "I ___ him at the party.", data: { options: ["seed", "sawed", "saw", "seen"] }, answer: { index: 2 } },
      { type: "gap_fill", skill: "grammar", prompt: "«We ___ (eat) pizza for dinner.»", data: { text: "We ___ pizza for dinner." }, answer: { accept: ["ate"] } },
      { type: "word_order", skill: "grammar", prompt: "Соберите: «Он пришёл домой поздно»", data: { words: ["home", "came", "He", "late"] }, answer: { sentence: "He came home late" } },
      { type: "listening", skill: "listening", prompt: "Прослушайте и напечатайте", data: { audioText: "She went to the shop and bought bread" }, answer: { accept: ["She went to the shop and bought bread"] } },
      { type: "multi_quiz", skill: "grammar", prompt: "Отметьте НЕПРАВИЛЬНЫЕ формы:", data: { options: ["went", "taked", "made", "goed"] }, answer: { indices: [1, 3] } },
      { type: "speaking", skill: "speaking", prompt: "Произнесите:", data: { text: "I went to London and saw Big Ben" }, answer: { reference: "I went to London and saw Big Ben" } },
      { type: "translate", skill: "grammar", prompt: "Переведите: «Она взяла мою книгу.»", data: { source: "Она взяла мою книгу." }, answer: { reference: "She took my book." } },
    ],
  },
];
