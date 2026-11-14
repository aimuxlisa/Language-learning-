import type { LevelDef } from "./types";

/**
 * Стартовые курсы для языков, кроме английского: по 2 уровня на язык.
 * Теория на русском, задания — простые (выбор, пропуск слова, сборка фразы),
 * чтобы их можно было проверять без AI и без озвучивания.
 */

const quiz = (prompt: string, options: string[], index: number, skill: "vocabulary" | "grammar" = "vocabulary") =>
  ({ type: "quiz", skill, prompt, data: { options }, answer: { index } }) as const;

const gap = (prompt: string, text: string, accept: string[], skill: "vocabulary" | "grammar" | "spelling" = "vocabulary") =>
  ({ type: "gap_fill", skill, prompt, data: { text }, answer: { accept } }) as const;

const order = (prompt: string, words: string[], sentence: string) =>
  ({ type: "word_order", skill: "grammar", prompt, data: { words }, answer: { sentence } }) as const;

export const starterLevels: LevelDef[] = [
  // ---------- Испанский ----------
  {
    id: "es-01", track: "general", orderIndex: 1, language: "es",
    title: "Приветствия", subtitle: "¡Hola! ¿Cómo estás?",
    difficulty: "beginner",
    theoryMd: `## Приветствия

- **Hola** — привет
- **Buenos días / tardes / noches** — доброе утро / день / вечер
- **Gracias** — спасибо, **Por favor** — пожалуйста
- **Me llamo…** — меня зовут…
- **¿Cómo estás?** — Как дела?

> В испанском вопросы начинаются с перевёрнутого знака **¿**.`,
    exercises: [
      quiz("Как сказать «Привет»?", ["Adiós", "Hola", "Gracias", "Por favor"], 1),
      quiz("Как сказать «Спасибо»?", ["Hola", "Buenos días", "Gracias", "Lo siento"], 2),
      gap("Допишите: «Buenos ___» (доброе утро)", "Buenos ___", ["días", "dias"]),
      order("Соберите фразу: «Меня зовут Ана»", ["Ana", "me", "llamo", "Me"], "Me llamo Ana"),
      quiz("Как спросить «Как дела?»", ["¿Cómo estás?", "¿Dónde está?", "¿Qué hora es?", "¿Cuánto cuesta?"], 0),
    ],
  },
  {
    id: "es-02", track: "general", orderIndex: 2, language: "es",
    title: "Числа и цвета", subtitle: "Uno, dos, tres… rojo, azul",
    difficulty: "beginner",
    theoryMd: `## Числа и цвета

- **uno, dos, tres, cuatro** — один, два, три, четыре
- **rojo** — красный, **azul** — синий, **verde** — зелёный

> Цвета в испанском обычно стоят **после** существительного: *el cielo azul* — синее небо.`,
    exercises: [
      quiz("Как сказать «один»?", ["dos", "uno", "tres", "cuatro"], 1),
      gap("Допишите: «El cielo es ___» (небо синее)", "El cielo es ___.", ["azul"]),
      quiz("«Rojo» — это цвет:", ["красный", "зелёный", "жёлтый", "синий"], 0),
      order("Соберите фразу: «У меня есть кот»", ["gato", "tengo", "Yo", "un"], "Yo tengo un gato"),
      gap("Допишите: «Dos más dos son ___» (два плюс два — четыре)", "Dos más dos son ___.", ["cuatro"]),
    ],
  },

  // ---------- Немецкий ----------
  {
    id: "de-01", track: "general", orderIndex: 1, language: "de",
    title: "Приветствия", subtitle: "Hallo! Wie geht’s?",
    difficulty: "beginner",
    theoryMd: `## Приветствия

- **Hallo** — привет, **Tschüss** — пока
- **Guten Morgen / Tag / Abend** — доброе утро / день / вечер
- **Danke** — спасибо, **Bitte** — пожалуйста
- **Ich heiße…** — меня зовут…

> В немецком все существительные пишутся с **большой буквы**.`,
    exercises: [
      quiz("Как сказать «Привет»?", ["Tschüss", "Hallo", "Danke", "Bitte"], 1),
      quiz("Как сказать «Спасибо»?", ["Bitte", "Hallo", "Danke", "Ja"], 2),
      gap("Допишите: «Guten ___» (добрый день)", "Guten ___", ["Tag"]),
      order("Соберите фразу: «Меня зовут Макс»", ["heiße", "Ich", "Max"], "Ich heiße Max"),
      quiz("Как ответить на «Wie geht es dir?»", ["Ich heiße Max", "Gut, danke", "Tschüss", "Ja"], 1),
    ],
  },
  {
    id: "de-02", track: "general", orderIndex: 2, language: "de",
    title: "Глагол sein", subtitle: "Ich bin, du bist…",
    difficulty: "beginner",
    theoryMd: `## Глагол sein (быть)

| Местоимение | sein |
|---|---|
| ich | bin |
| du | bist |
| er / sie / es | ist |
| wir | sind |
| ihr | seid |
| sie / Sie | sind |

> Глагол всегда стоит на **втором месте** в предложении.`,
    exercises: [
      quiz("«Ich ___ müde» (я устал):", ["bin", "bist", "ist", "sind"], 0, "grammar"),
      gap("Допишите: «Du ___ Lehrer» (ты учитель)", "Du ___ Lehrer.", ["bist"], "grammar"),
      quiz("Как сказать «Они дома»?", ["Sie ist zu Hause", "Sie sind zu Hause", "Er ist zu Hause", "Wir sind"], 1, "grammar"),
      order("Соберите фразу: «Я из Берлина»", ["komme", "Ich", "aus Berlin"], "Ich komme aus Berlin"),
      gap("Допишите: «Wir ___ Freunde» (мы друзья)", "Wir ___ Freunde.", ["sind"], "grammar"),
    ],
  },

  // ---------- Французский ----------
  {
    id: "fr-01", track: "general", orderIndex: 1, language: "fr",
    title: "Приветствия", subtitle: "Bonjour ! Comment ça va ?",
    difficulty: "beginner",
    theoryMd: `## Приветствия

- **Bonjour** — здравствуйте, **Salut** — привет
- **Bonsoir** — добрый вечер, **Au revoir** — до свидания
- **Merci** — спасибо, **S'il vous plaît** — пожалуйста
- **Je m'appelle…** — меня зовут…

> Во французском многие слова сливаются: *je suis* → *j'ai*, *le ami* → *l'ami*.`,
    exercises: [
      quiz("Как сказать «Здравствуйте»?", ["Bonsoir", "Bonjour", "Au revoir", "Merci"], 1),
      quiz("Как сказать «Пожалуйста»?", ["Merci", "Pardon", "S'il vous plaît", "Oui"], 2),
      gap("Допишите: «Bon ___» (добрый вечер)", "Bon ___", ["soir"]),
      order("Соберите фразу: «Меня зовут Леа»", ["appelle", "Je", "Léa", "m'"], "Je m'appelle Léa"),
      quiz("Как спросить «Как дела?»", ["Comment ça va ?", "Où est ?", "Quelle heure est-il ?", "Combien ça coûte ?"], 0),
    ],
  },
  {
    id: "fr-02", track: "general", orderIndex: 2, language: "fr",
    title: "Глагол être", subtitle: "Je suis, tu es…",
    difficulty: "beginner",
    theoryMd: `## Глагол être (быть)

| Местоимение | être |
|---|---|
| je | suis |
| tu | es |
| il / elle | est |
| nous | sommes |
| vous | êtes |
| ils / elles | sont |

> Глагол спрягается по лицам, поэтому местоимение обычно не опускают.`,
    exercises: [
      quiz("«Je ___ étudiant» (я студент):", ["suis", "es", "est", "sommes"], 0, "grammar"),
      gap("Допишите: «Tu ___ fatigué» (ты устал)", "Tu ___ fatigué.", ["es"], "grammar"),
      quiz("«Ils sont» означает:", ["он есть", "они есть", "мы есть", "я есть"], 1, "grammar"),
      order("Соберите фразу: «Я говорю по-французски»", ["parle", "Je", "français"], "Je parle français"),
      gap("Допишите: «Nous ___ amis» (мы друзья)", "Nous ___ amis.", ["sommes"], "grammar"),
    ],
  },
];
