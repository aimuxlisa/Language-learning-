export type ExerciseType =
  | "quiz"
  | "multi_quiz"
  | "gap_fill"
  | "word_order"
  | "translate"
  | "listening"
  | "speaking";

export type Skill = "grammar" | "vocabulary" | "listening" | "speaking" | "spelling";

export type ExerciseDef = {
  type: ExerciseType;
  skill: Skill;
  prompt: string;
  /** Клиентские данные (варианты, слова, текст для TTS). Без ответов! */
  data: Record<string, unknown>;
  /** Эталон. На клиент не отдаётся до завершения. */
  answer: Record<string, unknown>;
};

export type LevelDef = {
  id: string;
  track: "general" | "ege" | "ielts";
  orderIndex: number;
  title: string;
  subtitle: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  cardId?: string;
  theoryMd: string;
  exercises: ExerciseDef[];
};

export type CardDef = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  rarity: "common" | "rare" | "epic" | "legendary";
};
