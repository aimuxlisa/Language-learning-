"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { finishLesson, startLesson, type FinishPayload } from "@/app/(app)/learn/actions";
import { QuizInput, TextInput, WordOrderInput } from "./inputs";
import { ListeningInput, SpeakingInput } from "./av-inputs";
import { Robot } from "@/components/Robot";

type Exercise = {
  id: string;
  type: string;
  skill: string;
  prompt: string;
  data: Record<string, unknown>;
};

type Level = {
  id: string;
  orderIndex: number;
  title: string;
  subtitle: string;
  theoryMd: string;
  track: string;
};

type Stage = "theory" | "practice" | "finishing" | "results";

const SKILL_LABEL: Record<string, string> = {
  grammar: "Грамматика",
  vocabulary: "Лексика",
  listening: "Аудирование",
  speaking: "Говорение",
  spelling: "Правописание",
};

export function LessonPlayer({ level, exercises }: { level: Level; exercises: Exercise[] }) {
  const [stage, setStage] = useState<Stage>("theory");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FinishPayload | null>(null);
  const startedAt = useRef<number | null>(null);

  const ex = exercises[idx];
  const value = ex ? answers[ex.id] : undefined;

  const answered = useMemo(() => {
    if (!ex) return false;
    const v = answers[ex.id];
    if (v === undefined || v === null) return false;
    if (typeof v === "string") return v.trim().length > 0;
    if (Array.isArray(v)) return v.length > 0;
    return true;
  }, [answers, ex]);

  async function begin() {
    setError(null);
    const res = await startLesson(level.id);
    if (!res.ok) {
      setError(res.message);
      return;
    }
    startedAt.current = Date.now();
    setStage("practice");
  }

  function setValue(v: unknown) {
    setAnswers((a) => ({ ...a, [ex.id]: v }));
  }

  async function next() {
    if (idx < exercises.length - 1) {
      setIdx(idx + 1);
      return;
    }
    setStage("finishing");
    const minutes = startedAt.current ? (Date.now() - startedAt.current) / 60000 : 0;
    const payload = exercises.map((e) => {
      let v = answers[e.id];
      if (e.type === "word_order" && Array.isArray(v)) {
        const words = (e.data.words as string[]) ?? [];
        v = (v as number[]).map((i) => words[i]).join(" ");
      }
      return { exerciseId: e.id, value: v ?? null };
    });
    try {
      const r = await finishLesson(level.id, payload, minutes);
      setResult(r);
      setStage("results");
    } catch {
      setError("Не удалось отправить ответы. Попробуйте ещё раз.");
      setStage("practice");
    }
  }

  // ---------- Теория ----------
  if (stage === "theory") {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10 fade-up">
        <Header level={level} />
        <article className="theory border border-line bg-raised px-6 py-6 mb-8">
          <Markdown remarkPlugins={[remarkGfm]}>{level.theoryMd}</Markdown>
        </article>
        {error && <p className="text-aorange text-sm mb-4">{error}</p>}
        <div className="flex items-center justify-between">
          <Link href="/learn" className="mono-label hover:text-fg transition-colors">
            ← К списку уровней
          </Link>
          <button
            onClick={begin}
            className="h-11 px-7 bg-fg text-bg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            К практике →
          </button>
        </div>
      </div>
    );
  }

  // ---------- Отправка ----------
  if (stage === "finishing") {
    return (
      <div className="max-w-md mx-auto px-6 py-24 flex flex-col items-center gap-6 text-center">
        <Robot size={100} face="o_o" />
        <p className="text-dim">Проверяем ответы и готовим разбор ошибок…</p>
        <div className="w-48 h-1 bg-line overflow-hidden">
          <div className="h-full w-1/2 spectrum animate-pulse" />
        </div>
      </div>
    );
  }

  // ---------- Результаты ----------
  if (stage === "results" && result) {
    return <Results level={level} exercises={exercises} result={result} />;
  }

  // ---------- Практика ----------
  const progress = Math.round((idx / exercises.length) * 100);
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-2">
        <span className="mono-label">
          Задание {idx + 1} / {exercises.length}
        </span>
        <span className="mono-label">{SKILL_LABEL[ex.skill] ?? ex.skill}</span>
      </div>
      <div className="h-1 bg-line mb-8">
        <div className="h-full spectrum transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div key={ex.id} className="fade-up">
      <h2 className="text-xl font-medium mb-6 leading-snug">{ex.prompt}</h2>

      <div className="mb-8">
        {ex.type === "quiz" && (
          <QuizInput
            options={(ex.data.options as string[]) ?? []}
            value={(value as number) ?? null}
            onChange={setValue}
          />
        )}
        {ex.type === "multi_quiz" && (
          <QuizInput
            multi
            options={(ex.data.options as string[]) ?? []}
            value={(value as number[]) ?? []}
            onChange={setValue}
          />
        )}
        {ex.type === "gap_fill" && (
          <TextInput value={(value as string) ?? ""} onChange={setValue} />
        )}
        {ex.type === "translate" && (
          <TextInput multiline value={(value as string) ?? ""} onChange={setValue} placeholder="Ваш перевод…" />
        )}
        {ex.type === "word_order" && (
          <WordOrderInput
            words={(ex.data.words as string[]) ?? []}
            value={(value as number[]) ?? []}
            onChange={setValue}
          />
        )}
        {ex.type === "listening" && (
          <ListeningInput
            audioText={(ex.data.audioText as string) ?? ""}
            mode={ex.data.mode as string | undefined}
            options={ex.data.options as string[] | undefined}
            value={(value as string | number) ?? null}
            onChange={setValue}
          />
        )}
        {ex.type === "speaking" && (
          <SpeakingInput
            text={(ex.data.text as string) ?? ""}
            value={(value as string) ?? ""}
            onChange={setValue}
          />
        )}
      </div>

      </div>

      {error && <p className="text-aorange text-sm mb-4">{error}</p>}

      <div className="flex justify-end">
        <button
          onClick={next}
          disabled={!answered}
          className="h-11 px-7 bg-fg text-bg text-sm font-medium hover:opacity-90 disabled:opacity-30 transition-opacity"
        >
          {idx < exercises.length - 1 ? "Далее →" : "Завершить урок"}
        </button>
      </div>
    </div>
  );
}

function Header({ level }: { level: Level }) {
  return (
    <div className="mb-8">
      <p className="mono-label mb-2">
        {level.track === "general"
          ? `Уровень ${String(level.orderIndex).padStart(2, "0")}`
          : level.track.toUpperCase()}
      </p>
      <h1 className="text-3xl font-semibold tracking-tight">{level.title}</h1>
      <p className="text-dim mt-1">{level.subtitle}</p>
    </div>
  );
}

function Results({
  level,
  exercises,
  result,
}: {
  level: Level;
  exercises: Exercise[];
  result: FinishPayload;
}) {
  const byId = new Map(result.results.map((r) => [r.exerciseId, r]));
  const reviewById = new Map(result.review.map((r) => [r.exerciseId, r.explanation]));
  const mistakes = exercises.filter((e) => byId.get(e.id)?.isCorrect === false);

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 fade-up">
      <div className="flex flex-col items-center text-center gap-5 mb-10">
        <Robot size={110} face={result.passed ? "^_^" : "T_T"} />
        <div>
          <p className="mono-label mb-2">{level.title}</p>
          <h1 className="text-4xl font-semibold tracking-tight">
            <span className={result.passed ? "text-agreen" : "text-aorange"}>
              {result.scorePct}%
            </span>
          </h1>
          <p className="text-dim mt-2">
            {result.passed
              ? "Уровень пройден!"
              : "Для прохождения нужно 70%. Попробуйте ещё раз!"}
            {result.xpEarned > 0 && ` +${result.xpEarned} XP`}
          </p>
        </div>
      </div>

      {result.card && (
        <div className="spectrum-border mb-8 p-5 flex items-center gap-5">
          <span className="text-5xl">{result.card.emoji}</span>
          <div>
            <p className="mono-label mb-1">Новая карточка · {result.card.rarity}</p>
            <p className="font-medium">{result.card.title}</p>
            <p className="text-dim text-sm mt-0.5">{result.card.description}</p>
          </div>
        </div>
      )}

      {mistakes.length > 0 && (
        <section className="border border-line mb-8">
          <div className="px-5 py-3 border-b border-line mono-label">
            Разбор ошибок · {mistakes.length}
          </div>
          <div className="divide-y divide-line">
            {mistakes.map((e) => {
              const r = byId.get(e.id)!;
              return (
                <div key={e.id} className="px-5 py-4">
                  <p className="text-sm mb-1.5">{e.prompt}</p>
                  <p className="text-sm text-agreen mb-1.5">Правильно: {r.reference}</p>
                  {(reviewById.get(e.id) || r.feedback) && (
                    <p className="text-dim text-sm leading-relaxed">
                      {reviewById.get(e.id) ?? r.feedback}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="flex items-center justify-between">
        <Link href="/learn" className="mono-label hover:text-fg transition-colors">
          ← К списку уровней
        </Link>
        <div className="flex gap-3">
          {!result.passed && (
            <button
              onClick={() => location.reload()}
              className="h-11 px-6 border border-line text-sm hover:border-dim transition-colors"
            >
              Ещё раз
            </button>
          )}
          <Link
            href="/dashboard"
            className="h-11 px-6 bg-fg text-bg text-sm font-medium flex items-center hover:opacity-90 transition-opacity"
          >
            В кабинет →
          </Link>
        </div>
      </div>
    </div>
  );
}
