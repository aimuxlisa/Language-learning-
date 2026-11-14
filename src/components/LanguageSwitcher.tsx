"use client";

type Option = { code: string; name: string; flag: string };

/** Переключатель активного языка в шапке. Отправляет форму при выборе. */
export function LanguageSwitcher({
  active,
  options,
  action,
}: {
  active: string;
  options: Option[];
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action}>
      <label className="flex items-center gap-2 text-[13px] text-dim">
        <span className="sr-only">Язык обучения</span>
        <select
          name="code"
          defaultValue={active}
          onChange={(e) => e.currentTarget.form?.requestSubmit()}
          className="h-9 rounded-full border border-line bg-raised px-3 text-[13px] text-fg outline-none focus:border-violet cursor-pointer"
        >
          {options.map((o) => (
            <option key={o.code} value={o.code}>
              {o.flag} {o.name}
            </option>
          ))}
        </select>
      </label>
    </form>
  );
}
