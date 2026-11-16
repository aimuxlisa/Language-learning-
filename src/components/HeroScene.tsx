import type { ReactNode } from "react";

/** Обёртка для героя лендинга: центрирует содержимое. Фоновые треугольники убраны по запросу. */
export function HeroScene({ children }: { children: ReactNode }) {
  return <div className="relative w-full h-[420px] sm:h-[520px] flex items-center justify-center">{children}</div>;
}
