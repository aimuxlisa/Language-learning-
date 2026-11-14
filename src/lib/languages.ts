import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { levels, user, userLanguages } from "@/db/schema";

export type Language = { code: string; name: string; native: string; flag: string };

/** Каталог языков мира (код — ISO 639-1). Курсы есть не у всех: остальные можно добавить и ждать. */
export const LANGUAGES: Language[] = [
  { code: "en", name: "Английский", native: "English", flag: "🇬🇧" },
  { code: "es", name: "Испанский", native: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Французский", native: "Français", flag: "🇫🇷" },
  { code: "de", name: "Немецкий", native: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Итальянский", native: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Португальский", native: "Português", flag: "🇵🇹" },
  { code: "zh", name: "Китайский", native: "中文", flag: "🇨🇳" },
  { code: "ja", name: "Японский", native: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "Корейский", native: "한국어", flag: "🇰🇷" },
  { code: "ar", name: "Арабский", native: "العربية", flag: "🇸🇦" },
  { code: "tr", name: "Турецкий", native: "Türkçe", flag: "🇹🇷" },
  { code: "hi", name: "Хинди", native: "हिन्दी", flag: "🇮🇳" },
  { code: "uk", name: "Украинский", native: "Українська", flag: "🇺🇦" },
  { code: "pl", name: "Польский", native: "Polski", flag: "🇵🇱" },
  { code: "nl", name: "Нидерландский", native: "Nederlands", flag: "🇳🇱" },
  { code: "sv", name: "Шведский", native: "Svenska", flag: "🇸🇪" },
  { code: "fi", name: "Финский", native: "Suomi", flag: "🇫🇮" },
  { code: "el", name: "Греческий", native: "Ελληνικά", flag: "🇬🇷" },
  { code: "he", name: "Иврит", native: "עברית", flag: "🇮🇱" },
  { code: "fa", name: "Персидский", native: "فارسی", flag: "🇮🇷" },
  { code: "id", name: "Индонезийский", native: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "vi", name: "Вьетнамский", native: "Tiếng Việt", flag: "🇻🇳" },
  { code: "th", name: "Тайский", native: "ไทย", flag: "🇹🇭" },
  { code: "sw", name: "Суахили", native: "Kiswahili", flag: "🇰🇪" },
  { code: "kk", name: "Казахский", native: "Қазақша", flag: "🇰🇿" },
  { code: "uz", name: "Узбекский", native: "Oʻzbekcha", flag: "🇺🇿" },
  { code: "ka", name: "Грузинский", native: "ქართული", flag: "🇬🇪" },
  { code: "cs", name: "Чешский", native: "Čeština", flag: "🇨🇿" },
  { code: "ro", name: "Румынский", native: "Română", flag: "🇷🇴" },
  { code: "hu", name: "Венгерский", native: "Magyar", flag: "🇭🇺" },
  { code: "da", name: "Датский", native: "Dansk", flag: "🇩🇰" },
  { code: "no", name: "Норвежский", native: "Norsk", flag: "🇳🇴" },
  { code: "la", name: "Латынь", native: "Latina", flag: "🏛️" },
];

export const LANGUAGE_BY_CODE = new Map(LANGUAGES.map((l) => [l.code, l]));

export function languageOf(code: string): Language {
  return LANGUAGE_BY_CODE.get(code) ?? { code, name: code, native: code, flag: "🌐" };
}

/**
 * Текущий языковой контекст пользователя. Старые аккаунты без записей получают английский
 * автоматически, так что весь уже существующий курс остаётся доступным.
 */
export async function getLanguageContext(userId: string) {
  const [u] = await db.select().from(user).where(eq(user.id, userId));
  let enrolled = await db.select().from(userLanguages).where(eq(userLanguages.userId, userId));
  if (!enrolled.some((e) => e.language === u.activeLanguage)) {
    await db
      .insert(userLanguages)
      .values({ userId, language: u.activeLanguage, enrolledAt: new Date() })
      .onConflictDoNothing();
    enrolled = await db.select().from(userLanguages).where(eq(userLanguages.userId, userId));
  }
  // Языки, для которых в базе есть хоть один уровень
  const withCourse = new Set(
    (await db.select({ language: levels.language }).from(levels)).map((r) => r.language),
  );
  return {
    active: u.activeLanguage,
    enrolled: enrolled.map((e) => e.language),
    withCourse,
    user: u,
  };
}

export async function hasEnrollment(userId: string, language: string) {
  const [row] = await db
    .select()
    .from(userLanguages)
    .where(and(eq(userLanguages.userId, userId), eq(userLanguages.language, language)));
  return !!row;
}
