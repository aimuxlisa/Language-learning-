"use client";

import { useState } from "react";

type Q = { prompt: string; options: string[]; correct: number };

const QUESTIONS: Q[] = [
  { prompt: "She ___ a doctor.", options: ["is", "are", "am", "be"], correct: 0 },
  { prompt: "Yesterday I ___ to the cinema.", options: ["go", "went", "goes", "gone"], correct: 1 },
  { prompt: "If it rains, we ___ at home.", options: ["will stay", "stayed", "stay", "staying"], correct: 0 },
  { prompt: "The book ___ by millions of people.", options: ["has read", "has been read", "was read", "is reading"], correct: 1 },
  { prompt: "Had I known, I ___ earlier.", options: ["would have come", "would come", "came", "will come"], correct: 0 },
];

/** Уровень по числу верных ответов: 0–1 — начинающий, 2–3 — средний, 4–5 — продвинутый. */
function levelFor(score: number): string {
  if (score >= 4) return "advanced";
  if (score >= 2) return "intermediate";
  return "beginner";
}

const LABEL: Record<string, string> = {
  beginner: "Начинающий (A1–A2)",
  intermediate: "Средний (B1)",
  advanced: "Продвинутый (B2+)",
};

export function PlacementTest({ action }: { action: (formData: FormData) => Promise<void> }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const finished = step >= QUESTIONS.length;
  const score = answers.reduce((n, a, i) => n + (a === QUESTIONS[i].correct ? 1 : 0), 0);
  const level = levelFor(score);

  if (finished) {
    return (
      <div className="rounded-2xl border border-line card-solid p-6 flex flex-col gap-5 text-center">
        <p className="mono-label">Результат</p>
        <p className="text-2xl font-semibold">
          {score} из {QUESTIONS.length} верно
        </p>
        <p className="text-dim">Рекомендуем уровень: {LABEL[level]}</p>
        <form action={action} className="flex flex-col gap-3">
          <input type="hidden" name="difficulty" value={level} />
          <button className="btn-violet h-12 font-medium text-sm">Начать с этого уровня</button>
        </form>
      </div>
    );
  }

  const q = QUESTIONS[step];
  return (
    <div className="rounded-2xl border border-line card-solid p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <span className="mono-label">Вопрос {step + 1} / {QUESTIONS.length}</span>
        <div className="h-1 w-32 bg-line rounded-full overflow-hidden">
          <div className="h-full bg-violet transition-all" style={{ width: `${(step / QUESTIONS.length) * 100}%` }} />
        </div>
      </div>
      <p className="text-lg font-medium">{q.prompt}</p>
      <div className="flex flex-col gap-2">
        {q.options.map((opt, i) => (
          <button
            key={opt}
            type="button"
            onClick={() => {
              setAnswers((a) => [...a, i]);
              setStep((s) => s + 1);
            }}
            className="text-left px-4 py-3 rounded-xl border border-line text-sm text-dim hover:border-violet hover:text-fg transition-colors"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
