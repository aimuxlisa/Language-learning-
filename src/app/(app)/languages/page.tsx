import Link from "next/link";
import { requireSession } from "@/lib/session";
import { LANGUAGES, getLanguageContext } from "@/lib/languages";
import { enrollLanguage, leaveLanguage, setActiveLanguage } from "./actions";

export const metadata = { title: "Языки — 4 your learning" };

export default async function LanguagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const session = await requireSession();
  const ctx = await getLanguageContext(session.user.id);

  const query = q.trim().toLowerCase();
  const list = LANGUAGES.filter(
    (l) =>
      !query ||
      l.name.toLowerCase().includes(query) ||
      l.native.toLowerCase().includes(query) ||
      l.code.includes(query),
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 fade-up">
      <p className="mono-label mb-2">Языки</p>
      <h1 className="text-3xl font-semibold tracking-tight mb-2">Что будем учить?</h1>
      <p className="text-dim mb-8">
        Добавляйте сколько угодно языков и переключайтесь между ними. Прогресс по каждому сохраняется.
      </p>

      <form className="mb-8">
        <input
          name="q"
          defaultValue={q}
          placeholder="Найти язык…"
          className="input w-full sm:max-w-xs"
          autoComplete="off"
        />
      </form>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {list.map((l) => {
          const enrolled = ctx.enrolled.includes(l.code);
          const active = ctx.active === l.code;
          const hasCourse = ctx.withCourse.has(l.code);
          return (
            <div
              key={l.code}
              className={`rounded-2xl border p-5 flex flex-col gap-4 transition-colors ${
                active ? "border-violet bg-violet/5" : "border-line card-solid"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-3xl">{l.flag}</span>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{l.name}</p>
                    <p className="text-dim text-sm truncate">{l.native}</p>
                  </div>
                </div>
                <span className={`mono-label shrink-0 ${hasCourse ? "text-agreen" : "text-faint"}`}>
                  {hasCourse ? "курс есть" : "скоро"}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-auto">
                {!enrolled ? (
                  <form action={enrollLanguage}>
                    <input type="hidden" name="code" value={l.code} />
                    <button className="btn-violet h-9 px-4 text-sm font-medium">Добавить</button>
                  </form>
                ) : (
                  <>
                    {active ? (
                      <span className="mono-label text-violet h-9 px-3 flex items-center">Изучаю сейчас</span>
                    ) : (
                      <form action={setActiveLanguage}>
                        <input type="hidden" name="code" value={l.code} />
                        <button className="btn-ghost h-9 px-4 text-sm">Сделать активным</button>
                      </form>
                    )}
                    {ctx.enrolled.length > 1 && (
                      <form action={leaveLanguage}>
                        <input type="hidden" name="code" value={l.code} />
                        <button className="mono-label h-9 px-2 hover:text-ared transition-colors">Убрать</button>
                      </form>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {list.length === 0 && (
        <p className="text-dim mt-6">
          Ничего не найдено. <Link href="/languages" className="underline underline-offset-4">Показать все</Link>
        </p>
      )}
    </div>
  );
}
