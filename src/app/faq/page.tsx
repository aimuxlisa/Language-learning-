import Link from "next/link";

export const metadata = { title: "Вопросы — 4 your learning" };

const QA = [
  {
    q: "Что такое 4 your learning?",
    a: "Игровой тренажёр английского: 20 уровней от A1 до B2, разбор ошибок с объяснениями, коллекционные карточки и подготовка к ЕГЭ и IELTS.",
  },
  {
    q: "Сколько стоит?",
    a: "Тариф Free бесплатный: 5 уроков или 20 минут в день, уровни 1–5. Лимит сбрасывается через 24 часа после первого урока. Pro (все уровни без ограничений) пока в разработке.",
  },
  {
    q: "Как выбрать свой уровень?",
    a: "При регистрации можно выбрать уровень вручную или пройти короткий тест из 5 вопросов. Уровень потом меняется в настройках.",
  },
  {
    q: "Как начисляется XP и что дают карточки?",
    a: "За первое прохождение уровня (от 70% правильных ответов) вы получаете 50–100 XP и карточку коллекции. Ежедневный вход даёт бонус и продлевает серию дней.",
  },
  {
    q: "Почему не работает озвучивание или запись речи?",
    a: "Озвучивание работает во всех современных браузерах. Распознавание речи стабильно только в Chrome и Edge. В других браузерах задание можно пропустить без штрафа.",
  },
  {
    q: "Где посмотреть свои ошибки?",
    a: "В разделе «Повторение» собраны задания, на которые вы ответили неверно и ещё не исправили.",
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-bg">
      <header className="h-16 px-6 lg:px-12 flex items-center justify-between border-b border-line">
        <Link href="/" className="wordmark">4 your learning</Link>
        <Link href="/register" className="btn-violet h-10 px-5 flex items-center text-[13px] font-medium">
          Начать бесплатно
        </Link>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-14 fade-up">
        <p className="mono-label mb-3">Помощь</p>
        <h1 className="text-4xl font-semibold tracking-tight mb-10">Частые вопросы</h1>
        <div className="flex flex-col gap-3">
          {QA.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-line card-solid px-5 py-4 open:border-violet transition-colors"
            >
              <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-medium">
                {item.q}
                <span className="text-dim transition-transform group-open:rotate-45 text-xl leading-none">+</span>
              </summary>
              <p className="text-dim text-sm leading-relaxed mt-3">{item.a}</p>
            </details>
          ))}
        </div>
        <p className="text-dim text-sm mt-10">
          Не нашли ответ? Форма обратной связи пока не подключена — напишите нам, когда она появится в следующей версии.
        </p>
      </main>
    </div>
  );
}
