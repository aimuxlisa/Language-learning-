import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/schema";
import { requireSession } from "@/lib/session";
import { USERNAME_RE } from "@/lib/avatars";
import { AvatarPicker } from "@/components/AvatarPicker";
import { Avatar } from "@/components/Avatar";

export const metadata = { title: "Профиль — 4 your learning" };

const difficulties = [
  { value: "beginner", label: "Начинающий (A1–A2)" },
  { value: "intermediate", label: "Средний (B1)" },
  { value: "advanced", label: "Продвинутый (B2+)" },
];

const ERRORS: Record<string, string> = {
  username: "Никнейм: 3–20 символов, только латиница, цифры и _",
  taken: "Этот никнейм уже занят",
  name: "Введите имя",
};

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const session = await requireSession();
  const [u] = await db.select().from(user).where(eq(user.id, session.user.id));

  async function save(formData: FormData) {
    "use server";
    const s = await requireSession();
    const name = String(formData.get("name") ?? "").trim();
    const username = String(formData.get("username") ?? "").trim().toLowerCase();
    const difficulty = String(formData.get("difficulty"));
    const avatar = String(formData.get("avatar") ?? "");

    if (!name) redirect("/settings?error=name");
    if (username && !USERNAME_RE.test(username)) redirect("/settings?error=username");
    if (username) {
      const [taken] = await db.select().from(user).where(eq(user.username, username));
      if (taken && taken.id !== s.user.id) redirect("/settings?error=taken");
    }
    if (!["beginner", "intermediate", "advanced"].includes(difficulty)) return;

    await db
      .update(user)
      .set({
        name,
        username: username || null,
        difficulty,
        image: avatar || null,
        updatedAt: new Date(),
      })
      .where(eq(user.id, s.user.id));
    revalidatePath("/", "layout");
    redirect("/settings?saved=1");
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <p className="mono-label mb-2">Профиль</p>
      <h1 className="text-2xl font-semibold tracking-tight mb-3">Настройки</h1>
      <div className="flex items-center gap-3 mb-10">
        <Avatar image={u.image} name={u.name} size={44} />
        <div className="min-w-0">
          <p className="font-medium truncate">{u.username ? `@${u.username}` : u.name}</p>
          <p className="text-dim text-xs">{u.email}</p>
        </div>
      </div>

      {saved && <p className="text-agreen text-sm mb-6">Изменения сохранены</p>}
      {error && ERRORS[error] && (
        <p className="text-ared text-sm mb-6 rounded-xl border border-ared/40 bg-ared/5 px-3 py-2">{ERRORS[error]}</p>
      )}

      <form action={save} className="flex flex-col gap-5">
        <div className="rounded-2xl border border-line card-solid p-5 flex flex-col gap-5">
          <p className="mono-label">Аватар</p>
          <AvatarPicker current={u.image} name={u.name} />
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="mono-label">Имя</span>
          <input name="name" defaultValue={u.name} required className="input" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="mono-label">Никнейм (виден в рейтинге)</span>
          <input
            name="username"
            defaultValue={u.username ?? ""}
            placeholder="например, lingo_fan"
            maxLength={20}
            className="input"
            autoComplete="off"
          />
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
        <button className="btn-violet h-12 font-medium text-sm">Сохранить</button>
      </form>

      <div className="mt-12 rounded-2xl border border-line card-solid overflow-hidden">
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

      <p className="text-dim text-xs mt-8">
        <Link href="/leaderboard" className="underline underline-offset-4 hover:text-fg">Открыть рейтинг</Link>
      </p>
    </div>
  );
}
