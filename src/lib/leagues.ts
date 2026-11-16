import { and, asc, eq, gte, lt, sum } from "drizzle-orm";
import { db } from "@/db";
import { appMeta, user, xpLog } from "@/db/schema";

/** Лиги по возрастанию: как в Duolingo — от бронзы до бриллианта. */
export const LEAGUES = [
  { name: "Бронза", color: "#cd7f32" },
  { name: "Серебро", color: "#a8b0bb" },
  { name: "Золото", color: "#f5c542" },
  { name: "Сапфир", color: "#3b82f6" },
  { name: "Рубин", color: "#ef4444" },
  { name: "Изумруд", color: "#10b981" },
  { name: "Аметист", color: "#a855f7" },
  { name: "Жемчуг", color: "#f0abfc" },
  { name: "Обсидиан", color: "#475569" },
  { name: "Бриллиант", color: "#7dd3fc" },
];

/** Сколько лучших переходят в следующую лигу, сколько худших вылетают (при группе от 15 человек). */
const PROMOTE_TOP = 10;
const DEMOTE_BOTTOM = 5;
const MIN_FOR_DEMOTION = 15;
/** Сколько человек показываем в таблице лиги. */
export const BOARD_SIZE = 30;

/** Начало недели (понедельник 00:00 UTC). */
export function weekStart(d: Date = new Date()): Date {
  const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = (x.getUTCDay() + 6) % 7; // 0 = понедельник
  x.setUTCDate(x.getUTCDate() - day);
  return x;
}

export function nextWeekStart(d: Date = new Date()): Date {
  const s = weekStart(d);
  s.setUTCDate(s.getUTCDate() + 7);
  return s;
}

async function weeklyXp(from: Date, to: Date): Promise<Map<string, number>> {
  const rows = await db
    .select({ userId: xpLog.userId, total: sum(xpLog.amount) })
    .from(xpLog)
    .where(and(gte(xpLog.createdAt, from), lt(xpLog.createdAt, to)))
    .groupBy(xpLog.userId);
  return new Map(rows.map((r) => [r.userId, Number(r.total ?? 0)]));
}

/**
 * Подводит итоги прошедшей недели: переводит лучших вверх и худших вниз.
 * Вызывается лениво при открытии рейтинга, поэтому не нужен отдельный cron.
 */
export async function settleLeagues(now: Date = new Date()) {
  const thisWeek = weekStart(now);
  const [meta] = await db.select().from(appMeta).where(eq(appMeta.key, "league_week"));

  if (!meta) {
    // Первый запуск: просто запоминаем текущую неделю, итоги ещё не из чего считать
    await db.insert(appMeta).values({ key: "league_week", value: thisWeek.toISOString() });
    return;
  }
  const settledUntil = new Date(meta.value);
  if (settledUntil.getTime() >= thisWeek.getTime()) return;

  // Подводим итоги каждой пропущенной недели, но не больше 4 за раз
  let cursor = settledUntil;
  for (let i = 0; i < 4 && cursor.getTime() < thisWeek.getTime(); i++) {
    const next = new Date(cursor.getTime() + 7 * 24 * 60 * 60 * 1000);
    await settleOneWeek(cursor, next);
    cursor = next;
  }
  await db
    .update(appMeta)
    .set({ value: thisWeek.toISOString() })
    .where(eq(appMeta.key, "league_week"));
}

async function settleOneWeek(from: Date, to: Date) {
  const xp = await weeklyXp(from, to);
  const users = await db.select({ id: user.id, tier: user.leagueTier }).from(user);

  for (let t = 0; t < LEAGUES.length; t++) {
    const members = users
      .filter((u) => u.tier === t)
      .map((u) => ({ id: u.id, xp: xp.get(u.id) ?? 0 }))
      .sort((a, b) => b.xp - a.xp);
    if (members.length === 0) continue;

    const promote = members.slice(0, PROMOTE_TOP).filter((m) => m.xp > 0);
    const demote =
      members.length >= MIN_FOR_DEMOTION ? members.slice(-DEMOTE_BOTTOM) : [];

    for (const m of promote) {
      if (t < LEAGUES.length - 1) {
        await db.update(user).set({ leagueTier: t + 1 }).where(eq(user.id, m.id));
      }
    }
    for (const m of demote) {
      if (t > 0 && !promote.some((p) => p.id === m.id)) {
        await db.update(user).set({ leagueTier: t - 1 }).where(eq(user.id, m.id));
      }
    }
  }
}

export type BoardRow = {
  rank: number;
  id: string;
  name: string;
  username: string | null;
  image: string | null;
  xp: number;
  zone: "promote" | "demote" | "stay";
};

/** Таблица лиги текущего пользователя за текущую неделю. */
export async function getLeagueBoard(userId: string, now: Date = new Date()) {
  await settleLeagues(now);
  const [me] = await db.select().from(user).where(eq(user.id, userId));
  const tier = me.leagueTier;
  const xp = await weeklyXp(weekStart(now), new Date(now.getTime() + 1));

  const members = await db
    .select({ id: user.id, name: user.name, username: user.username, image: user.image })
    .from(user)
    .where(eq(user.leagueTier, tier));

  const ranked = members
    .map((m) => ({ ...m, xp: xp.get(m.id) ?? 0 }))
    .sort((a, b) => b.xp - a.xp || a.name.localeCompare(b.name))
    .slice(0, BOARD_SIZE);

  const demoteFrom = members.length >= MIN_FOR_DEMOTION ? members.length - DEMOTE_BOTTOM : Infinity;
  const rows: BoardRow[] = ranked.map((m, i) => ({
    rank: i + 1,
    id: m.id,
    name: m.name,
    username: m.username,
    image: m.image,
    xp: m.xp,
    zone: i < PROMOTE_TOP && m.xp > 0 ? "promote" : i >= demoteFrom ? "demote" : "stay",
  }));

  return {
    tier,
    league: LEAGUES[tier],
    isTop: tier === LEAGUES.length - 1,
    rows,
    memberCount: members.length,
    endsAt: nextWeekStart(now),
    myXp: xp.get(userId) ?? 0,
  };
}
