"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Обзор" },
  { href: "/learn", label: "Уроки" },
  { href: "/exams", label: "Экзамены" },
  { href: "/collection", label: "Коллекция" },
  { href: "/settings", label: "Настройки" },
];

export function AppNav() {
  const pathname = usePathname();
  return (
    <nav className="flex items-stretch overflow-x-auto">
      {items.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 flex items-center text-[13px] border-l border-line whitespace-nowrap transition-colors ${
              active ? "text-fg bg-raised" : "text-dim hover:text-fg"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
