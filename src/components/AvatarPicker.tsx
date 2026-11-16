"use client";

import { useState } from "react";
import { AVATAR_PRESETS, isUploadedAvatar } from "@/lib/avatars";
import { Avatar } from "./Avatar";

/** Сжимает картинку до квадрата 128×128 и возвращает data-URL (маленький размер для базы). */
function fileToAvatar(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const size = 128;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("no canvas"));
      const s = Math.min(img.width, img.height);
      const sx = (img.width - s) / 2;
      const sy = (img.height - s) / 2;
      ctx.drawImage(img, sx, sy, s, s, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => reject(new Error("bad image"));
    img.src = url;
  });
}

export function AvatarPicker({ current, name }: { current: string | null; name: string }) {
  const [value, setValue] = useState(current ?? "");
  const [error, setError] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Нужен файл-картинка");
    if (file.size > 5 * 1024 * 1024) return setError("Файл больше 5 МБ");
    try {
      setError(null);
      setValue(await fileToAvatar(file));
    } catch {
      setError("Не удалось открыть картинку");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <input type="hidden" name="avatar" value={value} />
      <div className="flex items-center gap-4">
        <Avatar image={value || null} name={name} size={72} />
        <div className="flex flex-col gap-2 text-sm">
          <label className="btn-ghost h-9 px-4 inline-flex items-center cursor-pointer text-sm">
            Загрузить картинку
            <input type="file" accept="image/*" onChange={onFile} className="sr-only" />
          </label>
          <button
            type="button"
            onClick={() => setValue("")}
            className="text-left text-dim hover:text-fg text-xs underline underline-offset-4"
          >
            Убрать аватар
          </button>
          {isUploadedAvatar(value) && <span className="text-agreen text-xs">Картинка выбрана</span>}
          {error && <span className="text-ared text-xs">{error}</span>}
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {AVATAR_PRESETS.map((p) => {
          const id = `preset:${p.id}`;
          const active = value === id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setValue(id)}
              aria-label={p.id}
              className={`aspect-square rounded-full flex items-center justify-center text-xl transition-transform hover:scale-105 ${
                active ? "ring-2 ring-violet ring-offset-2 ring-offset-bg" : ""
              }`}
              style={{ background: p.bg }}
            >
              {p.emoji}
            </button>
          );
        })}
      </div>
    </div>
  );
}
