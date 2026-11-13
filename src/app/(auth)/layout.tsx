import Link from "next/link";
import { Robot } from "@/components/Robot";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-frame p-3 sm:p-6 flex">
      <div className="flex-1 bg-bg border border-[#000] flex flex-col">
        <header className="h-14 border-b border-line flex items-center px-5 justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-5 h-5 spectrum rounded-sm" />
            <span className="font-semibold tracking-tight">LinguaQuest</span>
          </Link>
          <span className="mono-label hidden sm:block">AI English Tutor</span>
        </header>
        <main className="flex-1 grid lg:grid-cols-2">
          <div className="hidden lg:flex items-center justify-center border-r border-line">
            <div className="flex flex-col items-center gap-8">
              <Robot size={180} />
              <p className="mono-label">Your English. Leveled up.</p>
            </div>
          </div>
          <div className="flex items-center justify-center p-6">
            <div className="w-full max-w-sm">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
