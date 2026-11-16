"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/schema";
import { requireSession } from "@/lib/session";

const ALLOWED = ["beginner", "intermediate", "advanced"];

/** Сохраняет уровень, определённый тестом, и возвращает в кабинет. */
export async function saveDifficulty(formData: FormData) {
  const s = await requireSession();
  const value = String(formData.get("difficulty"));
  if (!ALLOWED.includes(value)) return;
  await db
    .update(user)
    .set({ difficulty: value, updatedAt: new Date() })
    .where(eq(user.id, s.user.id));
  redirect("/dashboard");
}
