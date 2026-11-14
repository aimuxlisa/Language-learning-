/**
 * Подключение аналитики Plausible (без cookie). Включается только если задан
 * NEXT_PUBLIC_PLAUSIBLE_DOMAIN, например "4yourlearning.ru". Без переменной ничего не грузится.
 */
export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;
  return (
    <script defer data-domain={domain} src="https://plausible.io/js/script.js" />
  );
}
