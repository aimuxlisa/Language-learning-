import { evaluateFree } from "./ai";

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/['’]/g, "'")
    .replace(/[.,!?;:"«»()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export type GradeResult = {
  isCorrect: boolean;
  /** Эталон в читаемом виде — для разбора ошибок. */
  reference: string;
  /** Фидбек AI (для translate/speaking). */
  feedback?: string;
};

type Answer = Record<string, unknown>;

/**
 * Проверяет ответ пользователя на упражнение.
 * value: для quiz — number; multi_quiz — number[]; текстовые — string.
 */
export async function gradeExercise(
  type: string,
  prompt: string,
  data: Answer,
  answer: Answer,
  value: unknown,
  userId?: string,
): Promise<GradeResult> {
  switch (type) {
    case "quiz": {
      const idx = answer.index as number;
      const options = (data.options as string[]) ?? [];
      return { isCorrect: value === idx, reference: options[idx] ?? String(idx) };
    }
    case "multi_quiz": {
      const expected = [...((answer.indices as number[]) ?? [])].sort();
      const got = Array.isArray(value) ? [...(value as number[])].sort() : [];
      const options = (data.options as string[]) ?? [];
      return {
        isCorrect: JSON.stringify(expected) === JSON.stringify(got),
        reference: expected.map((i) => options[i] ?? i).join(", "),
      };
    }
    case "gap_fill": {
      const accept = (answer.accept as string[]) ?? [];
      const given = normalize(String(value ?? ""));
      return {
        isCorrect: accept.some((a) => normalize(a) === given),
        reference: accept[0] ?? "",
      };
    }
    case "word_order": {
      const expected = answer.sentence as string;
      return {
        isCorrect: normalize(String(value ?? "")) === normalize(expected),
        reference: expected,
      };
    }
    case "listening": {
      if (data.mode === "choice") {
        const idx = answer.index as number;
        const options = (data.options as string[]) ?? [];
        return { isCorrect: value === idx, reference: options[idx] ?? String(idx) };
      }
      const accept = (answer.accept as string[]) ?? [];
      const given = normalize(String(value ?? ""));
      return {
        isCorrect: accept.some((a) => normalize(a) === given),
        reference: accept[0] ?? "",
      };
    }
    case "translate":
    case "speaking": {
      const reference = (answer.reference as string) ?? "";
      const given = String(value ?? "").trim();
      // Пропущенное speaking-задание (браузер без поддержки) не считается ошибкой
      if (type === "speaking" && given === "__skipped__") {
        return { isCorrect: true, reference, feedback: "Пропущено: браузер не поддерживает распознавание речи." };
      }
      if (!given) return { isCorrect: false, reference };
      // Точное совпадение — без вызова AI
      if (normalize(given) === normalize(reference)) {
        return { isCorrect: true, reference };
      }
      const evaluation = await evaluateFree(
        type === "translate" ? "translation" : "speaking",
        prompt,
        reference,
        given,
        userId,
      );
      return {
        isCorrect: evaluation.score >= 60,
        reference,
        feedback: evaluation.feedback,
      };
    }
    default:
      return { isCorrect: false, reference: "" };
  }
}
