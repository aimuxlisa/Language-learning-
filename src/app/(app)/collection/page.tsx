import { eq } from "drizzle-orm";
import { db } from "@/db";
import { cards, userCards } from "@/db/schema";
import { requireSession } from "@/lib/session";

export const metadata = { title: "Коллекция — LinguaQuest" };

const RARITY: Record<string, { label: string; cls: string }> = {
  common: { label: "Обычная", cls: "text-dim" },
  rare: { label: "Редкая", cls: "text-ablue" },
  epic: { label: "Эпическая", cls: "text-aorange" },
  legendary: { label: "Легендарная", cls: "spectrum-text" },
};

export default async function CollectionPage() {
  const session = await requireSession();
  const all = await db.select().from(cards);
  const mine = await db.select().from(userCards).where(eq(userCards.userId, session.user.id));
  const owned = new Set(mine.map((c) => c.cardId));

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 fade-up">
      <p className="mono-label mb-2">Коллекция</p>
      <h1 className="text-3xl font-semibold tracking-tight mb-2">
        Карточки: {owned.size} / {all.length}
      </h1>
      <p className="text-dim mb-8">За каждый пройденный уровень открывается новая карточка.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {all.map((c) => {
          const has = owned.has(c.id);
          const r = RARITY[c.rarity] ?? RARITY.common;
          return (
            <div
              key={c.id}
              className={`border p-4 flex flex-col gap-2 ${
                has ? "border-line bg-raised" : "border-line opacity-35"
              }`}
            >
              <span className="text-4xl">{has ? c.emoji : "❔"}</span>
              <div>
                <p className={`mono-label ${has ? r.cls : ""}`}>{r.label}</p>
                <p className="font-medium text-sm mt-1">{has ? c.title : "???"}</p>
                {has && <p className="text-dim text-xs mt-1 leading-relaxed">{c.description}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
