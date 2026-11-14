/** Декоративная полоса «свечей» (как график в референсе). Чистый CSS, без клиентского JS. */
export function CandleStrip({ count = 42 }: { count?: number }) {
  const bars = Array.from({ length: count }, (_, i) => ({
    h: 40 + ((i * 53) % 70),
    up: i % 3 !== 0,
    d: `${((i * 0.17) % 2.4).toFixed(2)}s`,
  }));

  return (
    <div className="flex items-end justify-between gap-2.5 h-32 w-full px-2" aria-hidden="true">
      {bars.map((b, i) => (
        <span
          key={i}
          className={`candle ${b.up ? "candle-up" : "candle-down"}`}
          style={{ "--h": b.h, "--d": b.d } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
