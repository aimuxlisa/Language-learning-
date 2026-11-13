import type { LevelDef } from "./types";

// Уровни 1–5 (beginner, A1)
export const levelsA: LevelDef[] = [
  {
    id: "gen-01",
    track: "general",
    orderIndex: 1,
    title: "Приветствия и знакомство",
    subtitle: "Hello! What's your name?",
    difficulty: "beginner",
    cardId: "card-01",
    theoryMd: `## Приветствия

Базовые фразы для знакомства:

- **Hello / Hi** — привет
- **Good morning / afternoon / evening** — доброе утро / день / вечер
- **What's your name?** — Как тебя зовут?
- **My name is…** / **I'm…** — Меня зовут… / Я…
- **Nice to meet you** — Приятно познакомиться
- **How are you?** — Как дела? → **I'm fine, thanks** — Хорошо, спасибо
- **Goodbye / Bye / See you** — до свидания / пока / увидимся

> В английском нет разницы между «ты» и «вы» — всегда **you**.`,
    exercises: [
      { type: "quiz", skill: "vocabulary", prompt: "Как сказать «Приятно познакомиться»?", data: { options: ["How are you?", "Nice to meet you", "Good morning", "See you"] }, answer: { index: 1 } },
      { type: "quiz", skill: "vocabulary", prompt: "Что ответить на «How are you?»", data: { options: ["My name is Anna", "I'm fine, thanks", "Goodbye", "Yes, please"] }, answer: { index: 1 } },
      { type: "gap_fill", skill: "vocabulary", prompt: "Вставьте пропущенное слово: «Good ___!» (доброе утро)", data: { text: "Good ___!" }, answer: { accept: ["morning"] } },
      { type: "word_order", skill: "grammar", prompt: "Соберите фразу: «Меня зовут Макс»", data: { words: ["Max", "name", "My", "is"] }, answer: { sentence: "My name is Max" } },
      { type: "quiz", skill: "vocabulary", prompt: "Вечером при встрече вы скажете…", data: { options: ["Good night", "Good evening", "Good morning", "Good bye"] }, answer: { index: 1 } },
      { type: "gap_fill", skill: "spelling", prompt: "Допишите: «What's your n___?» (имя)", data: { text: "What's your n___?" }, answer: { accept: ["name"] } },
      { type: "word_order", skill: "grammar", prompt: "Соберите вопрос: «Как дела?»", data: { words: ["are", "How", "you"] }, answer: { sentence: "How are you" } },
      { type: "translate", skill: "vocabulary", prompt: "Переведите на английский: «Привет! Я Анна.»", data: { source: "Привет! Я Анна." }, answer: { reference: "Hello! I'm Anna." } },
    ],
  },
  {
    id: "gen-02",
    track: "general",
    orderIndex: 2,
    title: "Глагол to be",
    subtitle: "I am, you are, he is",
    difficulty: "beginner",
    cardId: "card-02",
    theoryMd: `## Глагол to be (быть)

Самый важный глагол английского. Настоящее время — три формы:

| Лицо | Форма | Пример |
|---|---|---|
| I | **am** | I am a student |
| he / she / it | **is** | She is happy |
| you / we / they | **are** | They are friends |

**Сокращения:** I'm, he's, she's, it's, you're, we're, they're.

**Отрицание:** добавьте *not* — I am **not** tired. She is**n't** here.

**Вопрос:** to be идёт первым — **Are** you ready? **Is** he a doctor?`,
    exercises: [
      { type: "quiz", skill: "grammar", prompt: "She ___ a teacher.", data: { options: ["am", "is", "are", "be"] }, answer: { index: 1 } },
      { type: "quiz", skill: "grammar", prompt: "They ___ from Russia.", data: { options: ["is", "am", "are", "be"] }, answer: { index: 2 } },
      { type: "gap_fill", skill: "grammar", prompt: "Вставьте форму to be: «I ___ a student.»", data: { text: "I ___ a student." }, answer: { accept: ["am", "'m"] } },
      { type: "gap_fill", skill: "grammar", prompt: "Вставьте форму to be: «It ___ cold today.»", data: { text: "It ___ cold today." }, answer: { accept: ["is", "'s"] } },
      { type: "word_order", skill: "grammar", prompt: "Соберите вопрос: «Ты готов?»", data: { words: ["you", "Are", "ready"] }, answer: { sentence: "Are you ready" } },
      { type: "multi_quiz", skill: "grammar", prompt: "Отметьте ПРАВИЛЬНЫЕ предложения:", data: { options: ["He are happy", "We are friends", "I is a doctor", "She is at home"] }, answer: { indices: [1, 3] } },
      { type: "word_order", skill: "grammar", prompt: "Соберите отрицание: «Мы не устали»", data: { words: ["not", "We", "tired", "are"] }, answer: { sentence: "We are not tired" } },
      { type: "translate", skill: "grammar", prompt: "Переведите: «Он мой друг.»", data: { source: "Он мой друг." }, answer: { reference: "He is my friend." } },
    ],
  },
  {
    id: "gen-03",
    track: "general",
    orderIndex: 3,
    title: "Артикли a / an / the",
    subtitle: "A cat, an apple, the sun",
    difficulty: "beginner",
    cardId: "card-03",
    theoryMd: `## Артикли

**a / an** — неопределённый артикль: «какой-то, один из многих». Только с единственным числом.

- **a** перед согласным звуком: a cat, a book, a university
- **an** перед гласным звуком: an apple, an hour, an egg

**the** — определённый артикль: «тот самый, конкретный».

- The sun is bright. (солнце одно)
- I have a dog. **The** dog is black. (уже знакомый нам пёс)

**Без артикля:** имена, города, языки, еда в общем смысле — I speak English. I like coffee.`,
    exercises: [
      { type: "quiz", skill: "grammar", prompt: "I see ___ apple on the table.", data: { options: ["a", "an", "the", "—"] }, answer: { index: 1 } },
      { type: "quiz", skill: "grammar", prompt: "___ sun rises in the east.", data: { options: ["A", "An", "The", "—"] }, answer: { index: 2 } },
      { type: "gap_fill", skill: "grammar", prompt: "Вставьте артикль: «She has ___ cat.»", data: { text: "She has ___ cat." }, answer: { accept: ["a"] } },
      { type: "quiz", skill: "grammar", prompt: "Где артикль НЕ нужен?", data: { options: ["I speak ___ English", "I have ___ dog", "Give me ___ pen", "He is ___ engineer"] }, answer: { index: 0 } },
      { type: "gap_fill", skill: "grammar", prompt: "«He is ___ honest man.» (h не читается!)", data: { text: "He is ___ honest man." }, answer: { accept: ["an"] } },
      { type: "listening", skill: "listening", prompt: "Прослушайте и напечатайте фразу", data: { audioText: "I have a dog" }, answer: { accept: ["I have a dog"] } },
      { type: "word_order", skill: "grammar", prompt: "Соберите: «Это интересная книга»", data: { words: ["an", "is", "book", "This", "interesting"] }, answer: { sentence: "This is an interesting book" } },
      { type: "speaking", skill: "speaking", prompt: "Произнесите вслух:", data: { text: "The sun is bright today" }, answer: { reference: "The sun is bright today" } },
      { type: "translate", skill: "grammar", prompt: "Переведите: «У меня есть кошка. Кошка белая.»", data: { source: "У меня есть кошка. Кошка белая." }, answer: { reference: "I have a cat. The cat is white." } },
    ],
  },
  {
    id: "gen-04",
    track: "general",
    orderIndex: 4,
    title: "Present Simple",
    subtitle: "I work, she works",
    difficulty: "beginner",
    cardId: "card-04",
    theoryMd: `## Present Simple — простое настоящее

Регулярные действия, факты, привычки: *каждый день, обычно, всегда*.

- I / you / we / they → глагол без изменений: They **work**.
- he / she / it → глагол + **-s**: She **works**.

**Отрицание:** don't / doesn't + глагол: I **don't like** tea. He **doesn't play** chess.

**Вопрос:** Do / Does + подлежащее + глагол: **Do** you live here? **Does** she speak English?

> После does/doesn't глагол БЕЗ -s: Does she work**~~s~~**? → Does she work?`,
    exercises: [
      { type: "quiz", skill: "grammar", prompt: "She ___ in a bank.", data: { options: ["work", "works", "working", "is work"] }, answer: { index: 1 } },
      { type: "gap_fill", skill: "grammar", prompt: "«He ___ (play) football on Sundays.»", data: { text: "He ___ football on Sundays." }, answer: { accept: ["plays"] } },
      { type: "quiz", skill: "grammar", prompt: "___ you like coffee?", data: { options: ["Does", "Is", "Do", "Are"] }, answer: { index: 2 } },
      { type: "quiz", skill: "grammar", prompt: "Выберите правильное отрицание:", data: { options: ["She don't know", "She doesn't knows", "She doesn't know", "She not know"] }, answer: { index: 2 } },
      { type: "word_order", skill: "grammar", prompt: "Соберите вопрос: «Она говорит по-английски?»", data: { words: ["she", "English", "Does", "speak"] }, answer: { sentence: "Does she speak English" } },
      { type: "listening", skill: "listening", prompt: "Прослушайте и напечатайте", data: { audioText: "I get up at seven o'clock" }, answer: { accept: ["I get up at seven o'clock", "I get up at 7 o'clock"] } },
      { type: "multi_quiz", skill: "grammar", prompt: "Отметьте правильные предложения:", data: { options: ["He goes to school", "They plays tennis", "We don't like rain", "She watch TV"] }, answer: { indices: [0, 2] } },
      { type: "speaking", skill: "speaking", prompt: "Произнесите:", data: { text: "I usually drink coffee in the morning" }, answer: { reference: "I usually drink coffee in the morning" } },
      { type: "translate", skill: "grammar", prompt: "Переведите: «Он живёт в Москве.»", data: { source: "Он живёт в Москве." }, answer: { reference: "He lives in Moscow." } },
    ],
  },
  {
    id: "gen-05",
    track: "general",
    orderIndex: 5,
    title: "Множественное число",
    subtitle: "Cats, boxes, children",
    difficulty: "beginner",
    cardId: "card-05",
    theoryMd: `## Множественное число существительных

Обычно добавляем **-s**: cat → cats, book → books.

**-es** после -s, -x, -ch, -sh, -o: box → box**es**, bus → bus**es**, tomato → tomato**es**.

**Согласная + y → -ies:** city → cit**ies**, baby → bab**ies**. (Но: boy → boys!)

**-f/-fe → -ves:** knife → kni**ves**, wolf → wol**ves**.

**Исключения (запомнить!):**
man → men, woman → women, child → children, foot → feet, tooth → teeth, mouse → mice, person → people.`,
    exercises: [
      { type: "quiz", skill: "spelling", prompt: "Множественное число от «box»:", data: { options: ["boxs", "boxes", "boxies", "box"] }, answer: { index: 1 } },
      { type: "gap_fill", skill: "spelling", prompt: "Напишите множественное число: child → ___", data: { text: "child → ___" }, answer: { accept: ["children"] } },
      { type: "gap_fill", skill: "spelling", prompt: "city → ___", data: { text: "city → ___" }, answer: { accept: ["cities"] } },
      { type: "quiz", skill: "spelling", prompt: "Что здесь написано с ошибкой?", data: { options: ["wolves", "mice", "womans", "feet"] }, answer: { index: 2 } },
      { type: "gap_fill", skill: "spelling", prompt: "mouse → ___", data: { text: "mouse → ___" }, answer: { accept: ["mice"] } },
      { type: "listening", skill: "listening", prompt: "Прослушайте и напечатайте", data: { audioText: "Two children and three dogs" }, answer: { accept: ["Two children and three dogs", "2 children and 3 dogs"] } },
      { type: "multi_quiz", skill: "spelling", prompt: "Отметьте слова, написанные ПРАВИЛЬНО:", data: { options: ["tomatoes", "knifes", "people", "mans"] }, answer: { indices: [0, 2] } },
      { type: "speaking", skill: "speaking", prompt: "Произнесите:", data: { text: "There are many people in the city" }, answer: { reference: "There are many people in the city" } },
      { type: "translate", skill: "vocabulary", prompt: "Переведите: «У них трое детей.»", data: { source: "У них трое детей." }, answer: { reference: "They have three children." } },
    ],
  },
];
