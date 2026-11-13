import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";

// ---------- better-auth ----------

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  // LinguaQuest
  plan: text("plan").notNull().default("free"), // free | pro
  difficulty: text("difficulty"), // beginner | intermediate | advanced (null до онбординга)
  xp: integer("xp").notNull().default(0),
  streakCount: integer("streak_count").notNull().default(0),
  lastCheckinAt: integer("last_checkin_at", { mode: "timestamp" }),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// ---------- Контент ----------

export const levels = sqliteTable("levels", {
  id: text("id").primaryKey(), // напр. "gen-01", "ege-01"
  track: text("track").notNull(), // general | ege | ielts
  orderIndex: integer("order_index").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull().default(""),
  difficulty: text("difficulty").notNull(), // beginner | intermediate | advanced
  theoryMd: text("theory_md").notNull(),
  cardId: text("card_id"),
});

export const exercises = sqliteTable("exercises", {
  id: text("id").primaryKey(), // напр. "gen-01-e1"
  levelId: text("level_id").notNull().references(() => levels.id, { onDelete: "cascade" }),
  orderIndex: integer("order_index").notNull(),
  // quiz | multi_quiz | gap_fill | word_order | translate | listening | speaking
  type: text("type").notNull(),
  skill: text("skill").notNull(), // grammar | vocabulary | listening | speaking | spelling
  prompt: text("prompt").notNull(),
  dataJson: text("data_json").notNull(), // варианты, слова, audioText и т.п.
  answerJson: text("answer_json").notNull(), // эталон (не отдаётся клиенту)
});

export const cards = sqliteTable("cards", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  emoji: text("emoji").notNull(),
  rarity: text("rarity").notNull(), // common | rare | epic | legendary
});

// ---------- Прогресс пользователя ----------

export const userProgress = sqliteTable(
  "user_progress",
  {
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    levelId: text("level_id").notNull().references(() => levels.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("available"), // available | completed
    bestScore: integer("best_score").notNull().default(0),
    attempts: integer("attempts").notNull().default(0),
    completedAt: integer("completed_at", { mode: "timestamp" }),
  },
  (t) => [primaryKey({ columns: [t.userId, t.levelId] })],
);

export const userAnswers = sqliteTable("user_answers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  levelId: text("level_id").notNull(),
  attemptNo: integer("attempt_no").notNull(),
  exerciseId: text("exercise_id").notNull(),
  givenJson: text("given_json").notNull(),
  isCorrect: integer("is_correct", { mode: "boolean" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const userCards = sqliteTable(
  "user_cards",
  {
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    cardId: text("card_id").notNull().references(() => cards.id, { onDelete: "cascade" }),
    earnedAt: integer("earned_at", { mode: "timestamp" }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.cardId] })],
);

export const usageLog = sqliteTable("usage_log", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  kind: text("kind").notNull(), // lesson_start | lesson_finish
  levelId: text("level_id").notNull(),
  minutesSpent: integer("minutes_spent").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const aiReviews = sqliteTable("ai_reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  levelId: text("level_id").notNull(),
  attemptNo: integer("attempt_no").notNull(),
  reviewJson: text("review_json").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});
