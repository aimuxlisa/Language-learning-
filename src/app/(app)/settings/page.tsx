import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/schema";
import { requireSession } from "@/lib/session";

export const metadata = { title: "Настройки — LinguaQuest" };

const difficulties = [
  { value: "beginner", label: "Начинающий (A1–A2)" },
  { value: "intermediate", label: "Средний (B1)" },
  { value: "advanced", label: "Продвинутый (B2+)" },
];

export default async function SettingsPage() {
  const session = await requireSession();
  const [u] = await db.select().from(user).where(eq(user.id, session.user.id));

  async function save(formData: FormData) {
    "use server";
    const s = await requireSession();
    const name = String(formData.get("name") ?? "").trim();
    const difficulty = String(formData.get("difficulty"));
    if (!name || !["beginner", "intermediate", "advanced"].includes(difficulty)) return;
    await db
      .update(user)
      .set({ name, difficulty, updatedAt: new Date() })
      .where(eq(user.id, s.user.id));
    revalidatePath("/settings");
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <p className="mono-label mb-2">Настройки</p>
      <h1 className="text-2xl font-semibold tracking-tight mb-10">Профиль</h1>

      <form action={save} className="flex flex-col gap-5">
        <label className="flex flex-col gap-1.5">
          <span className="mono-label">Имя</span>
          <input name="name" defaultValue={u.name} required className="input" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="mono-label">Email</span>
          <input value={u.email} disabled className="input opacity-50" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="mono-label">Сложность</span>
          <select
            name="difficulty"
            defaultValue={u.difficulty ?? "beginner"}
            className="input appearance-none"
          >
            {difficulties.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </label>
        <button className="h-11 bg-fg text-bg font-medium text-sm hover:opacity-90 transition-opacity">
          Сохранить
        </button>
      </form>

      <div className="mt-12 border border-line">
        <div className="px-5 py-4 border-b border-line flex items-center justify-between">
          <span className="mono-label">Тариф</span>
          <span className="font-mono text-sm">{u.plan === "pro" ? "PRO" : "FREE"}</span>
        </div>
        <div className="px-5 py-4 text-sm text-dim leading-relaxed">
          {u.plan === "pro" ? (
            "Все уровни и треки открыты без ограничений."
          ) : (
            <>
              Free: 5 уроков или 20 минут в сутки, доступны уровни 1–5. Лимит сбрасывается
              каждые 24 часа.
              <button
                disabled
                className="mt-4 w-full h-10 spectrum-border text-fg text-sm font-medium opacity-80 cursor-not-allowed"
              >
                Перейти на Pro — скоро
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
