import type { LevelDef } from "./types";

// Демо-уроки экзаменационных треков
export const examLevels: LevelDef[] = [
  {
    id: "ege-01",
    track: "ege",
    orderIndex: 1,
    title: "ЕГЭ: Грамматика (задания 19–24)",
    subtitle: "Преобразование слов",
    difficulty: "intermediate",
    theoryMd: `## ЕГЭ, раздел «Грамматика и лексика»

В заданиях 19–24 нужно преобразовать слово так, чтобы оно грамматически соответствовало тексту.

**Что проверяют чаще всего:**
- формы глагола (Past Simple, Present Perfect, пассив);
- степени сравнения прилагательных;
- множественное число существительных;
- порядковые числительные (one → first);
- местоимения.

**Стратегия:** определите часть речи и время по соседним словам. *Yesterday* → прошедшее время; *than* → сравнительная степень.`,
    exercises: [
      { type: "gap_fill", skill: "grammar", prompt: "Преобразуйте слово GO: «Last summer we ___ to the sea.»", data: { text: "Last summer we ___ to the sea. (GO)" }, answer: { accept: ["went"] } },
      { type: "gap_fill", skill: "grammar", prompt: "Преобразуйте слово CHILD: «There were many ___ in the park.»", data: { text: "There were many ___ in the park. (CHILD)" }, answer: { accept: ["children"] } },
      { type: "gap_fill", skill: "grammar", prompt: "Преобразуйте слово GOOD: «This is the ___ film I have ever seen.»", data: { text: "This is the ___ film I have ever seen. (GOOD)" }, answer: { accept: ["best"] } },
      { type: "gap_fill", skill: "grammar", prompt: "Преобразуйте слово ONE: «It was his ___ visit to Moscow.»", data: { text: "It was his ___ visit to Moscow. (ONE)" }, answer: { accept: ["first"] } },
      { type: "gap_fill", skill: "grammar", prompt: "Преобразуйте слово BUILD: «The bridge ___ two hundred years ago.»", data: { text: "The bridge ___ two hundred years ago. (BUILD, пассив, 2 слова)" }, answer: { accept: ["was built"] } },
      { type: "quiz", skill: "grammar", prompt: "«They said they ___ the work by Monday.» Какая форма?", data: { options: ["will finish", "would finish", "finish", "finished"] }, answer: { index: 1 } },
      { type: "translate", skill: "grammar", prompt: "Переведите в стиле ЕГЭ: «Эта книга интереснее, чем та.»", data: { source: "Эта книга интереснее, чем та." }, answer: { reference: "This book is more interesting than that one." } },
    ],
  },
  {
    id: "ege-02",
    track: "ege",
    orderIndex: 2,
    title: "ЕГЭ: Аудирование и лексика",
    subtitle: "Понимание на слух",
    difficulty: "intermediate",
    theoryMd: `## ЕГЭ, аудирование

В разделе аудирования нужно понять основное содержание и детали услышанного.

**Советы:**
- Перед прослушиванием прочитайте варианты — поймёте, о чём пойдёт речь.
- Не паникуйте из-за незнакомого слова: важен общий смысл.
- Ответ часто перефразирован: в записи *purchase*, в ответе *buy*.

Потренируемся на коротких фразах.`,
    exercises: [
      { type: "listening", skill: "listening", prompt: "Прослушайте и напечатайте", data: { audioText: "The museum is closed on Mondays" }, answer: { accept: ["The museum is closed on Mondays"] } },
      { type: "listening", skill: "listening", prompt: "Прослушайте и выберите, что услышали", data: { audioText: "She has already bought the tickets", mode: "choice", options: ["She will buy the tickets", "She has already bought the tickets", "She has already brought the tickets", "She is buying the tickets"] }, answer: { index: 1 } },
      { type: "listening", skill: "listening", prompt: "Прослушайте и напечатайте", data: { audioText: "The lecture starts at half past nine" }, answer: { accept: ["The lecture starts at half past nine"] } },
      { type: "quiz", skill: "vocabulary", prompt: "Синоним к «purchase»:", data: { options: ["sell", "buy", "borrow", "rent"] }, answer: { index: 1 } },
      { type: "quiz", skill: "vocabulary", prompt: "«to take part in» означает:", data: { options: ["участвовать", "разделять", "уходить", "забирать"] }, answer: { index: 0 } },
      { type: "speaking", skill: "speaking", prompt: "Устная часть: прочитайте вслух", data: { text: "Travelling broadens the mind and helps us understand other cultures" }, answer: { reference: "Travelling broadens the mind and helps us understand other cultures" } },
    ],
  },
  {
    id: "ielts-01",
    track: "ielts",
    orderIndex: 1,
    title: "IELTS: Academic Vocabulary",
    subtitle: "Formal language basics",
    difficulty: "advanced",
    theoryMd: `## IELTS: академическая лексика

IELTS Writing и Speaking оцениваются по лексическому диапазону. Заменяйте простые слова академическими:

| Простое | Академическое |
|---|---|
| big | significant, substantial |
| get | obtain, acquire |
| show | demonstrate, illustrate |
| think | consider, assume |
| help | facilitate, assist |
| about | approximately |

**Линкеры для эссе:** however, moreover, consequently, in contrast, furthermore, therefore.

> Не злоупотребляйте: естественность важнее «умных слов».`,
    exercises: [
      { type: "quiz", skill: "vocabulary", prompt: "Академическая замена «big increase»:", data: { options: ["giant increase", "significant increase", "very increase", "nice increase"] }, answer: { index: 1 } },
      { type: "quiz", skill: "vocabulary", prompt: "«The results ___ that the method works.» (показывают)", data: { options: ["demonstrate", "say", "look", "do"] }, answer: { index: 0 } },
      { type: "gap_fill", skill: "vocabulary", prompt: "Замените about: «___ 50% of students agreed.»", data: { text: "___ 50% of students agreed." }, answer: { accept: ["Approximately", "approximately"] } },
      { type: "quiz", skill: "vocabulary", prompt: "Линкер противопоставления:", data: { options: ["moreover", "however", "therefore", "furthermore"] }, answer: { index: 1 } },
      { type: "listening", skill: "listening", prompt: "Прослушайте и напечатайте", data: { audioText: "The research demonstrates a significant improvement" }, answer: { accept: ["The research demonstrates a significant improvement"] } },
      { type: "translate", skill: "vocabulary", prompt: "Переведите академично: «Более того, результаты подтверждают эту теорию.»", data: { source: "Более того, результаты подтверждают эту теорию." }, answer: { reference: "Moreover, the results confirm this theory." } },
    ],
  },
  {
    id: "ielts-02",
    track: "ielts",
    orderIndex: 2,
    title: "IELTS: Speaking Part 1",
    subtitle: "Talking about yourself",
    difficulty: "advanced",
    theoryMd: `## IELTS Speaking, Part 1

4–5 минут вопросов о вас: работа, учёба, хобби, родной город.

**Структура хорошего ответа:** ответ + причина + пример (2–4 предложения, не односложно!).

- *Do you like reading?* — Yes, definitely. I'm really into science fiction **because** it makes me think about the future. **For example**, last month I read…

**Полезные фразы:** I'm really into…, to be honest…, I'd say…, it depends on…

> Говорите естественно. Беглость и связность важнее идеальной грамматики.`,
    exercises: [
      { type: "quiz", skill: "speaking", prompt: "Лучший ответ на «Do you like your hometown?»:", data: { options: ["Yes.", "Yes, I do. It's quite green and calm, which I love — for example, there's a big park near my house.", "No.", "Hometown is good."] }, answer: { index: 1 } },
      { type: "quiz", skill: "vocabulary", prompt: "«I'm really into photography» означает:", data: { options: ["Я внутри фотографии", "Я увлекаюсь фотографией", "Я против фотографии", "Я учусь на фотографа"] }, answer: { index: 1 } },
      { type: "speaking", skill: "speaking", prompt: "Произнесите ответ на вопрос о хобби:", data: { text: "I'm really into learning languages because it opens new opportunities" }, answer: { reference: "I'm really into learning languages because it opens new opportunities" } },
      { type: "speaking", skill: "speaking", prompt: "Произнесите:", data: { text: "To be honest, it depends on the weather" }, answer: { reference: "To be honest, it depends on the weather" } },
      { type: "listening", skill: "listening", prompt: "Прослушайте и напечатайте", data: { audioText: "Could you tell me a little about yourself" }, answer: { accept: ["Could you tell me a little about yourself"] } },
      { type: "translate", skill: "speaking", prompt: "Переведите разговорно: «Честно говоря, я предпочитаю чай.»", data: { source: "Честно говоря, я предпочитаю чай." }, answer: { reference: "To be honest, I prefer tea." } },
    ],
  },
];
