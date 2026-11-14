export type RobotPose = "idle" | "wave" | "think" | "fly" | "jump";

/**
 * Маскот — робот с градиентной рамкой «экрана», руками и ногами на шарнирах.
 * size — ширина в px. pose — поза (покой, приветствие, раздумья, полёт, прыжок).
 * face — мимика: ^_^ радость, T_T грусть, ?_? раздумья, -_- скука, o_o удивление.
 */
export function Robot({
  size = 160,
  face = "^_^",
  animated = true,
  pose = "idle",
}: {
  size?: number;
  face?: string;
  animated?: boolean;
  pose?: RobotPose;
}) {
  const s = size;
  const H = s * 1.5; // общая высота с ногами и струями
  const poseCls = animated ? `rb-pose-${pose}` : "";

  return (
    <div
      className={`rb ${animated && pose !== "fly" ? "float" : ""} ${poseCls}`}
      style={{ width: s, height: H, position: "relative" }}
    >
      {/* Голова */}
      <div
        className="rb-head absolute"
        style={{ left: 0, top: 0, width: s, height: s * 0.82 }}
      >
        <div
          className="spectrum-border rounded-2xl w-full h-full"
          style={{ borderRadius: s * 0.18 }}
        >
          <div
            className="w-full h-full flex items-center justify-center rounded-2xl bg-[#111114]"
            style={{ borderRadius: s * 0.16 }}
          >
            <span
              className={`font-mono text-fg ${animated ? "robot-face" : ""}`}
              style={{ fontSize: s * 0.2, letterSpacing: "0.05em" }}
            >
              {face}
            </span>
          </div>
        </div>
      </div>

      {/* Шея */}
      <div
        className="absolute bg-[#2a2a30]"
        style={{ left: s * 0.41, top: s * 0.82, width: s * 0.18, height: s * 0.08 }}
      />

      {/* Корпус */}
      <div
        className="absolute bg-[#1a1a1f] border border-line flex items-start justify-center"
        style={{
          left: s * 0.19,
          top: s * 0.9,
          width: s * 0.62,
          height: s * 0.3,
          borderRadius: `${s * 0.06}px ${s * 0.06}px ${s * 0.12}px ${s * 0.12}px`,
        }}
      >
        <div className="flex gap-1.5 mt-2">
          <span className={`w-1.5 h-1.5 rounded-full bg-ablue ${animated ? "rb-led" : ""}`} />
          <span className={`w-1.5 h-1.5 rounded-full bg-agreen ${animated ? "rb-led rb-led-2" : ""}`} />
          <span className={`w-1.5 h-1.5 rounded-full bg-aorange ${animated ? "rb-led rb-led-3" : ""}`} />
        </div>
      </div>

      {/* Руки: шарнир — плечо (верх) */}
      <div
        className="rb-arm rb-arm-l absolute rounded-full bg-[#2a2a30] border border-line"
        style={{ left: s * 0.04, top: s * 0.95, width: s * 0.1, height: s * 0.36 }}
      />
      <div
        className="rb-arm rb-arm-r absolute rounded-full bg-[#2a2a30] border border-line"
        style={{ left: s * 0.86, top: s * 0.95, width: s * 0.1, height: s * 0.36 }}
      />

      {/* Ноги: шарнир — бедро (верх) */}
      <div
        className="rb-leg rb-leg-l absolute rounded-b-xl bg-[#1a1a1f] border border-line"
        style={{ left: s * 0.33, top: s * 1.2, width: s * 0.12, height: s * 0.26 }}
      />
      <div
        className="rb-leg rb-leg-r absolute rounded-b-xl bg-[#1a1a1f] border border-line"
        style={{ left: s * 0.55, top: s * 1.2, width: s * 0.12, height: s * 0.26 }}
      />

      {/* Реактивные струи под ногами (видны в полёте) */}
      <div
        className="rb-jet absolute rounded-b-full"
        style={{
          left: s * 0.36,
          top: s * 1.46,
          width: s * 0.28,
          height: s * 0.22,
          background: "linear-gradient(to bottom, #ffd23e, #ff8a3d 50%, transparent)",
          filter: "blur(2px)",
        }}
      />
    </div>
  );
}
