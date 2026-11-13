// Простой in-memory лимитер AI-вызовов на пользователя (на инстанс сервера).
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 30;

const hits = new Map<string, number[]>();

/** true — можно вызывать AI; false — лимит, использовать фолбэк. */
export function allowAi(userId: string): boolean {
  const now = Date.now();
  const list = (hits.get(userId) ?? []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= MAX_PER_WINDOW) {
    hits.set(userId, list);
    return false;
  }
  list.push(now);
  hits.set(userId, list);
  return true;
}
