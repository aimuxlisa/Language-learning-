import { eq } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/schema";

/** XP за пройденный уровень: базово 50 + бонус за точность. */
export function lessonXp(scorePercent: number): number {
  return 50 + Math.round(scorePercent / 2); // 50..100
}

export function checkinBonus(streak: number): number {
  return Math.min(10 + 2 * streak, 50);
}

function sameUtcDay(a: Date, b: Date): boolean {
  return a.toISOString().slice(0, 10) === b.toISOString().slice(0, 10);
}

function isYesterdayUtc(prev: Date, now: Date): boolean {
  const y = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  return sameUtcDay(prev, y);
}

/**
 * Ежедневный check-in: при первом заходе в день продлевает или сбрасывает стрик
 * и начисляет бонус XP. Возвращает актуальные значения.
 */
export async function dailyCheckin(userId: string): Promise<{
  streak: number;
  bonusXp: number;
  checkedInNow: boolean;
}> {
  const [u] = await db.select().from(user).where(eq(user.id, userId));
  const now = new Date();

  if (u.lastCheckinAt && sameUtcDay(u.lastCheckinAt, now)) {
    return { streak: u.streakCount, bonusXp: 0, checkedInNow: false };
  }

  const streak =
    u.lastCheckinAt && isYesterdayUtc(u.lastCheckinAt, now) ? u.streakCount + 1 : 1;
  const bonusXp = checkinBonus(streak);

  await db
    .update(user)
    .set({ streakCount: streak, lastCheckinAt: now, xp: u.xp + bonusXp, updatedAt: now })
    .where(eq(user.id, userId));

  return { streak, bonusXp, checkedInNow: true };
}

export async function addXp(userId: string, amount: number) {
  const [u] = await db.select().from(user).where(eq(user.id, userId));
  await db
    .update(user)
    .set({ xp: u.xp + amount, updatedAt: new Date() })
    .where(eq(user.id, userId));
}
