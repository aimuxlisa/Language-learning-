"use server";

import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  cards,
  exercises,
  levels,
  usageLog,
  user,
  userAnswers,
  userCards,
  userProgress,
  aiReviews,
} from "@/db/schema";
import { requireSession } from "@/lib/session";
import { getFreeLimit, FREE_MAX_LEVEL_INDEX } from "@/lib/limits";
import { gradeExercise } from "@/lib/grade";
import { lessonXp } from "@/lib/xp";
import { reviewMistakes, type ReviewItem } from "@/lib/ai";

export type StartResult =
  | { ok: true }
  | { ok: false; reason: "locked" | "limit" | "pro_required"; message: string };

/** Доступен ли уровень пользователю (последовательность + тариф). Без учёта лимита. */
export async function isLevelUnlocked(userId: string, plan: string, levelId: string) {
  const [lvl] = await db.select().from(levels).where(eq(levels.id, levelId));
  if (!lvl) return { unlocked: false as const, lvl: null, reason: "locked" as const };

  if (plan === "free" && lvl.track === "general" && lvl.orderIndex > FREE_MAX_LEVEL_INDEX) {
    return { unlocked: false as const, lvl, reason: "pro_required" as const };
  }

  if (lvl.orderIndex > 1) {
    const trackLevels = await db
      .select()
      .from(levels)
      .where(eq(levels.track, lvl.track))
      .orderBy(asc(levels.orderIndex));
    const prev = trackLevels.find((l) => l.orderIndex === lvl.orderIndex - 1);
    if (prev) {
      const [p] = await db
        .select()
        .from(userProgress)
        .where(and(eq(userProgress.userId, userId), eq(userProgress.levelId, prev.id)));
      if (!p || p.status !== "completed") {
        return { unlocked: false as const, lvl, reason: "locked" as const };
      }
    }
  }
  return { unlocked: true as const, lvl, reason: null };
}

export async function startLesson(levelId: string): Promise<StartResult> {
  const session = await requireSession();
  const [u] = await db.select().from(user).where(eq(user.id, session.user.id));

  const access = await isLevelUnlocked(u.id, u.plan, levelId);
  if (!access.unlocked) {
    return {
      ok: false,
      reason: access.reason,
      message:
        access.reason === "pro_required"
          ? "Уровни дальше 5-го доступны на тарифе Pro."
          : "Сначала пройдите предыдущий уровень.",
    };
  }

  if (u.plan === "free") {
    const limit = await getFreeLimit(u.id);
    if (limit.exhausted) {
      return {
        ok: false,
        reason: "limit",
        message: "Дневной лимит Free исчерпан. Он сбросится через 24 часа после первого урока.",
      };
    }
  }

  await db.insert(usageLog).values({
    userId: u.id,
    kind: "lesson_start",
    levelId,
    minutesSpent: 0,
    createdAt: new Date(),
  });
  return { ok: true };
}

export type FinishPayload = {
  results: { exerciseId: string; isCorrect: boolean; reference: string; feedback?: string }[];
  scorePct: number;
  passed: boolean;
  xpEarned: number;
  card: { title: string; description: string; emoji: string; rarity: string } | null;
  review: ReviewItem[];
};

export async function finishLesson(
  levelId: string,
  answers: { exerciseId: string; value: unknown }[],
  minutesSpent: number,
): Promise<FinishPayload> {
  const session = await requireSession();
  const userId = session.user.id;

  const exs = await db
    .select()
    .from(exercises)
    .where(eq(exercises.levelId, levelId))
    .orderBy(asc(exercises.orderIndex));
  const [lvl] = await db.select().from(levels).where(eq(levels.id, levelId));
  if (!lvl || exs.length === 0) throw new Error("Level not found");

  const [progress] = await db
    .select()
    .from(userProgress)
    .where(and(eq(userProgress.userId, userId), eq(userProgress.levelId, levelId)));
  const attemptNo = (progress?.attempts ?? 0) + 1;

  const byId = new Map(answers.map((a) => [a.exerciseId, a.value]));
  const results: FinishPayload["results"] = [];
  const mistakes: { exerciseId: string; prompt: string; reference: string; given: string }[] = [];
  const now = new Date();

  for (const ex of exs) {
    const value = byId.get(ex.id);
    const graded = await gradeExercise(
      ex.type,
      ex.prompt,
      JSON.parse(ex.dataJson),
      JSON.parse(ex.answerJson),
      value,
    );
    results.push({ exerciseId: ex.id, ...graded });
    if (!graded.isCorrect) {
      mistakes.push({
        exerciseId: ex.id,
        prompt: ex.prompt,
        reference: graded.reference,
        given: String(value ?? "(нет ответа)"),
      });
    }
    await db.insert(userAnswers).values({
      userId,
      levelId,
      attemptNo,
      exerciseId: ex.id,
      givenJson: JSON.stringify(value ?? null),
      isCorrect: graded.isCorrect,
      createdAt: now,
    });
  }

  const scorePct = Math.round((results.filter((r) => r.isCorrect).length / results.length) * 100);
  const passed = scorePct >= 70;
  const wasCompleted = progress?.status === "completed";

  // Прогресс
  if (progress) {
    await db
      .update(userProgress)
      .set({
        attempts: attemptNo,
        bestScore: Math.max(progress.bestScore, scorePct),
        status: passed || wasCompleted ? "completed" : progress.status,
        completedAt: passed && !wasCompleted ? now : progress.completedAt,
      })
      .where(and(eq(userProgress.userId, userId), eq(userProgress.levelId, levelId)));
  } else {
    await db.insert(userProgress).values({
      userId,
      levelId,
      status: passed ? "completed" : "available",
      bestScore: scorePct,
      attempts: attemptNo,
      completedAt: passed ? now : null,
    });
  }

  // Награды — только за первое прохождение
  let xpEarned = 0;
  let cardPayload: FinishPayload["card"] = null;
  if (passed && !wasCompleted) {
    xpEarned = lessonXp(scorePct);
    const [u] = await db.select().from(user).where(eq(user.id, userId));
    await db.update(user).set({ xp: u.xp + xpEarned, updatedAt: now }).where(eq(user.id, userId));

    if (lvl.cardId) {
      const owned = await db
        .select()
        .from(userCards)
        .where(and(eq(userCards.userId, userId), eq(userCards.cardId, lvl.cardId)));
      if (owned.length === 0) {
        await db.insert(userCards).values({ userId, cardId: lvl.cardId, earnedAt: now });
        const [c] = await db.select().from(cards).where(eq(cards.id, lvl.cardId));
        if (c) cardPayload = { title: c.title, description: c.description, emoji: c.emoji, rarity: c.rarity };
      }
    }
  }

  // Учёт времени для лимита
  await db.insert(usageLog).values({
    userId,
    kind: "lesson_finish",
    levelId,
    minutesSpent: Math.max(0, Math.min(60, Math.round(minutesSpent))),
    createdAt: now,
  });

  // AI-разбор ошибок (кэшируется по попытке)
  const review = await reviewMistakes(mistakes);
  if (mistakes.length > 0) {
    await db.insert(aiReviews).values({
      userId,
      levelId,
      attemptNo,
      reviewJson: JSON.stringify(review),
      createdAt: now,
    });
  }

  return { results, scorePct, passed, xpEarned, card: cardPayload, review };
}
