import Link from "next/link";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { exercises, levels, userAnswers } from "@/db/schema";
import { requireSession } from "@/lib/session";

export const metadata = { title: "Повторение — 4 your learning" };

export default async function ReviewPage() {
  const session = await requireSession();
  const userId = session.user.id;

  const rows = await db
    .select({
      exerciseId: userAnswers.exerciseId,
      isCorrect: userAnswers.isCorrect,
      createdAt: userAnswers.createdAt,
      levelId: userAnswers.levelId,
      prompt: exercises.prompt,
      skill: exercises.skill,
      levelTitle: levels.title,
      levelOrder: levels.orderIndex,
    })
    .from(userAnswers)
    .innerJoin(exercises, eq(userAnswers.exerciseId, exercises.id))
    .innerJoin(levels, eq(exercises.levelId, levels.id))
    .where(eq(userAnswers.userId, userId))
    .orderBy(desc(userAnswers.createdAt));

  // Задание считается «исправленным», если после ошибки был верный ответ.
  const solved = new Set(rows.filter((r) => r.isCorrect).map((r) => r.exerciseId));
  const seen = new Set<string>();
  const mistakes = rows.filter((r) => {
    if (r.isCorrect || solved.has(r.exerciseId) || seen.has(r.exerciseId)) return false;
    seen.add(r.exerciseId);
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 fade-up">
      <p className="mono-label mb-2">Повторение</p>
      <h1 className="text-3xl font-semibold tracking-tight mb-2">Ошибки для повтора</h1>
      <p className="text-dim mb-8">
        Здесь задания, на которые вы ответили неверно и ещё не исправили. Повторите урок, чтобы закрыть их.
      </p>

      {mistakes.length === 0 ? (
        <div className="rounded-2xl border border-line card-solid p-8 text-center">
          <p className="font-medium mb-2">Ошибок нет</p>
          <p className="text-dim text-sm mb-5">Отличная работа! Продолжайте уроки.</p>
          <Link href="/learn" className="btn-violet h-10 px-6 inline-flex items-center text-sm font-medium">
            К урокам →
          </Link>
        </div>
      ) : (
        <ul className="rounded-2xl border border-line card-solid divide-y divide-line overflow-hidden">
          {mistakes.slice(0, 30).map((m) => (
            <li key={m.exerciseId} className="px-5 py-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm mb-1">{m.prompt}</p>
                <p className="mono-label">
                  Уровень {String(m.levelOrder).padStart(2, "0")} · {m.levelTitle}
                </p>
              </div>
              <Link href={`/learn/${m.levelId}`} className="mono-label shrink-0 hover:text-fg transition-colors">
                Повторить →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
