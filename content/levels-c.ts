import type { LevelDef } from "./types";

// Уровни 11–15 (intermediate, B1)
export const levelsC: LevelDef[] = [
  {
    id: "gen-11",
    track: "general",
    orderIndex: 11,
    title: "Будущее время",
    subtitle: "Will и going to",
    difficulty: "intermediate",
    cardId: "card-11",
    theoryMd: `## Будущее время

**will + глагол** — спонтанные решения, предсказания, обещания:
- I **will help** you. — Я помогу тебе (решил сейчас).
- It **will rain** tomorrow. — Завтра будет дождь (мнение).

**be going to + глагол** — планы и намерения, очевидное будущее:
- I **am going to visit** my parents. — Я собираюсь навестить родителей (план).
- Look at the clouds! It **is going to rain**. — Сейчас пойдёт дождь (очевидно).

**Отрицание:** won't (= will not), isn't/aren't going to.
**Вопрос:** **Will** you come? **Are** you going to stay?`,
    exercises: [
      { type: "quiz", skill: "grammar", prompt: "Телефон звонит. «I ___ answer it!»", data: { options: ["am going to", "will", "going to", "won't to"] }, answer: { index: 1 } },
      { type: "quiz", skill: "grammar", prompt: "We ___ move to a new flat next month. (план)", data: { options: ["will", "are going to", "going", "won't"] }, answer: { index: 1 } },
      { type: "gap_fill", skill: "grammar", prompt: "«Я не скажу ему.» → «I ___ tell him.» (сокращённо)", data: { text: "I ___ tell him." }, answer: { accept: ["won't", "will not"] } },
      { type: "word_order", skill: "grammar", prompt: "Соберите: «Ты придёшь завтра?»", data: { words: ["come", "you", "Will", "tomorrow"] }, answer: { sentence: "Will you come tomorrow" } },
      { type: "quiz", skill: "grammar", prompt: "Look at the sky! It ___ snow.", data: { options: ["will to", "is going to", "going to", "is go to"] }, answer: { index: 1 } },
      { type: "listening", skill: "listening", prompt: "Прослушайте и напечатайте", data: { audioText: "I will call you tomorrow morning" }, answer: { accept: ["I will call you tomorrow morning"] } },
      { type: "multi_quiz", skill: "grammar", prompt: "Где уместно going to?", data: { options: ["Заранее запланированная поездка", "Обещание, данное только что", "Тучи: сейчас будет гроза", "Спонтанное «я открою дверь»"] }, answer: { indices: [0, 2] } },
      { type: "speaking", skill: "speaking", prompt: "Произнесите:", data: { text: "I am going to study English every day" }, answer: { reference: "I am going to study English every day" } },
      { type: "translate", skill: "grammar", prompt: "Переведите: «Завтра я помогу тебе.»", data: { source: "Завтра я помогу тебе." }, answer: { reference: "I will help you tomorrow." } },
    ],
  },
  {
    id: "gen-12",
    track: "general",
    orderIndex: 12,
    title: "Степени сравнения",
    subtitle: "Big — bigger — the biggest",
    difficulty: "intermediate",
    cardId: "card-12",
    theoryMd: `## Степени сравнения прилагательных

**Короткие (1–2 слога):** + -er / the -est
- big → **bigger** → the **biggest**
- happy → **happier** → the **happiest**

**Длинные (2+ слога):** more / the most
- interesting → **more interesting** → the **most interesting**

**Исключения:**
- good → **better** → the **best**
- bad → **worse** → the **worst**
- far → **farther** → the **farthest**

**Сравнение:** than — She is taller **than** me.
**Равенство:** as … as — He is **as smart as** his brother.`,
    exercises: [
      { type: "quiz", skill: "grammar", prompt: "This book is ___ than that one.", data: { options: ["interestinger", "more interesting", "most interesting", "interestingest"] }, answer: { index: 1 } },
      { type: "gap_fill", skill: "grammar", prompt: "good → ___ → the best", data: { text: "good → ___ → the best" }, answer: { accept: ["better"] } },
      { type: "gap_fill", skill: "grammar", prompt: "«Это самый большой город.» → «It is the ___ city.»", data: { text: "It is the ___ city." }, answer: { accept: ["biggest", "largest"] } },
      { type: "quiz", skill: "grammar", prompt: "My car is ___ than yours.", data: { options: ["fast", "faster", "fastest", "more fast"] }, answer: { index: 1 } },
      { type: "word_order", skill: "grammar", prompt: "Соберите: «Он так же высок, как его отец»", data: { words: ["tall", "He", "as", "is", "his", "as", "father"] }, answer: { sentence: "He is as tall as his father" } },
      { type: "listening", skill: "listening", prompt: "Прослушайте и напечатайте", data: { audioText: "Today is colder than yesterday" }, answer: { accept: ["Today is colder than yesterday"] } },
      { type: "multi_quiz", skill: "grammar", prompt: "Отметьте правильные формы:", data: { options: ["worse", "more better", "the happiest", "baddest"] }, answer: { indices: [0, 2] } },
      { type: "speaking", skill: "speaking", prompt: "Произнесите:", data: { text: "English is easier than I thought" }, answer: { reference: "English is easier than I thought" } },
      { type: "translate", skill: "grammar", prompt: "Переведите: «Эта задача труднее, чем та.»", data: { source: "Эта задача труднее, чем та." }, answer: { reference: "This task is more difficult than that one." } },
    ],
  },
  {
    id: "gen-13",
    track: "general",
    orderIndex: 13,
    title: "Present Perfect",
    subtitle: "I have done it",
    difficulty: "intermediate",
    cardId: "card-13",
    theoryMd: `## Present Perfect — результат к настоящему

**have/has + третья форма глагола (V3)**

Действие в прошлом, результат важен сейчас; опыт; ещё не завершённый период.

- I **have lost** my keys. — Я потерял ключи (и сейчас их нет).
- She **has been** to Paris. — Она бывала в Париже (опыт).
- We **have lived** here **for** 5 years / **since** 2020.

**Маркеры:** already, just, yet, ever, never, for, since.

**Сравните с Past Simple:**
- I **saw** him yesterday. (когда? вчера → Past Simple)
- I **have seen** this film. (есть опыт, неважно когда → Present Perfect)`,
    exercises: [
      { type: "quiz", skill: "grammar", prompt: "I ___ already ___ my homework.", data: { options: ["have / did", "have / done", "has / done", "did / do"] }, answer: { index: 1 } },
      { type: "gap_fill", skill: "grammar", prompt: "«She ___ (be) to London twice.»", data: { text: "She ___ to London twice. (2 слова)" }, answer: { accept: ["has been"] } },
      { type: "quiz", skill: "grammar", prompt: "We have lived here ___ 2019.", data: { options: ["for", "since", "ago", "from"] }, answer: { index: 1 } },
      { type: "quiz", skill: "grammar", prompt: "Выберите правильное:", data: { options: ["I have seen him yesterday", "I saw him yesterday", "I seen him yesterday", "I have see him yesterday"] }, answer: { index: 1 } },
      { type: "word_order", skill: "grammar", prompt: "Соберите вопрос: «Ты когда-нибудь был в Японии?»", data: { words: ["ever", "you", "Have", "been", "Japan", "to"] }, answer: { sentence: "Have you ever been to Japan" } },
      { type: "listening", skill: "listening", prompt: "Прослушайте и напечатайте", data: { audioText: "I have just finished my work" }, answer: { accept: ["I have just finished my work"] } },
      { type: "multi_quiz", skill: "grammar", prompt: "Маркеры Present Perfect:", data: { options: ["already", "yesterday", "just", "last week"] }, answer: { indices: [0, 2] } },
      { type: "speaking", skill: "speaking", prompt: "Произнесите:", data: { text: "I have never been to America" }, answer: { reference: "I have never been to America" } },
      { type: "translate", skill: "grammar", prompt: "Переведите: «Я только что закончил урок.»", data: { source: "Я только что закончил урок." }, answer: { reference: "I have just finished the lesson." } },
    ],
  },
  {
    id: "gen-14",
    track: "general",
    orderIndex: 14,
    title: "Модальные глаголы",
    subtitle: "Can, must, should, may",
    difficulty: "intermediate",
    cardId: "card-14",
    theoryMd: `## Модальные глаголы

После модального глагола — начальная форма без to:

- **can** — умение/возможность: I **can swim**. **Can** I come in?
- **could** — мог / вежливая просьба: **Could** you help me?
- **must** — обязан (сильно): You **must** stop here.
- **have to** — вынужден (обстоятельства): I **have to** work late.
- **should** — следует (совет): You **should** see a doctor.
- **may / might** — возможно, вероятно: It **may** rain.

**Отрицания:** can't (не умею/нельзя), mustn't (запрещено!), don't have to (не обязан), shouldn't (не стоит).

> **mustn't** ≠ **don't have to**: первое — запрет, второе — отсутствие необходимости.`,
    exercises: [
      { type: "quiz", skill: "grammar", prompt: "___ you speak French? — Yes, a little.", data: { options: ["Must", "Can", "Should", "May"] }, answer: { index: 1 } },
      { type: "quiz", skill: "grammar", prompt: "You look ill. You ___ see a doctor.", data: { options: ["can", "may", "should", "could"] }, answer: { index: 2 } },
      { type: "gap_fill", skill: "grammar", prompt: "«Здесь нельзя курить!» → «You ___ smoke here.» (запрет)", data: { text: "You ___ smoke here." }, answer: { accept: ["mustn't", "must not", "can't", "cannot"] } },
      { type: "quiz", skill: "grammar", prompt: "Сегодня суббота — I ___ get up early.", data: { options: ["mustn't", "don't have to", "can't", "shouldn't"] }, answer: { index: 1 } },
      { type: "word_order", skill: "grammar", prompt: "Соберите вежливую просьбу: «Не могли бы вы открыть окно?»", data: { words: ["you", "Could", "the", "open", "window"] }, answer: { sentence: "Could you open the window" } },
      { type: "listening", skill: "listening", prompt: "Прослушайте и напечатайте", data: { audioText: "You should drink more water" }, answer: { accept: ["You should drink more water"] } },
      { type: "multi_quiz", skill: "grammar", prompt: "Отметьте правильные предложения:", data: { options: ["He can to swim", "She must go now", "You should to rest", "I can help you"] }, answer: { indices: [1, 3] } },
      { type: "speaking", skill: "speaking", prompt: "Произнесите:", data: { text: "Can you help me with this exercise" }, answer: { reference: "Can you help me with this exercise" } },
      { type: "translate", skill: "grammar", prompt: "Переведите: «Тебе следует больше спать.»", data: { source: "Тебе следует больше спать." }, answer: { reference: "You should sleep more." } },
    ],
  },
  {
    id: "gen-15",
    track: "general",
    orderIndex: 15,
    title: "Условные предложения 0 и 1",
    subtitle: "If it rains, I'll stay home",
    difficulty: "intermediate",
    cardId: "card-15",
    theoryMd: `## Conditionals 0 и 1

**Zero Conditional** — общие истины, законы природы:
**If + Present Simple, Present Simple**
- If you **heat** ice, it **melts**. — Если нагреть лёд, он тает.

**First Conditional** — реальное будущее условие:
**If + Present Simple, will + глагол**
- If it **rains**, I **will stay** home. — Если пойдёт дождь, я останусь дома.

> В части с if НЕ ставим will: If it ~~will rain~~ → If it **rains**.

Вместо if можно: **when, as soon as, unless** (= if not):
- **Unless** you hurry, you **will miss** the bus.`,
    exercises: [
      { type: "quiz", skill: "grammar", prompt: "If you ___ water, it boils.", data: { options: ["will heat", "heat", "heated", "heats"] }, answer: { index: 1 } },
      { type: "quiz", skill: "grammar", prompt: "If it rains, we ___ at home.", data: { options: ["stay", "will stay", "stayed", "staying"] }, answer: { index: 1 } },
      { type: "gap_fill", skill: "grammar", prompt: "«If she ___ (come), I will tell her.»", data: { text: "If she ___, I will tell her." }, answer: { accept: ["comes"] } },
      { type: "quiz", skill: "grammar", prompt: "Найдите ошибку: «If I will see him, I will say hello.»", data: { options: ["will see → see", "will say → say", "ошибки нет", "If → When"] }, answer: { index: 0 } },
      { type: "word_order", skill: "grammar", prompt: "Соберите: «Если ты устал, отдохни»", data: { words: ["are", "you", "If", "rest", "tired,", "take", "a"] }, answer: { sentence: "If you are tired, take a rest" } },
      { type: "listening", skill: "listening", prompt: "Прослушайте и напечатайте", data: { audioText: "If you study hard, you will pass the exam" }, answer: { accept: ["If you study hard, you will pass the exam"] } },
      { type: "multi_quiz", skill: "grammar", prompt: "Отметьте правильные предложения:", data: { options: ["If it will snow, we will ski", "If it snows, we will ski", "Unless you run, you will be late", "If you will run, you are late"] }, answer: { indices: [1, 2] } },
      { type: "speaking", skill: "speaking", prompt: "Произнесите:", data: { text: "If I have time, I will call you" }, answer: { reference: "If I have time, I will call you" } },
      { type: "translate", skill: "grammar", prompt: "Переведите: «Если будет солнечно, мы пойдём в парк.»", data: { source: "Если будет солнечно, мы пойдём в парк." }, answer: { reference: "If it is sunny, we will go to the park." } },
    ],
  },
];
