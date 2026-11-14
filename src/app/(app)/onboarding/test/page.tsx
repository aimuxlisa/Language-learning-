import Link from "next/link";
import { requireSession } from "@/lib/session";
import { PlacementTest } from "./PlacementTest";
import { saveDifficulty } from "./actions";

export const metadata = { title: "Тест уровня — 4 your learning" };

export default async function PlacementPage() {
  await requireSession();
  return (
    <div className="max-w-xl mx-auto px-6 py-14 fade-up">
      <p className="mono-label mb-3">Тест уровня</p>
      <h1 className="text-3xl font-semibold tracking-tight mb-2">Пять вопросов — и уровень известен</h1>
      <p className="text-dim mb-8">Выберите правильный вариант. Результат можно поменять в настройках.</p>
      <PlacementTest action={saveDifficulty} />
      <Link href="/onboarding" className="mono-label inline-block mt-8 hover:text-fg transition-colors">
        ← Выбрать уровень вручную
      </Link>
    </div>
  );
}
