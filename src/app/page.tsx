import Link from "next/link";
import { Robot } from "@/components/Robot";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-frame p-3 sm:p-6 flex">
      <div className="flex-1 bg-bg border border-[#000] flex flex-col">
        {/* Навбар */}
        <header className="h-14 border-b border-line flex items-stretch justify-between">
          <div className="flex items-center gap-2.5 px-5">
            <span className="w-5 h-5 spectrum rounded-sm" />
            <span className="font-semibold tracking-tight">LinguaQuest</span>
          </div>
          <div className="flex items-stretch">
            <Link href="/login" className="px-5 flex items-center text-[13px] text-dim border-l border-line hover:text-fg transition-colors">
              Войти
            </Link>
            <Link href="/register" className="px-5 flex items-center text-[13px] border-l border-line bg-fg text-bg font-medium hover:opacity-90 transition-opacity">
              Начать бесплатно
            </Link>
          </div>
        </header>

        {/* Hero */}
        <main className="flex-1 grid lg:grid-cols-[1fr_auto_1fr] items-center px-6 lg:px-12 py-16 gap-10">
          <div className="max-w-md">
            <p className="mono-label mb-6">Unleash the power of</p>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-tight">
              <span className="border border-fg px-3 py-0.5 inline-block mb-2">English</span>
              <br />
              <span className="spectrum-text">AI Tutor</span>
            </h1>
            <p className="text-dim mt-6 leading-relaxed">
              Изучайте английский в игровой форме: 20 уровней, разбор ошибок от AI,
              коллекционные карточки и подготовка к ЕГЭ и IELTS.
            </p>
            <div className="mt-8 flex gap-3">
              <Link
                href={session ? "/dashboard" : "/register"}
                className="h-11 px-7 bg-fg text-bg text-sm font-medium flex items-center hover:opacity-90 transition-opacity"
              >
                {session ? "В кабинет →" : "Начать бесплатно →"}
              </Link>
            </div>
          </div>

          <div className="hidden lg:block">
            <Robot size={220} />
          </div>

          <div className="hidden lg:flex flex-col gap-3 justify-self-end text-right">
            {["Speaking и Listening", "AI-разбор ошибок", "ЕГЭ · IELTS", "And much more"].map((t, i, a) => (
              <p key={t} className={`mono-label ${i === a.length - 1 ? "opacity-50" : ""}`}>{t}</p>
            ))}
          </div>
        </main>

        {/* Тарифы */}
        <section className="border-t border-line grid sm:grid-cols-2">
          <div className="p-6 border-b sm:border-b-0 sm:border-r border-line">
            <p className="mono-label mb-3">Free</p>
            <p className="text-2xl font-semibold mb-2">0 ₽</p>
            <p className="text-dim text-sm leading-relaxed">
              5 уроков или 20 минут в день · уровни 1–5 · лимит сбрасывается каждые 24 часа.
            </p>
          </div>
          <div className="p-6">
            <p className="mono-label mb-3 spectrum-text">Pro · скоро</p>
            <p className="text-2xl font-semibold mb-2">—</p>
            <p className="text-dim text-sm leading-relaxed">
              Все 20 уровней без ограничений · экзаменационные треки · приоритетный AI-разбор.
            </p>
          </div>
        </section>

        <footer className="h-12 border-t border-line flex items-center justify-between px-5">
          <span className="mono-label">LinguaQuest × 2026</span>
          <span className="mono-label">EN · RU</span>
        </footer>
      </div>
    </div>
  );
}
