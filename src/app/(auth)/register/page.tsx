import { AuthForm } from "@/components/AuthForm";

export const metadata = { title: "Регистрация — 4 your learning" };

export default function RegisterPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mono-label mb-2">Регистрация</p>
        <h1 className="text-2xl font-semibold tracking-tight">Начнём учиться</h1>
      </div>
      <AuthForm mode="register" />
    </div>
  );
}
