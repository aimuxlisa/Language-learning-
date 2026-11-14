import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { exercises, levels, user } from "@/db/schema";
import { requireSession } from "@/lib/session";
import { getFreeLimit } from "@/lib/limits";
import { isLevelUnlocked } from "../actions";
import { LessonPlayer } from "@/components/lesson/LessonPlayer";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ levelId: string }>;
}) {
  const { levelId } = await params;
  const session = await requireSession();
  const [u] = await db.select().from(user).where(eq(user.id, session.user.id));

  const access = await isLevelUnlocked(u.id, u.plan, levelId);
  if (!access.lvl) {
    return <Blocked title="Урок не найден" text="Такого уровня нет." back="/learn" />;
  }
  if (!access.unlocked) {
    return access.reason === "pro_required" ? (
      <Blocked
        title="Доступно на Pro"
        text="На тарифе Free открыты уровни 1–5. Pro снимет все ограничения — скоро."
        back="/learn"
        pro
      />
    ) : (
      <Blocked title="Уровень закрыт" text="Сначала пройдите предыдущий уровень." back="/learn" />
    );
  }
  if (u.plan === "free") {
    const limit = await getFreeLimit(u.id);
    if (limit.exhausted) {
      return (
        <Blocked
          title="Лимит на сегодня исчерпан"
          text={`Free: 5 уроков или 20 минут в сутки. Сброс${limit.resetsAt ? ` в ${limit.resetsAt.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}` : " через 24 часа"}.`}
          back="/dashboard"
          pro
        />
      );
    }
  }

  const exs = await db
    .select({
      id: exercises.id,
      type: exercises.type,
      skill: exercises.skill,
      prompt: exercises.prompt,
      dataJson: exercises.dataJson,
    })
    .from(exercises)
    .where(eq(exercises.levelId, levelId))
    .orderBy(asc(exercises.orderIndex));

  return (
    <LessonPlayer
      level={{
        id: access.lvl.id,
        orderIndex: access.lvl.orderIndex,
        title: access.lvl.title,
        subtitle: access.lvl.subtitle,
        theoryMd: access.lvl.theoryMd,
        track: access.lvl.track,
      }}
      exercises={exs.map((e) => ({ ...e, data: JSON.parse(e.dataJson) }))}
    />
  );
}

function Blocked({
  title,
  text,
  back,
  pro,
}: {
  title: string;
  text: string;
  back: string;
  pro?: boolean;
}) {
  return (
    <div className="max-w-md mx-auto px-6 py-20 flex flex-col items-center text-center gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight mb-2">{title}</h1>
        <p className="text-dim leading-relaxed">{text}</p>
      </div>
      {pro && (
        <button disabled className="h-10 px-6 spectrum-border text-sm font-medium opacity-80 cursor-not-allowed">
          Перейти на Pro — скоро
        </button>
      )}
      <Link href={back} className="mono-label hover:text-fg transition-colors">
        ← Назад
      </Link>
    </div>
  );
}
