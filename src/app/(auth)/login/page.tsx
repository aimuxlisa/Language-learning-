import { AuthForm } from "@/components/AuthForm";

export const metadata = { title: "Вход — 4 your learning" };

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="mono-label mb-2">Вход</p>
        <h1 className="text-2xl font-semibold tracking-tight">С возвращением</h1>
      </div>
      <AuthForm mode="login" />
    </div>
  );
}
