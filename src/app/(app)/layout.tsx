import Link from "next/link";
import { requireSession } from "@/lib/session";
import { AppNav } from "@/components/AppNav";
import { SignOutButton } from "@/components/SignOutButton";
import { Flame, Zap } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  const u = session.user as typeof session.user & {
    xp?: number;
    streakCount?: number;
    plan?: string;
  };

  return (
    <div className="min-h-screen bg-frame p-2 sm:p-4 flex">
      <div className="flex-1 bg-bg border border-[#000] flex flex-col min-w-0">
        <header className="h-13 border-b border-line flex items-stretch justify-between">
          <div className="flex items-stretch">
            <Link href="/dashboard" className="flex items-center gap-2.5 px-5">
              <span className="w-4.5 h-4.5 spectrum rounded-sm" />
              <span className="font-semibold tracking-tight text-[15px]">LinguaQuest</span>
            </Link>
            <AppNav />
          </div>
          <div className="flex items-center gap-5 px-5">
            <span className="flex items-center gap-1.5 text-[13px] text-dim">
              <Flame size={14} className="text-aorange" />
              {u.streakCount ?? 0}
            </span>
            <span className="flex items-center gap-1.5 text-[13px] text-dim">
              <Zap size={14} className="text-ayellow" />
              {u.xp ?? 0} XP
            </span>
            <span className="mono-label hidden md:block">
              {(u.plan ?? "free") === "pro" ? "PRO" : "FREE"}
            </span>
            <SignOutButton />
          </div>
        </header>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
