import Anthropic from "@anthropic-ai/sdk";
import { allowAi } from "./rate-limit";

const MODEL = "claude-haiku-5-5";

function client(userId?: string): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (userId && !allowAi(userId)) return null;
  return new Anthropic();
}

const SYSTEM =
  "Ты — доброжелательный репетитор английского языка для русскоязычных учеников. " +
  "Отвечай по-русски, кратко и по делу. Отвечай ТОЛЬКО валидным JSON без markdown.";

function extractJson<T>(text: string): T | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]) as T;
  } catch {
    return null;
  }
}

/** Похожесть двух фраз по пересечению слов (фолбэк без API-ключа). */
export function tokenSimilarity(a: string, b: string): number {
  const norm = (s: string) =>
    s.toLowerCase().replace(/[^a-zа-яё0-9\s']/gi, "").split(/\s+/).filter(Boolean);
  const ta = norm(a);
  const tb = new Set(norm(b));
  if (ta.length === 0 || tb.size === 0) return 0;
  const hits = ta.filter((w) => tb.has(w)).length;
  return hits / Math.max(ta.length, tb.size);
}

export type Evaluation = { score: number; feedback: string };

/** Оценка свободного ответа (перевод или speaking) против эталона. 0–100. */
export async function evaluateFree(
  kind: "translation" | "speaking",
  taskPrompt: string,
  reference: string,
  given: string,
  userId?: string,
): Promise<Evaluation> {
  const c = client(userId);
  if (!c) {
    const sim = tokenSimilarity(reference, given);
    return {
      score: Math.round(sim * 100),
      feedback:
        sim >= 0.6
          ? "Принято (автопроверка по совпадению с эталоном)."
          : `Ответ отличается от эталона: «${reference}».`,
    };
  }
  try {
    const res = await c.messages.create({
      model: MODEL,
      max_tokens: 300,
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content:
            `Задание (${kind === "translation" ? "перевод" : "устная фраза, распознанная из речи"}): ${taskPrompt}\n` +
            `Эталонный ответ: "${reference}"\n` +
            `Ответ ученика: "${given}"\n\n` +
            `Оцени по смыслу и грамматике (в speaking игнорируй пунктуацию и регистр — это текст из распознавания речи). ` +
            `Верни JSON: {"score": число 0-100, "feedback": "короткое объяснение по-русски, 1-2 предложения"}`,
        },
      ],
    });
    const text = res.content[0].type === "text" ? res.content[0].text : "";
    const parsed = extractJson<Evaluation>(text);
    if (parsed && typeof parsed.score === "number") {
      return { score: Math.max(0, Math.min(100, parsed.score)), feedback: parsed.feedback ?? "" };
    }
  } catch {
    // падаем в фолбэк
  }
  const sim = tokenSimilarity(reference, given);
  return { score: Math.round(sim * 100), feedback: `Эталон: «${reference}».` };
}

export type ReviewItem = {
  exerciseId: string;
  explanation: string;
};

/** Разбор ошибок урока. */
export async function reviewMistakes(
  mistakes: { exerciseId: string; prompt: string; reference: string; given: string }[],
  userId?: string,
): Promise<ReviewItem[]> {
  if (mistakes.length === 0) return [];
  const c = client(userId);
  if (!c) {
    return mistakes.map((m) => ({
      exerciseId: m.exerciseId,
      explanation: `Правильный ответ: «${m.reference}». Сравните со своим ответом «${m.given}» и перечитайте теорию урока.`,
    }));
  }
  try {
    const res = await c.messages.create({
      model: MODEL,
      max_tokens: 1200,
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content:
            `Ученик ошибся в этих заданиях:\n` +
            mistakes
              .map(
                (m, i) =>
                  `${i + 1}. id="${m.exerciseId}" Задание: ${m.prompt} | Правильно: "${m.reference}" | Ответ ученика: "${m.given}"`,
              )
              .join("\n") +
            `\n\nДля каждого объясни по-русски, почему правильный ответ такой и какое правило нужно запомнить (2-3 предложения). ` +
            `Верни JSON: {"items":[{"exerciseId":"...","explanation":"..."}]}`,
        },
      ],
    });
    const text = res.content[0].type === "text" ? res.content[0].text : "";
    const parsed = extractJson<{ items: ReviewItem[] }>(text);
    if (parsed?.items?.length) return parsed.items;
  } catch {
    // фолбэк ниже
  }
  return mistakes.map((m) => ({
    exerciseId: m.exerciseId,
    explanation: `Правильный ответ: «${m.reference}».`,
  }));
}
