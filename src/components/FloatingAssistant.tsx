"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Robot, type RobotPose } from "./Robot";

/** Мимика, которую робот меняет сам, когда ничего не происходит. */
const MOODS = ["^_^", "o_o", "-_-", "^_^", "^_^", "o_o"];

type Msg = { role: "user" | "assistant"; content: string };

/**
 * Плавающий робот-ассистент в правом нижнем углу. По клику открывается чат.
 * Не закрывает контент: панель открывается поверх только по нажатию.
 */
export function FloatingAssistant() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Привет! Я помогу с грамматикой, словами и вопросами о сайте." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const [mood, setMood] = useState(0);

  // Мимика меняется сама каждые 2.8 сек, пока ассистент не занят
  useEffect(() => {
    if (busy) return;
    const id = setInterval(() => setMood((m) => (m + 1) % MOODS.length), 2800);
    return () => clearInterval(id);
  }, [busy]);

  const face = busy ? "?_?" : MOODS[mood];
  const pose: RobotPose = busy ? "think" : open ? "wave" : "fly";

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(1) }),
      });
      if (res.status === 401) {
        setMessages((m) => [...m, { role: "assistant", content: "Войдите в аккаунт, чтобы пользоваться ассистентом." }]);
      } else {
        const data = (await res.json()) as { reply?: string };
        setMessages((m) => [...m, { role: "assistant", content: data.reply ?? "Нет ответа." }]);
      }
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Нет связи с сервером. Попробуйте ещё раз." }]);
    } finally {
      setBusy(false);
    }
  }

  // На главной робот уже есть в hero-блоке, поэтому плавающего здесь не показываем
  if (pathname === "/") return null;

  return (
    <div className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <section
          role="dialog"
          aria-label="Ассистент"
          className="card-solid w-[min(92vw,340px)] h-[min(70vh,460px)] rounded-2xl border flex flex-col overflow-hidden shadow-2xl"
        >
          <header className="flex items-center justify-between px-4 py-3 border-b border-line">
            <span className="font-medium text-sm">Ассистент</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs underline underline-offset-4 hover:opacity-80"
            >
              Свернуть
            </button>
          </header>

          <div ref={listRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  m.role === "user" ? "self-end bg-violet text-white" : "self-start border border-line"
                }`}
              >
                {m.content.replace(/\*\*/g, "")}
              </div>
            ))}
            {busy && <div className="self-start text-xs opacity-70">Печатаю…</div>}
          </div>

          <form onSubmit={send} className="p-3 border-t border-line flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Спросите что-нибудь…"
              maxLength={1000}
              className="input flex-1 min-w-0"
            />
            <button type="submit" disabled={busy || !input.trim()} className="btn-violet h-11 px-4 text-sm font-medium disabled:opacity-40">
              →
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Закрыть ассистента" : "Открыть ассистента"}
        className={`hover:scale-105 transition-transform ${open ? "" : "assistant-drift"}`}
      >
        <Robot size={68} face={face} pose={pose} />
      </button>
    </div>
  );
}
