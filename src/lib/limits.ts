import { and, eq, gte } from "drizzle-orm";
import { db } from "@/db";
import { usageLog } from "@/db/schema";

export const FREE_LESSONS_PER_DAY = 5;
export const FREE_MINUTES_PER_DAY = 20;
/** Free не открывает уровни общего курса дальше этого orderIndex. */
export const FREE_MAX_LEVEL_INDEX = 5;

export type FreeLimit = {
  lessonsUsed: number;
  minutesUsed: number;
  exhausted: boolean;
  /** Когда лимит сбросится (null — лимит ещё не тронут). */
  resetsAt: Date | null;
};

/** Лимит Free по скользящему окну 24ч от первого урока. */
export async function getFreeLimit(userId: string): Promise<FreeLimit> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const rows = await db
    .select()
    .from(usageLog)
    .where(and(eq(usageLog.userId, userId), gte(usageLog.createdAt, since)));

  const starts = rows.filter((r) => r.kind === "lesson_start");
  const minutesUsed = rows.reduce((sum, r) => sum + r.minutesSpent, 0);
  const firstStart = starts.reduce<Date | null>(
    (min, r) => (min === null || r.createdAt < min ? r.createdAt : min),
    null,
  );

  const exhausted =
    starts.length >= FREE_LESSONS_PER_DAY || minutesUsed >= FREE_MINUTES_PER_DAY;

  return {
    lessonsUsed: starts.length,
    minutesUsed,
    exhausted,
    resetsAt: firstStart ? new Date(firstStart.getTime() + 24 * 60 * 60 * 1000) : null,
  };
}
