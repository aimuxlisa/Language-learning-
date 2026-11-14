"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result =
      mode === "register"
        ? await authClient.signUp.email({ name, email, password })
        : await authClient.signIn.email({ email, password });
    setLoading(false);
    if (result.error) {
      setError(
        result.error.message === "Invalid email or password"
          ? "Неверный email или пароль"
          : result.error.message ?? "Что-то пошло не так, попробуйте ещё раз",
      );
      return;
    }
    router.push(mode === "register" ? "/onboarding" : "/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      {mode === "register" && (
        <Field label="Имя">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            placeholder="Как вас называть"
            autoComplete="name"
          />
        </Field>
      )}
      <Field label="Email">
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          placeholder="you@example.com"
          autoComplete="email"
        />
      </Field>
      <Field label="Пароль">
        <input
          required
          type="password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          placeholder="Минимум 8 символов"
          autoComplete={mode === "register" ? "new-password" : "current-password"}
        />
      </Field>

      {error && (
        <p className="text-ared text-sm border border-ared/40 bg-ared/5 rounded-xl px-3 py-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-violet h-12 font-medium text-sm tracking-wide disabled:opacity-50"
      >
        {loading ? "…" : mode === "register" ? "Создать аккаунт" : "Войти"}
      </button>

      <p className="text-dim text-sm text-center">
        {mode === "register" ? (
          <>
            Уже есть аккаунт?{" "}
            <Link href="/login" className="text-fg underline underline-offset-4">
              Войти
            </Link>
          </>
        ) : (
          <>
            Нет аккаунта?{" "}
            <Link href="/register" className="text-fg underline underline-offset-4">
              Зарегистрироваться
            </Link>
          </>
        )}
      </p>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="mono-label">{label}</span>
      {children}
    </label>
  );
}
