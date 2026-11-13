import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { Check, Lock } from "lucide-react";
import { db } from "@/db";
import { levels, userProgress } from "@/db/schema";
import { requireSession } from "@/lib/session";

const TRACKS: Record<string, string> = { ege: "ЕГЭ", ielts: "IELTS" };

export default async function ExamTrackPage({
  params,
}: {
  params: Promise<{ track: string }>;
}) {
  const { track } = await params;
  if (!TRACKS[track]) notFound();
  const session = await requireSession();

  const all = await db
    .select()
    .from(levels)
    .where(eq(levels.track, track))
    .orderBy(asc(levels.orderIndex));
  const progress = await db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, session.user.id));
  const completed = new Set(
    progress.filter((p) => p.status === "completed").map((p) => p.levelId),
  );

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <p className="mono-label mb-2">Трек · {TRACKS[track]}</p>
      <h1 className="text-3xl font-semibold tracking-tight mb-8">
        Подготовка к {TRACKS[track]}
      </h1>

      <div className="border border-line divide-y divide-line">
        {all.map((lvl, i) => {
          const done = completed.has(lvl.id);
          const open = i === 0 || completed.has(all[i - 1].id);
          const inner = (
            <div className="flex items-center gap-4 px-5 py-4">
              <span
                className={`w-9 h-9 shrink-0 flex items-center justify-center border text-sm font-mono ${
                  done ? "border-agreen text-agreen" : open ? "spectrum-border" : "border-line text-faint"
                }`}
              >
                {done ? <Check size={15} /> : String(lvl.orderIndex).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <p className={`font-medium truncate ${open || done ? "" : "text-faint"}`}>{lvl.title}</p>
                <p className="text-dim text-sm truncate">{lvl.subtitle}</p>
              </div>
              {open ? (
                <span className="mono-label shrink-0">{done ? "Повторить" : "Начать"} →</span>
              ) : (
                <Lock size={14} className="text-faint shrink-0" />
              )}
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
      <p className="text-faint text-sm mt-6">
        Это демо-уроки. Полные банки заданий появятся в следующих версиях.
      </p>
    </div>
  );
}
