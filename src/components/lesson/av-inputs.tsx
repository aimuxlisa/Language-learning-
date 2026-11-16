"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, Mic, Square } from "lucide-react";
import { QuizInput, TextInput } from "./inputs";

export function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}

/** Listening: прослушать фразу (TTS) и напечатать или выбрать вариант. */
export function ListeningInput({
  audioText,
  mode,
  options,
  value,
  onChange,
}: {
  audioText: string;
  mode?: string;
  options?: string[];
  value: string | number | null;
  onChange: (v: string | number) => void;
}) {
  const [supported, setSupported] = useState(true);
  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <button
        type="button"
        onClick={() => speak(audioText)}
        disabled={!supported}
        className="self-start flex items-center gap-2.5 px-5 h-11 spectrum-border text-sm font-medium hover:opacity-90 disabled:opacity-40 transition-opacity"
      >
        <Volume2 size={16} />
        Прослушать
      </button>
      {!supported && (
        <p className="text-aorange text-sm">
          Ваш браузер не поддерживает озвучивание. Текст фразы: «{audioText}»
        </p>
      )}
      {mode === "choice" && options ? (
        <QuizInput
          options={options}
          value={typeof value === "number" ? value : null}
          onChange={(v) => onChange(v as number)}
        />
      ) : (
        <TextInput
          value={typeof value === "string" ? value : ""}
          onChange={onChange}
          placeholder="Напечатайте, что услышали…"
        />
      )}
    </div>
  );
}

type SR = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: ((e: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: unknown) => void) | null;
};

function getRecognition(): SR | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SR;
    webkitSpeechRecognition?: new () => SR;
  };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  return Ctor ? new Ctor() : null;
}

/** Speaking: произнести фразу; распознанный текст идёт на оценку. */
export function SpeakingInput({
  text,
  value,
  onChange,
}: {
  text: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [recording, setRecording] = useState(false);
  const recRef = useRef<SR | null>(null);

  useEffect(() => {
    setSupported(getRecognition() !== null);
  }, []);

  function start() {
    const rec = getRecognition();
    if (!rec) return;
    recRef.current = rec;
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      const transcript = e.results[0]?.[0]?.transcript ?? "";
      onChange(transcript);
    };
    rec.onend = () => setRecording(false);
    rec.onerror = () => setRecording(false);
    setRecording(true);
    rec.start();
  }

  function stop() {
    recRef.current?.stop();
    setRecording(false);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-line bg-raised px-5 py-4">
        <p className="mono-label mb-2">Произнесите фразу</p>
        <p className="text-lg">{text}</p>
        <button
          type="button"
          onClick={() => speak(text)}
          className="mt-3 flex items-center gap-1.5 text-dim text-xs hover:text-fg transition-colors"
        >
          <Volume2 size={13} /> Как это звучит
        </button>
      </div>

      {supported === false ? (
        <div className="text-sm flex flex-col gap-3">
          <p className="text-aorange">
            Распознавание речи не поддерживается в этом браузере (попробуйте Chrome или Edge).
          </p>
          <button
            type="button"
            onClick={() => onChange("__skipped__")}
            className={`self-start px-4 h-9 rounded-full border text-sm transition-colors ${
              value === "__skipped__" ? "border-fg text-fg" : "border-line text-dim hover:text-fg"
            }`}
          >
            {value === "__skipped__" ? "Задание пропущено ✓" : "Пропустить без штрафа"}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={recording ? stop : start}
            className={`self-start flex items-center gap-2.5 px-5 h-11 text-sm font-medium transition-opacity ${
              recording ? "bg-ared text-bg animate-pulse" : "spectrum-border hover:opacity-90"
            }`}
          >
            {recording ? <Square size={15} /> : <Mic size={16} />}
            {recording ? "Говорите… (нажмите, чтобы закончить)" : "Записать"}
          </button>
          {value && value !== "__skipped__" && (
            <p className="text-sm">
              <span className="text-dim">Распознано: </span>«{value}»
              <button
                type="button"
                onClick={start}
                className="ml-3 text-dim underline underline-offset-4 hover:text-fg"
              >
                записать заново
              </button>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
