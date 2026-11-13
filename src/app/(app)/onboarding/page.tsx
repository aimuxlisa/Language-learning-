import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/schema";
import { requireSession } from "@/lib/session";
import { Robot } from "@/components/Robot";

export const metadata = { title: "Выбор уровня — LinguaQuest" };

const options = [
  {
    value: "beginner",
    title: "Начинающий",
    mono: "A1–A2",
    text: "Учу с нуля или помню совсем немного со школы.",
  },
  {
    value: "intermediate",
    title: "Средний",
    mono: "B1",
    text: "Понимаю простые тексты, но говорю с трудом.",
  },
  {
    value: "advanced",
    title: "Продвинутый",
    mono: "B2+",
    text: "Свободно читаю, хочу отточить грамматику и речь.",
  },
];

export default async function OnboardingPage() {
  const session = await requireSession();

  async function setDifficulty(formData: FormData) {
    "use server";
    const s = await requireSession();
    const value = String(formData.get("difficulty"));
    if (!["beginner", "intermediate", "advanced"].includes(value)) return;
    await db
      .update(user)
      .set({ difficulty: value, updatedAt: new Date() })
      .where(eq(user.id, s.user.id));
    redirect("/dashboard");
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-14 flex flex-col items-center gap-10">
      <Robot size={120} face="?_?" />
      <div className="text-center">
        <p className="mono-label mb-3">Шаг 1 из 1</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          {session.user.name}, какой у вас уровень английского?
        </h1>
        <p className="text-dim mt-2">От этого зависит сложность заданий. Изменить можно в настройках.</p>
      </div>
      <form action={setDifficulty} className="grid sm:grid-cols-3 gap-3 w-full">
        {options.map((o) => (
          <button
            key={o.value}
            name="difficulty"
            value={o.value}
            className="text-left border border-line bg-raised p-5 hover:border-dim transition-colors group"
          >
            <p className="mono-label mb-4 group-hover:spectrum-text">{o.mono}</p>
            <p className="font-medium mb-1.5">{o.title}</p>
            <p className="text-dim text-sm leading-relaxed">{o.text}</p>
          </button>
        ))}
      </form>
    </div>
  );
}
