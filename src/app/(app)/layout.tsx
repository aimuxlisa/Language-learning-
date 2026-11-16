import Link from "next/link";
import { requireSession } from "@/lib/session";
import { AppNav } from "@/components/AppNav";
import { SignOutButton } from "@/components/SignOutButton";
import { Avatar } from "@/components/Avatar";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getLanguageContext, languageOf } from "@/lib/languages";
import { setActiveLanguage } from "./languages/actions";
import { Flame, Zap } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  const lang = await getLanguageContext(session.user.id);
  const u = session.user as typeof session.user & {
    xp?: number;
    streakCount?: number;
    plan?: string;
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <header className="relative z-20 min-h-16 py-2 px-4 sm:px-8 border-b border-line flex flex-wrap items-center justify-between gap-x-4 gap-y-2 sticky top-0 bg-bg/80 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 min-w-0">
          <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
            <span className="w-5 h-5 bg-violet rounded-sm" />
            <span className="wordmark">4 your learning</span>
          </Link>
          <AppNav />
        </div>
        <div className="flex items-center gap-4 sm:gap-5 shrink-0">
          <span className="flex items-center gap-1.5 text-[13px] text-dim">
            <Flame size={14} className="text-aorange" />
            {u.streakCount ?? 0}
          </span>
          <span className="flex items-center gap-1.5 text-[13px] text-dim">
            <Zap size={14} className="text-ayellow" />
            {u.xp ?? 0} XP
          </span>
          <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-dim hidden md:block">
            {(u.plan ?? "free") === "pro" ? "PRO" : "FREE"}
          </span>
          <LanguageSwitcher
            active={lang.active}
            options={lang.enrolled.map((c) => ({ code: c, name: languageOf(c).name, flag: languageOf(c).flag }))}
            action={setActiveLanguage}
          />
          <Link href="/settings" title="Профиль" className="hover:opacity-80 transition-opacity">
            <Avatar image={u.image ?? null} name={u.name} size={32} />
          </Link>
          <SignOutButton />
        </div>
      </header>
      <main className="relative z-10 flex-1 min-w-0">{children}</main>
    </div>
  );
}
