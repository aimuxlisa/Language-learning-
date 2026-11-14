"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Обзор" },
  { href: "/learn", label: "Уроки" },
  { href: "/languages", label: "Языки" },
  { href: "/exams", label: "Экзамены" },
  { href: "/collection", label: "Коллекция" },
  { href: "/review", label: "Повторение" },
  { href: "/leaderboard", label: "Рейтинг" },
  { href: "/settings", label: "Настройки" },
];

export function AppNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap items-center gap-1">
      {items.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3.5 h-9 flex items-center rounded-full text-[13px] whitespace-nowrap transition-all ${
              active ? "text-fg bg-raised border border-line" : "text-dim hover:text-fg"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
