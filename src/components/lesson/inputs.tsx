"use client";

// Простые типы упражнений: quiz, multi_quiz, gap_fill, word_order, translate

export function QuizInput({
  options,
  value,
  onChange,
  multi,
}: {
  options: string[];
  value: number | number[] | null;
  onChange: (v: number | number[]) => void;
  multi?: boolean;
}) {
  const selected = multi
    ? new Set(Array.isArray(value) ? value : [])
    : new Set(typeof value === "number" ? [value] : []);
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt, i) => {
        const active = selected.has(i);
        return (
          <button
            key={i}
            type="button"
            onClick={() => {
              if (multi) {
                const next = new Set(selected);
                if (next.has(i)) next.delete(i);
                else next.add(i);
                onChange([...next].sort());
              } else {
                onChange(i);
              }
            }}
            className={`text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
              active
                ? "border-violet bg-raised text-fg"
                : "border-line text-dim hover:border-violet hover:text-fg"
            }`}
          >
            <span className="font-mono text-xs mr-3 text-faint">
              {String.fromCharCode(65 + i)}
            </span>
            {opt}
          </button>
        );
      })}
      {multi && <p className="text-faint text-xs mt-1">Можно выбрать несколько вариантов</p>}
    </div>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  multiline,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Введите ответ…"}
        rows={3}
        className="input !h-auto py-3 resize-none w-full"
      />
    );
  }
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? "Введите ответ…"}
      className="input w-full"
      autoCapitalize="off"
      autoCorrect="off"
      spellCheck={false}
    />
  );
}

export function WordOrderInput({
  words,
  value,
  onChange,
}: {
  words: string[];
  value: number[]; // индексы выбранных слов по порядку
  onChange: (v: number[]) => void;
}) {
  const used = new Set(value);
  return (
    <div className="flex flex-col gap-4">
      <div className="min-h-13 rounded-xl border border-line bg-raised px-3 py-2.5 flex flex-wrap gap-2 items-center">
        {value.length === 0 && (
          <span className="text-faint text-sm">Нажимайте на слова ниже…</span>
        )}
        {value.map((wi, pos) => (
          <button
            key={pos}
            type="button"
            onClick={() => onChange(value.filter((_, p) => p !== pos))}
            className="px-3 py-1 rounded-full bg-violet text-white text-sm hover:opacity-80 transition-opacity"
          >
            {words[wi]}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {words.map((w, i) => (
          <button
            key={i}
            type="button"
            disabled={used.has(i)}
            onClick={() => onChange([...value, i])}
            className="px-3 py-1 rounded-full border border-line text-sm text-dim hover:text-fg hover:border-violet disabled:opacity-25 transition-colors"
          >
            {w}
          </button>
        ))}
      </div>
    </div>
  );
}
