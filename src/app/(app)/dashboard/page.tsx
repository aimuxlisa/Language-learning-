import Link from "next/link";
import { redirect } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { exercises, levels, user, userAnswers, userCards, userProgress } from "@/db/schema";
import { requireSession } from "@/lib/session";
import { getLanguageContext, languageOf } from "@/lib/languages";
import { dailyCheckin } from "@/lib/xp";
import { getFreeLimit, FREE_LESSONS_PER_DAY, FREE_MINUTES_PER_DAY } from "@/lib/limits";
import { Flame, Zap, BookOpen, Layers, Trophy } from "lucide-react";

export const metadata = { title: "Обзор — 4 your learning" };

const SKILLS: Record<string, string> = {
  grammar: "Грамматика",
  vocabulary: "Лексика",
  listening: "Аудирование",
  speaking: "Говорение",
  spelling: "Правописание",
};

const DAY_MS = 24 * 60 * 60 * 1000;

export default async function DashboardPage() {
  const session = await requireSession();
  const userId = session.user.id;

  const [u] = await db.select().from(user).where(eq(user.id, userId));
  if (!u.difficulty) redirect("/onboarding");

  const checkin = await dailyCheckin(userId);
  const limit = u.plan === "free" ? await getFreeLimit(userId) : null;

  const progress = await db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, userId));
  const completedIds = new Set(
    progress.filter((p) => p.status === "completed").map((p) => p.levelId),
  );

  const lang = await getLanguageContext(userId);
  const langInfo = languageOf(lang.active);

  const generalLevels = await db
    .select()
    .from(levels)
    .where(and(eq(levels.track, "general"), eq(levels.language, lang.active)))
    .orderBy(asc(levels.orderIndex));

  // Прогресс по всем изучаемым языкам (для блока «Мои языки»)
  const allLevels = await db.select({ id: levels.id, language: levels.language }).from(levels);
  const completedAll = new Set(
    (await db.select().from(userProgress).where(eq(userProgress.userId, userId)))
      .filter((p) => p.status === "completed")
      .map((p) => p.levelId),
  );
  const myLanguages = lang.enrolled.map((code) => {
    const ls = allLevels.filter((l) => l.language === code);
    return {
      code,
      info: languageOf(code),
      total: ls.length,
      done: ls.filter((l) => completedAll.has(l.id)).length,
    };
  });
  const nextLevel = generalLevels.find((l) => !completedIds.has(l.id));

  const myCards = await db.select().from(userCards).where(eq(userCards.userId, userId));

  // Точность по навыкам и активность
  const answers = await db
    .select({
      skill: exercises.skill,
      isCorrect: userAnswers.isCorrect,
      createdAt: userAnswers.createdAt,
    })
    .from(userAnswers)
    .innerJoin(exercises, eq(userAnswers.exerciseId, exercises.id))
    .where(eq(userAnswers.userId, userId));
  const bySkill = new Map<string, { total: number; correct: number }>();
  for (const a of answers) {
    const s = bySkill.get(a.skill) ?? { total: 0, correct: 0 };
    s.total++;
    if (a.isCorrect) s.correct++;
    bySkill.set(a.skill, s);
  }

  const completedGeneral = generalLevels.filter((l) => completedIds.has(l.id)).length;

  // Активность за 7 дней
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * DAY_MS);
    return {
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("ru-RU", { weekday: "short" }),
      count: 0,
    };
  });
  for (const a of answers) {
    const key = a.createdAt.toISOString().slice(0, 10);
    const day = week.find((w) => w.key === key);
    if (day) day.count++;
  }
  const maxCount = Math.max(1, ...week.map((w) => w.count));

  // Слабое место: навык с самой низкой точностью (минимум 3 ответа)
  const weakest = Object.entries(SKILLS)
    .map(([key, label]) => {
      const s = bySkill.get(key);
      return { key, label, total: s?.total ?? 0, pct: s && s.total > 0 ? Math.round((s.correct / s.total) * 100) : null };
    })
    .filter((s) => s.pct !== null && s.total >= 3)
    .sort((a, b) => (a.pct ?? 0) - (b.pct ?? 0))[0];

  const achievements = [
    { label: "Первый уровень", done: completedGeneral >= 1 },
    { label: "Серия 3 дня", done: checkin.streak >= 3 },
    { label: "Серия 7 дней", done: checkin.streak >= 7 },
    { label: "5 карточек", done: myCards.length >= 5 },
    { label: "10 уровней", done: completedGeneral >= 10 },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 fade-up">
      {/* Приветствие */}
      <div className="flex items-start justify-between gap-6 mb-10">
        <div>
          <p className="mono-label mb-2">Обзор</p>
          <h1 className="text-3xl font-semibold tracking-tight">Привет, {u.name}!</h1>
          {checkin.checkedInNow && (
            <p className="text-agreen text-sm mt-2">
              Ежедневный вход: серия {checkin.streak}{" "}
              {plural(checkin.streak, "день", "дня", "дней")}, +{checkin.bonusXp} XP
            </p>
          )}
          {weakest && (
            <p className="text-sm mt-2 text-dim">
              Слабое место: <span className="text-aorange">{weakest.label}</span> ({weakest.pct}%).{" "}
              <Link href="/review" className="text-fg underline underline-offset-4">Повторить ошибки</Link>
            </p>
          )}
        </div>
      </div>

      {/* Статы */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <Stat icon={<Flame size={15} className="text-aorange" />} label="Серия дней" value={String(checkin.streak)} />
        <Stat icon={<Zap size={15} className="text-ayellow" />} label="Опыт" value={`${u.xp + (checkin.checkedInNow ? checkin.bonusXp : 0)} XP`} />
        <Stat icon={<BookOpen size={15} className="text-ablue" />} label="Уровней пройдено" value={`${completedGeneral} / ${generalLevels.length}`} />
        <Stat icon={<Layers size={15} className="text-agreen" />} label="Карточек собрано" value={String(myCards.length)} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Продолжить */}
          <section className="rounded-2xl border border-line card-solid overflow-hidden">
            <div className="px-5 py-3 border-b border-line mono-label">Продолжить обучение</div>
            <div className="p-5 flex items-center justify-between gap-4">
              {nextLevel ? (
                <>
                  <div>
                    <p className="font-mono text-xs text-dim mb-1">
                      Уровень {String(nextLevel.orderIndex).padStart(2, "0")}
                    </p>
                    <p className="font-medium">{nextLevel.title}</p>
                    <p className="text-dim text-sm mt-0.5">{nextLevel.subtitle}</p>
                  </div>
                  <Link
                    href={`/learn/${nextLevel.id}`}
                    className="btn-violet shrink-0 h-10 px-5 text-sm font-medium flex items-center"
                  >
                    Начать →
                  </Link>
                </>
              ) : generalLevels.length === 0 ? (
                <p className="text-dim text-sm">Контент ещё не загружен (запустите db:seed).</p>
              ) : (
                <p className="text-sm">Все уровни пройдены — поздравляем! 🎉</p>
              )}
            </div>
          </section>

          {/* Мои языки */}
          <section className="rounded-2xl border border-line card-solid overflow-hidden">
            <div className="px-5 py-3 border-b border-line mono-label flex items-center justify-between">
              <span>Мои языки</span>
              <Link href="/languages" className="hover:text-fg transition-colors">Добавить →</Link>
            </div>
            <ul className="divide-y divide-line">
              {myLanguages.map((l) => (
                <li key={l.code} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl">{l.info.flag}</span>
                    <div className="min-w-0">
                      <p className="font-medium truncate">
                        {l.info.name}
                        {l.code === lang.active && <span className="mono-label ml-2 text-violet">активный</span>}
                      </p>
                      <p className="text-dim text-xs font-mono">
                        {l.total ? `${l.done} / ${l.total} уровней` : "курс скоро"}
                      </p>
                    </div>
                  </div>
                  {l.code !== lang.active && (
                    <Link href="/languages" className="mono-label shrink-0 hover:text-fg transition-colors">
                      Переключить
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* Активность за неделю */}
          <section className="rounded-2xl border border-line card-solid overflow-hidden">
            <div className="px-5 py-3 border-b border-line mono-label">Активность за неделю</div>
            <div className="p-5">
              <div className="flex items-end justify-between gap-3 h-32">
                {week.map((w) => (
                  <div key={w.key} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <span className="font-mono text-[11px] text-dim">{w.count || ""}</span>
                    <div
                      className="w-full rounded-md bg-violet/80 transition-all"
                      style={{ height: `${Math.max(4, (w.count / maxCount) * 100)}%`, opacity: w.count ? 1 : 0.2 }}
                    />
                    <span className="mono-label text-[10px]">{w.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-dim text-xs mt-4">Считаются ответы на задания за последние 7 дней.</p>
            </div>
          </section>

          {/* Навыки */}
          <section className="rounded-2xl border border-line card-solid overflow-hidden">
            <div className="px-5 py-3 border-b border-line mono-label">Точность по навыкам</div>
            <div className="p-5 flex flex-col gap-4">
              {Object.entries(SKILLS).map(([key, label]) => {
                const s = bySkill.get(key);
                const pct = s && s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
                return (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span>{label}</span>
                      <span className="font-mono text-dim">
                        {s ? `${pct}%` : "—"}
                      </span>
                    </div>
                    <div className="h-1 bg-line rounded-full overflow-hidden">
                      <div className="h-full spectrum rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-8">
          {/* Достижения */}
          <section className="rounded-2xl border border-line card-solid overflow-hidden">
            <div className="px-5 py-3 border-b border-line mono-label flex items-center gap-2">
              <Trophy size={13} className="text-ayellow" /> Достижения
            </div>
            <ul className="divide-y divide-line text-sm">
              {achievements.map((a) => (
                <li key={a.label} className="flex items-center justify-between px-5 py-3">
                  <span className={a.done ? "" : "text-faint"}>{a.label}</span>
                  <span className={`font-mono text-xs ${a.done ? "text-agreen" : "text-faint"}`}>
                    {a.done ? "получено" : "—"}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Лимит Free */}
          {limit && (
            <section className="rounded-2xl border border-line card-solid overflow-hidden">
              <div className="px-5 py-3 border-b border-line mono-label">Лимит Free</div>
              <div className="p-5 text-sm flex flex-col gap-3">
                <Row k="Уроки сегодня" v={`${limit.lessonsUsed} / ${FREE_LESSONS_PER_DAY}`} />
                <Row k="Минуты сегодня" v={`${limit.minutesUsed} / ${FREE_MINUTES_PER_DAY}`} />
                {limit.exhausted && limit.resetsAt && (
                  <p className="text-aorange">
                    Лимит исчерпан. Сброс: {limit.resetsAt.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                )}
                <p className="text-faint leading-relaxed">
                  Pro снимает все ограничения — скоро.
                </p>
              </div>
            </section>
          )}

          {/* Треки */}
          <section className="rounded-2xl border border-line card-solid overflow-hidden">
            <div className="px-5 py-3 border-b border-line mono-label">Треки</div>
            <div className="divide-y divide-line text-sm">
              <TrackLink href="/learn" title="Общий курс" note="20 уровней" />
              <TrackLink href="/exams/ege" title="ЕГЭ" note="демо" />
              <TrackLink href="/exams/ielts" title="IELTS" note="демо" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-4 rounded-2xl border border-line card-solid">
      <div className="flex items-center gap-2 mb-2">{icon}<span className="mono-label">{label}</span></div>
      <p className="text-xl font-semibold font-mono">{value}</p>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-dim">{k}</span>
      <span className="font-mono">{v}</span>
    </div>
  );
}

function TrackLink({ href, title, note }: { href: string; title: string; note: string }) {
  return (
    <Link href={href} className="flex items-center justify-between px-5 py-3.5 hover:bg-raised transition-colors">
      <span>{title}</span>
      <span className="mono-label">{note}</span>
    </Link>
  );
}

function plural(n: number, one: string, few: string, many: string) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}
