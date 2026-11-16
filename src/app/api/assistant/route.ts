import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { allowAi } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const MODEL = "claude-haiku-5-5";
/** Модели Gemini по порядку: если первая занята (503) или недоступна (404), пробуем следующую. */
const GEMINI_MODELS = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-flash-lite-latest"];
const MAX_MESSAGES = 12;
const MAX_CHARS = 1000;

const SYSTEM =
  "Ты — ассистент сайта «4 your learning» (изучение языков). Помогаешь пользователю: объясняешь " +
  "грамматику и слова, отвечаешь на вопросы о сайте (уроки, лиги, карточки, профиль, языки). " +
  "Отвечай по-русски, коротко и дружелюбно. Если вопрос не про языки или сайт, мягко верни разговор к учёбе.";

type Incoming = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "auth" }, { status: 401 });
  }

  let body: { messages?: Incoming[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const messages = (body.messages ?? [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const hasGemini = !!process.env.GEMINI_API_KEY;
  const hasClaude = !!process.env.ANTHROPIC_API_KEY;
  if (!hasGemini && !hasClaude) {
    return NextResponse.json({
      reply:
        "Ассистент пока не подключён: администратору нужно добавить ключ GEMINI_API_KEY. Всё остальное на сайте работает.",
    });
  }

  if (!allowAi(session.user.id)) {
    return NextResponse.json({
      reply: "Вы задали много вопросов за час. Попробуйте чуть позже.",
    });
  }

  try {
    const reply = hasGemini ? await askGemini(messages) : await askClaude(messages);
    return NextResponse.json({ reply: reply || "Не получилось ответить, попробуйте ещё раз." });
  } catch {
    return NextResponse.json({ reply: "Ассистент временно недоступен. Попробуйте позже." });
  }
}

/** Gemini: ключ передаётся заголовком, а не в URL, чтобы не попадал в логи. */
async function askGemini(messages: Incoming[]): Promise<string> {
  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: SYSTEM }] },
    contents: messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    generationConfig: { maxOutputTokens: 600 },
  });

  let lastStatus = 0;
  for (const model of GEMINI_MODELS) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY ?? "",
        },
        body,
      },
    );
    if (res.ok) {
      const data = (await res.json()) as {
        candidates?: { content?: { parts?: { text?: string }[] } }[];
      };
      return (data.candidates?.[0]?.content?.parts ?? []).map((p) => p.text ?? "").join("").trim();
    }
    lastStatus = res.status;
    // Пробуем следующую модель только если эта занята или не найдена
    if (res.status !== 503 && res.status !== 404 && res.status !== 429) break;
  }
  throw new Error(`gemini ${lastStatus}`);
}

async function askClaude(messages: Incoming[]): Promise<string> {
  const client = new Anthropic();
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 500,
    system: SYSTEM,
    messages,
  });
  return res.content[0]?.type === "text" ? res.content[0].text : "";
}
