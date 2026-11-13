import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { Lock, Check } from "lucide-react";
import { db } from "@/db";
import { levels, user, userProgress } from "@/db/schema";
import { requireSession } from "@/lib/session";
import { FREE_MAX_LEVEL_INDEX } from "@/lib/limits";

export const metadata = { title: "Уроки — LinguaQuest" };

export default async function LearnPage() {
  const session = await requireSession();
  const [u] = await db.select().from(user).where(eq(user.id, session.user.id));

  const all = await db
    .select()
    .from(levels)
    .where(eq(levels.track, "general"))
    .orderBy(asc(levels.orderIndex));
  const progress = await db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, session.user.id));
  const completed = new Set(
    progress.filter((p) => p.status === "completed").map((p) => p.levelId),
  );
  const best = new Map(progress.map((p) => [p.levelId, p.bestScore]));

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 fade-up">
      <p className="mono-label mb-2">Общий курс</p>
      <h1 className="text-3xl font-semibold tracking-tight mb-8">
        20 уровней: от A1 до B2
      </h1>

      <div className="border border-line divide-y divide-line">
        {all.map((lvl, i) => {
          const done = completed.has(lvl.id);
          const prevDone = i === 0 || completed.has(all[i - 1].id);
          const proBlocked = u.plan === "free" && lvl.orderIndex > FREE_MAX_LEVEL_INDEX;
          const open = prevDone && !proBlocked;

          const inner = (
            <div className="flex items-center gap-4 px-5 py-4">
              <span
                className={`w-9 h-9 shrink-0 flex items-center justify-center border text-sm font-mono ${
                  done
                    ? "border-agreen text-agreen"
                    : open
                      ? "spectrum-border"
                      : "border-line text-faint"
                }`}
              >
                {done ? <Check size={15} /> : String(lvl.orderIndex).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <p className={`font-medium truncate ${open || done ? "" : "text-faint"}`}>
                  {lvl.title}
                </p>
                <p className="text-dim text-sm truncate">{lvl.subtitle}</p>
              </div>
              <div className="shrink-0 flex items-center gap-4">
                {done && (
                  <span className="font-mono text-xs text-agreen">{best.get(lvl.id)}%</span>
                )}
                {proBlocked ? (
                  <span className="mono-label flex items-center gap-1.5">
                    <Lock size={12} /> PRO
                  </span>
                ) : !prevDone ? (
                  <Lock size={14} className="text-faint" />
                ) : (
                  <span className="mono-label">{done ? "Повторить" : "Начать"} →</span>
                )}
              </div>
            </div>
          );

          return open ? (
            <Link key={lvl.id} href={`/learn/${lvl.id}`} className="block hover:bg-raised transition-colors">
              {inner}
            </Link>
          ) : (
            <div key={lvl.id}>{inner}</div>
          );
        })}
      </div>
    </div>
  );
}
