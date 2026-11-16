import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <header className="relative z-10 h-16 px-6 lg:px-12 flex items-center justify-between fade-up">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="w-5 h-5 bg-violet rounded-sm" />
          <span className="wordmark">4 your learning</span>
        </Link>
        <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-dim hidden sm:block">
          English · Learning
        </span>
      </header>
      <main className="relative z-10 flex-1 grid lg:grid-cols-2 items-center gap-10 px-6 lg:px-12 py-10">
        <div className="hidden lg:flex flex-col items-center gap-8 fade-up-slow">
          <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-dim">
            Your English. Leveled up.
          </p>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-full max-w-sm fade-up">{children}</div>
        </div>
      </main>
    </div>
  );
}
