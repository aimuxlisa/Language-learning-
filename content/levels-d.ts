import type { LevelDef } from "./types";

// Уровни 16–20 (advanced, B2)
export const levelsD: LevelDef[] = [
  {
    id: "gen-16",
    track: "general",
    orderIndex: 16,
    title: "Пассивный залог",
    subtitle: "The letter was written",
    difficulty: "advanced",
    cardId: "card-16",
    theoryMd: `## Passive Voice — пассивный залог

Когда важно действие, а не кто его совершил: **to be + V3**.

| Время | Пример |
|---|---|
| Present Simple | The letters **are sent** every day |
| Past Simple | The house **was built** in 1990 |
| Present Perfect | The work **has been done** |
| Future | The report **will be finished** tomorrow |

- Active: Shakespeare **wrote** Hamlet.
- Passive: Hamlet **was written** by Shakespeare.

**by + деятель** — если нужно указать, кем: The cake was made **by my mum**.`,
    exercises: [
      { type: "quiz", skill: "grammar", prompt: "This bridge ___ in 1932.", data: { options: ["built", "was built", "is build", "was build"] }, answer: { index: 1 } },
      { type: "gap_fill", skill: "grammar", prompt: "«English ___ (speak) all over the world.» (2 слова)", data: { text: "English ___ all over the world." }, answer: { accept: ["is spoken"] } },
      { type: "quiz", skill: "grammar", prompt: "The email ___ yet.", data: { options: ["hasn't been sent", "hasn't sent", "wasn't send", "isn't sending"] }, answer: { index: 0 } },
      { type: "word_order", skill: "grammar", prompt: "Соберите: «Этот дом был продан на прошлой неделе»", data: { words: ["sold", "house", "was", "This", "week", "last"] }, answer: { sentence: "This house was sold last week" } },
      { type: "quiz", skill: "grammar", prompt: "Переведите в пассив: «They make cars here.»", data: { options: ["Cars made here", "Cars are made here", "Cars is made here", "Cars are making here"] }, answer: { index: 1 } },
      { type: "listening", skill: "listening", prompt: "Прослушайте и напечатайте", data: { audioText: "This book was written many years ago" }, answer: { accept: ["This book was written many years ago"] } },
      { type: "multi_quiz", skill: "grammar", prompt: "Отметьте предложения в пассиве:", data: { options: ["The window was broken", "She broke the window", "Dinner is being cooked", "He cooks dinner"] }, answer: { indices: [0, 2] } },
      { type: "speaking", skill: "speaking", prompt: "Произнесите:", data: { text: "This film was made in Hollywood" }, answer: { reference: "This film was made in Hollywood" } },
      { type: "translate", skill: "grammar", prompt: "Переведите: «Этот торт был испечён моей бабушкой.»", data: { source: "Этот торт был испечён моей бабушкой." }, answer: { reference: "This cake was baked by my grandmother." } },
    ],
  },
  {
    id: "gen-17",
    track: "general",
    orderIndex: 17,
    title: "Косвенная речь",
    subtitle: "He said that he was busy",
    difficulty: "advanced",
    cardId: "card-17",
    theoryMd: `## Reported Speech — косвенная речь

При передаче чужих слов время «сдвигается назад»:

| Прямая речь | Косвенная речь |
|---|---|
| Present Simple | Past Simple |
| Present Continuous | Past Continuous |
| Past Simple / Present Perfect | Past Perfect |
| will | would |
| can | could |

- "I **am** busy" → He said (that) he **was** busy.
- "I **will** call you" → She said she **would** call me.

**Вопросы:** порядок слов прямой! "Where do you live?" → He asked where I **lived**.
**Просьбы:** asked/told + to-инфинитив: "Close the door" → She told me **to close** the door.

Меняются и указатели: today → that day, tomorrow → the next day, here → there.`,
    exercises: [
      { type: "quiz", skill: "grammar", prompt: "\"I am tired.\" → He said that he ___ tired.", data: { options: ["is", "was", "were", "will be"] }, answer: { index: 1 } },
      { type: "quiz", skill: "grammar", prompt: "\"I will help.\" → She said she ___ help.", data: { options: ["will", "would", "can", "shall"] }, answer: { index: 1 } },
      { type: "gap_fill", skill: "grammar", prompt: "«I can swim.» → He said he ___ swim.", data: { text: "He said he ___ swim." }, answer: { accept: ["could"] } },
      { type: "quiz", skill: "grammar", prompt: "\"Where do you work?\" → She asked me…", data: { options: ["where did I work", "where I worked", "where do I work", "where I work"] }, answer: { index: 1 } },
      { type: "word_order", skill: "grammar", prompt: "Соберите: «Она попросила меня подождать»", data: { words: ["asked", "She", "wait", "me", "to"] }, answer: { sentence: "She asked me to wait" } },
      { type: "listening", skill: "listening", prompt: "Прослушайте и напечатайте", data: { audioText: "He said that he was very happy" }, answer: { accept: ["He said that he was very happy"] } },
      { type: "multi_quiz", skill: "grammar", prompt: "Что меняется в косвенной речи?", data: { options: ["today → that day", "here → here", "will → would", "can → can't"] }, answer: { indices: [0, 2] } },
      { type: "speaking", skill: "speaking", prompt: "Произнесите:", data: { text: "She told me to come earlier" }, answer: { reference: "She told me to come earlier" } },
      { type: "translate", skill: "grammar", prompt: "Переведите: «Он сказал, что живёт в Лондоне.»", data: { source: "Он сказал, что живёт в Лондоне." }, answer: { reference: "He said that he lived in London." } },
    ],
  },
  {
    id: "gen-18",
    track: "general",
    orderIndex: 18,
    title: "Условные предложения 2 и 3",
    subtitle: "If I were you…",
    difficulty: "advanced",
    cardId: "card-18",
    theoryMd: `## Conditionals 2 и 3

**Second Conditional** — нереальное настоящее/будущее (мечты, советы):
**If + Past Simple, would + глагол**
- If I **had** a million, I **would travel** the world.
- If I **were** you, I **would apologize**. (форма were для всех лиц!)

**Third Conditional** — нереальное прошлое (сожаления):
**If + Past Perfect, would have + V3**
- If you **had studied**, you **would have passed** the exam.
- Если бы ты (тогда) готовился, ты бы (тогда) сдал.

> 2-й тип — «если бы сейчас», 3-й тип — «если бы тогда».`,
    exercises: [
      { type: "quiz", skill: "grammar", prompt: "If I ___ rich, I would buy a yacht.", data: { options: ["am", "were", "will be", "would be"] }, answer: { index: 1 } },
      { type: "quiz", skill: "grammar", prompt: "If you had called me, I ___ come.", data: { options: ["would", "would have", "will have", "had"] }, answer: { index: 1 } },
      { type: "gap_fill", skill: "grammar", prompt: "«If I ___ (know), I would tell you.»", data: { text: "If I ___, I would tell you." }, answer: { accept: ["knew"] } },
      { type: "quiz", skill: "grammar", prompt: "«На твоём месте я бы отдохнул»:", data: { options: ["If I am you, I will rest", "If I were you, I would rest", "If I was you, I rest", "If I be you, I would rest"] }, answer: { index: 1 } },
      { type: "word_order", skill: "grammar", prompt: "Соберите: «Если бы у меня было время, я бы помог»", data: { words: ["had", "I", "If", "would", "I", "time,", "help"] }, answer: { sentence: "If I had time, I would help" } },
      { type: "listening", skill: "listening", prompt: "Прослушайте и напечатайте", data: { audioText: "If I were you, I would take this job" }, answer: { accept: ["If I were you, I would take this job"] } },
      { type: "multi_quiz", skill: "grammar", prompt: "Отметьте предложения 3-го типа (о прошлом):", data: { options: ["If I had seen him, I would have said hello", "If I saw him, I would say hello", "If she had left earlier, she wouldn't have been late", "If she leaves, call me"] }, answer: { indices: [0, 2] } },
      { type: "speaking", skill: "speaking", prompt: "Произнесите:", data: { text: "If I had more time, I would read more books" }, answer: { reference: "If I had more time, I would read more books" } },
      { type: "translate", skill: "grammar", prompt: "Переведите: «Если бы я знал ответ, я бы сказал тебе.»", data: { source: "Если бы я знал ответ, я бы сказал тебе." }, answer: { reference: "If I knew the answer, I would tell you." } },
    ],
  },
  {
    id: "gen-19",
    track: "general",
    orderIndex: 19,
    title: "Фразовые глаголы",
    subtitle: "Give up, look for, turn on",
    difficulty: "advanced",
    cardId: "card-19",
    theoryMd: `## Phrasal Verbs — фразовые глаголы

Глагол + предлог/наречие = новое значение:

- **give up** — сдаваться, бросать: Don't **give up**!
- **look for** — искать: I'm **looking for** my keys.
- **look after** — присматривать: She **looks after** her brother.
- **turn on / off** — включать / выключать
- **put on / take off** — надевать / снимать
- **get up** — вставать; **wake up** — просыпаться
- **find out** — выяснять: I **found out** the truth.
- **run out of** — заканчиваться: We **ran out of** milk.
- **come back** — возвращаться
- **carry on** — продолжать

> Значение часто нельзя угадать по частям — учите целиком, как отдельные слова.`,
    exercises: [
      { type: "quiz", skill: "vocabulary", prompt: "Don't ___ ! You can do it! (не сдавайся)", data: { options: ["give up", "get up", "look up", "turn up"] }, answer: { index: 0 } },
      { type: "quiz", skill: "vocabulary", prompt: "I can't find my phone. I've been ___ it all morning.", data: { options: ["looking after", "looking for", "looking out", "looking up"] }, answer: { index: 1 } },
      { type: "gap_fill", skill: "vocabulary", prompt: "«Включи свет.» → «Turn ___ the light.»", data: { text: "Turn ___ the light." }, answer: { accept: ["on"] } },
      { type: "gap_fill", skill: "vocabulary", prompt: "«У нас закончился хлеб.» → «We ran ___ ___ bread.» (2 слова)", data: { text: "We ran ___ bread." }, answer: { accept: ["out of"] } },
      { type: "quiz", skill: "vocabulary", prompt: "It's cold. ___ your coat.", data: { options: ["Take off", "Put on", "Turn off", "Give up"] }, answer: { index: 1 } },
      { type: "listening", skill: "listening", prompt: "Прослушайте и напечатайте", data: { audioText: "I wake up at six and get up at seven" }, answer: { accept: ["I wake up at six and get up at seven", "I wake up at 6 and get up at 7"] } },
      { type: "multi_quiz", skill: "vocabulary", prompt: "Отметьте пары «глагол — верный перевод»:", data: { options: ["find out — выяснить", "look after — искать", "carry on — продолжать", "come back — сдаваться"] }, answer: { indices: [0, 2] } },
      { type: "speaking", skill: "speaking", prompt: "Произнесите:", data: { text: "Never give up on your dreams" }, answer: { reference: "Never give up on your dreams" } },
      { type: "translate", skill: "vocabulary", prompt: "Переведите: «Она присматривает за моей кошкой.»", data: { source: "Она присматривает за моей кошкой." }, answer: { reference: "She looks after my cat." } },
    ],
  },
  {
    id: "gen-20",
    track: "general",
    orderIndex: 20,
    title: "Идиомы и разговорный стиль",
    subtitle: "It's a piece of cake!",
    difficulty: "advanced",
    cardId: "card-20",
    theoryMd: `## Идиомы

Устойчивые выражения, которые не переводятся дословно:

- **a piece of cake** — проще простого: The test was **a piece of cake**.
- **break the ice** — разрядить обстановку
- **once in a blue moon** — очень редко
- **under the weather** — нездоровится: I'm feeling **under the weather**.
- **cost an arm and a leg** — стоить целое состояние
- **hit the books** — засесть за учёбу
- **call it a day** — закончить на сегодня
- **the ball is in your court** — теперь дело за тобой
- **spill the beans** — проболтаться
- **better late than never** — лучше поздно, чем никогда

> Идиомы делают речь живой, но используйте их уместно — в основном в неформальном общении.`,
    exercises: [
      { type: "quiz", skill: "vocabulary", prompt: "The exam was ___ — I finished in 20 minutes! (очень лёгким)", data: { options: ["a piece of cake", "under the weather", "an arm and a leg", "a blue moon"] }, answer: { index: 0 } },
      { type: "quiz", skill: "vocabulary", prompt: "«Мне нездоровится» по-английски:", data: { options: ["I'm over the moon", "I'm under the weather", "I'm in hot water", "I'm on cloud nine"] }, answer: { index: 1 } },
      { type: "gap_fill", skill: "vocabulary", prompt: "«Это случается очень редко.» → «It happens once in a ___ moon.»", data: { text: "It happens once in a ___ moon." }, answer: { accept: ["blue"] } },
      { type: "quiz", skill: "vocabulary", prompt: "This car costs ___! (безумно дорого)", data: { options: ["a piece of cake", "an arm and a leg", "the ice", "the beans"] }, answer: { index: 1 } },
      { type: "word_order", skill: "vocabulary", prompt: "Соберите идиому: «закончим на сегодня»", data: { words: ["call", "Let's", "a", "it", "day"] }, answer: { sentence: "Let's call it a day" } },
      { type: "listening", skill: "listening", prompt: "Прослушайте и напечатайте", data: { audioText: "Better late than never" }, answer: { accept: ["Better late than never"] } },
      { type: "multi_quiz", skill: "vocabulary", prompt: "Отметьте верные значения:", data: { options: ["spill the beans — проболтаться", "hit the books — ударить книгу", "break the ice — разрядить обстановку", "piece of cake — кусок торта (о сложном)"] }, answer: { indices: [0, 2] } },
      { type: "speaking", skill: "speaking", prompt: "Произнесите:", data: { text: "Learning English is a piece of cake" }, answer: { reference: "Learning English is a piece of cake" } },
      { type: "translate", skill: "vocabulary", prompt: "Переведите, используя идиому: «Теперь дело за тобой.»", data: { source: "Теперь дело за тобой." }, answer: { reference: "The ball is in your court." } },
    ],
  },
];
