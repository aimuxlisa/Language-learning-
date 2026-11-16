import Link from "next/link";
import { Robot } from "@/components/Robot";
import { HeroScene } from "@/components/HeroScene";
import { CandleStrip } from "@/components/CandleStrip";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

const STATS = [
  { value: "20", label: "уровней" },
  { value: "204", label: "упражнения" },
  { value: "20", label: "карточек" },
];

export default async function Home() {
  const session = await getSession();

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Фоновая сетка с затуханием к краям */}
      <div
        className="pointer-events-none absolute inset-0 grid-bg opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
        aria-hidden="true"
      >
        <span className="scan-box" style={{ left: "38%", top: "22%" }} />
      </div>
      {/* Мерцающие точки */}
      {[
        [12, 18, 0], [26, 64, 0.8], [71, 12, 1.6], [84, 46, 0.4],
        [58, 78, 2.0], [7, 52, 1.2], [92, 84, 2.6], [44, 9, 0.2],
      ].map(([x, y, d], i) => (
        <span
          key={i}
          className="twinkle"
          style={{ left: `${x}%`, top: `${y}%`, "--d": `${d}s` } as React.CSSProperties}
          aria-hidden="true"
        />
      ))}

      {/* Навбар */}
      <header className="relative z-10 h-16 px-6 lg:px-12 flex items-center justify-between fade-up">
        <Link href="/" className="wordmark">4 your learning</Link>
        <nav className="flex items-center gap-6 text-[13px] text-dim">
          <a href="#pricing" className="hidden sm:inline hover:text-fg transition-colors">Тарифы</a>
          <Link href="/faq" className="hidden sm:inline hover:text-fg transition-colors">FAQ</Link>
          {session ? (
            <Link href="/dashboard" className="btn-violet h-10 px-5 flex items-center text-[13px] font-medium">
              В кабинет
            </Link>
          ) : (
            <>
              <Link href="/login" className="hover:text-fg transition-colors">Войти</Link>
              <Link href="/register" className="btn-violet h-10 px-5 flex items-center text-[13px] font-medium">
                Начать бесплатно
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 grid lg:grid-cols-2 items-center gap-6 px-6 lg:px-12 py-10 lg:py-16">
        <div className="max-w-xl fade-up">
          <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-aorange mb-6">
            Английский · игра · практика
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.02]">
            <span className="reveal"><span style={{ "--d": "0.1s" } as React.CSSProperties}>Учи английский,</span></span>
            <br />
            <span className="reveal"><span style={{ "--d": "0.35s" } as React.CSSProperties}><span className="text-agreen">играя</span> легко.</span></span>
          </h1>
          <p className="text-dim mt-6 max-w-md text-base leading-relaxed">
            Разбор ошибок с объяснениями, коллекционные карточки и подготовка к ЕГЭ и IELTS. Занятия короткие, прогресс виден сразу.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={session ? "/dashboard" : "/register"}
              className="btn-violet h-12 px-7 text-sm font-medium flex items-center"
            >
              {session ? "В кабинет →" : "Начать бесплатно →"}
            </Link>
            <Link href="/login" className="btn-ghost h-12 px-7 text-sm font-medium flex items-center">
              Войти
            </Link>
          </div>

          <dl className="mt-12 grid grid-cols-3 gap-4 max-w-md">
            {STATS.map((s) => (
              <div key={s.label} className="lift border-l border-line pl-4">
                <dt className="font-mono text-2xl font-semibold">{s.value}</dt>
                <dd className="mono-label mt-1">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative fade-up-slow delay-1">
          <HeroScene>
            <Robot size={240} face="^_^" />
          </HeroScene>
        </div>
      </main>

      {/* График свечей */}
      <div className="relative z-10 px-6 lg:px-12 pb-6">
        <CandleStrip />
      </div>

      {/* Тарифы */}
      <section id="pricing" className="relative z-10 border-t border-line grid sm:grid-cols-2 px-6 lg:px-12">
        <div className="p-6 sm:pr-10 border-b sm:border-b-0 sm:border-r border-line">
          <p className="mono-label mb-3">Free</p>
          <p className="text-2xl font-semibold mb-2">0 ₽</p>
          <p className="text-dim text-sm leading-relaxed">
            5 уроков или 20 минут в день · уровни 1–5 · лимит сбрасывается каждые 24 часа.
          </p>
        </div>
        <div className="p-6 sm:pl-10">
          <p className="mono-label mb-3 text-violet">Pro · скоро</p>
          <p className="text-2xl font-semibold mb-2">—</p>
          <p className="text-dim text-sm leading-relaxed">
            Все 20 уровней без ограничений · экзаменационные треки · приоритетный разбор ошибок.
          </p>
        </div>
      </section>

      <footer className="relative z-10 h-12 border-t border-line flex items-center justify-between px-6 lg:px-12">
        <span className="mono-label">4 your learning × 2026</span>
        <span className="mono-label">EN · RU</span>
      </footer>
    </div>
  );
}
