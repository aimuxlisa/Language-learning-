"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { user, userLanguages } from "@/db/schema";
import { requireSession } from "@/lib/session";
import { LANGUAGE_BY_CODE, getLanguageContext } from "@/lib/languages";

function codeFrom(formData: FormData): string | null {
  const code = String(formData.get("code") ?? "");
  return LANGUAGE_BY_CODE.has(code) ? code : null;
}

/** Добавляет язык в «Мои языки» и делает его активным. */
export async function enrollLanguage(formData: FormData) {
  const s = await requireSession();
  const code = codeFrom(formData);
  if (!code) return;
  await db
    .insert(userLanguages)
    .values({ userId: s.user.id, language: code, enrolledAt: new Date() })
    .onConflictDoNothing();
  await db.update(user).set({ activeLanguage: code, updatedAt: new Date() }).where(eq(user.id, s.user.id));
  revalidatePath("/", "layout");
}

/** Переключает активный язык (только из уже добавленных). */
export async function setActiveLanguage(formData: FormData) {
  const s = await requireSession();
  const code = codeFrom(formData);
  if (!code) return;
  const ctx = await getLanguageContext(s.user.id);
  if (!ctx.enrolled.includes(code)) return;
  await db.update(user).set({ activeLanguage: code, updatedAt: new Date() }).where(eq(user.id, s.user.id));
  revalidatePath("/", "layout");
}

/** Убирает язык из «Мои языки». Прогресс сохраняется. Последний язык убрать нельзя. */
export async function leaveLanguage(formData: FormData) {
  const s = await requireSession();
  const code = codeFrom(formData);
  if (!code) return;
  const ctx = await getLanguageContext(s.user.id);
  if (ctx.enrolled.length <= 1) return;
  await db
    .delete(userLanguages)
    .where(and(eq(userLanguages.userId, s.user.id), eq(userLanguages.language, code)));
  if (ctx.active === code) {
    const next = ctx.enrolled.find((c) => c !== code)!;
    await db.update(user).set({ activeLanguage: next, updatedAt: new Date() }).where(eq(user.id, s.user.id));
  }
  revalidatePath("/", "layout");
}
