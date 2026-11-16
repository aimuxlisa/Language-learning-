import Link from "next/link";

export const metadata = { title: "Экзамены — 4 your learning" };

export default function ExamsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <p className="mono-label mb-2">Экзамены</p>
      <h1 className="text-3xl font-semibold tracking-tight mb-8">Подготовка к экзаменам</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        <Link href="/exams/ege" className="rounded-2xl border border-line card-solid p-6 hover:border-violet transition-colors group">
          <p className="mono-label mb-4 group-hover:spectrum-text">Российский экзамен</p>
          <p className="text-xl font-semibold mb-1.5">ЕГЭ</p>
          <p className="text-dim text-sm leading-relaxed">
            Грамматика, лексика и аудирование в формате экзамена. 2 демо-урока.
          </p>
        </Link>
        <Link href="/exams/ielts" className="rounded-2xl border border-line card-solid p-6 hover:border-violet transition-colors group">
          <p className="mono-label mb-4 group-hover:spectrum-text">Международный экзамен</p>
          <p className="text-xl font-semibold mb-1.5">IELTS</p>
          <p className="text-dim text-sm leading-relaxed">
            Академическая лексика и Speaking Part 1. 2 демо-урока.
          </p>
        </Link>
      </div>
    </div>
  );
}
