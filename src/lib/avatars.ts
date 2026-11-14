/** Готовые аватарки. В профиле пользователь выбирает одну или загружает свою картинку. */
export const AVATAR_PRESETS = [
  { id: "fox", emoji: "🦊", bg: "#f97316" },
  { id: "panda", emoji: "🐼", bg: "#64748b" },
  { id: "owl", emoji: "🦉", bg: "#a16207" },
  { id: "frog", emoji: "🐸", bg: "#16a34a" },
  { id: "cat", emoji: "🐱", bg: "#db2777" },
  { id: "robot", emoji: "🤖", bg: "#7c5cff" },
  { id: "rocket", emoji: "🚀", bg: "#2563eb" },
  { id: "star", emoji: "⭐", bg: "#eab308" },
  { id: "book", emoji: "📚", bg: "#0d9488" },
  { id: "globe", emoji: "🌍", bg: "#0891b2" },
  { id: "dragon", emoji: "🐲", bg: "#dc2626" },
  { id: "ghost", emoji: "👻", bg: "#4b5563" },
];

export function presetById(id: string) {
  return AVATAR_PRESETS.find((p) => p.id === id) ?? null;
}

/** Значение аватара хранится в user.image: "preset:<id>", data-URL загруженной картинки или пусто. */
export function isUploadedAvatar(value: string | null | undefined): boolean {
  return !!value && value.startsWith("data:image/");
}

export const USERNAME_RE = /^[a-z0-9_]{3,20}$/;
