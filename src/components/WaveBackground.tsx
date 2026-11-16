"use client";

import { useEffect, useRef } from "react";

/**
 * Фон сайта: поле светящихся частиц, которые складываются в плавные волны (как в референсе).
 * Цвет частиц берётся из --wave-rgb, поэтому работает и в светлой, и в тёмной теме.
 */
export function WaveBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ROWS = 26;
    let w = 0;
    let h = 0;
    let cols = 60;
    let t = 0;
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.max(40, Math.min(110, Math.floor(w / 12)));
    };

    const draw = () => {
      const rgb = getComputedStyle(document.documentElement).getPropertyValue("--wave-rgb").trim() || "150,170,255";
      ctx.clearRect(0, 0, w, h);

      for (let r = 0; r < ROWS; r++) {
        const z = r / (ROWS - 1); // 0 — дальний ряд, 1 — ближний
        const baseY = h * 0.3 + Math.pow(z, 1.6) * h * 0.72;
        const amp = 14 + z * 120;
        const size = 0.8 + z * 2.2;
        const alpha = 0.2 + z * 0.8;
        ctx.fillStyle = `rgba(${rgb},${alpha})`;

        for (let c = 0; c < cols; c++) {
          const u = c / (cols - 1);
          const x = u * w * 1.1 - w * 0.05;
          const wave =
            Math.sin(u * 7 + t * 1.2 + r * 0.32) * 0.6 +
            Math.sin(u * 3.1 - t * 0.7 + r * 0.18) * 0.4;
          const y = baseY - wave * amp;
          ctx.fillRect(x, y, size, size);
        }
      }
      if (!reduce) t += 0.006;
    };

    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);
    if (reduce) draw();
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 w-full h-full z-0"
    />
  );
}
