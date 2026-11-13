/** Маскот — робот с градиентной рамкой «экрана». size — ширина в px. */
export function Robot({ size = 160, face = "^_^" }: { size?: number; face?: string }) {
  const s = size;
  return (
    <div className="flex flex-col items-center select-none" style={{ width: s }}>
      {/* Голова */}
      <div
        className="spectrum-border rounded-2xl"
        style={{ width: s, height: s * 0.82, borderRadius: s * 0.18 }}
      >
        <div
          className="w-full h-full flex items-center justify-center rounded-2xl bg-[#111114]"
          style={{ borderRadius: s * 0.16 }}
        >
          <span
            className="font-mono text-fg"
            style={{ fontSize: s * 0.2, letterSpacing: "0.05em" }}
          >
            {face}
          </span>
        </div>
      </div>
      {/* Шея и корпус */}
      <div className="bg-[#2a2a30]" style={{ width: s * 0.18, height: s * 0.08 }} />
      <div
        className="bg-[#1a1a1f] border border-line flex items-start justify-center"
        style={{
          width: s * 0.62,
          height: s * 0.3,
          borderRadius: `${s * 0.06}px ${s * 0.06}px ${s * 0.12}px ${s * 0.12}px`,
        }}
      >
        <div className="flex gap-1.5 mt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-ablue" />
          <span className="w-1.5 h-1.5 rounded-full bg-agreen" />
          <span className="w-1.5 h-1.5 rounded-full bg-aorange" />
        </div>
      </div>
    </div>
  );
}
