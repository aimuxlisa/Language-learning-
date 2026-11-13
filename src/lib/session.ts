import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** Для защищённых страниц: редиректит на /login, если нет сессии. */
export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}
