"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { createGrainTile, drawHero } from "@/lib/heroDraw";
import type { HeroParams } from "@/lib/heroParams";

type HeroCanvasProps = {
  paramsRef: RefObject<HeroParams>;
  reduced: boolean;
};

export function HeroCanvas({ paramsRef, reduced }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const grain = createGrainTile();
    const shift = { x: 0, y: 0 };
    let width = 0;
    let height = 0;
    let dpr = 1;
    const start = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const render = () => {
      const p = paramsRef.current;
      const time = (performance.now() - start) / 1000;
      if (!reduced) {
        shift.x = (time * 14) % grain.width;
        shift.y = (time * 9) % grain.height;
      }
      drawHero(ctx, width, height, p, time, grain, shift);
    };

    resize();
    render();

    const onResize = () => {
      resize();
      if (reduced) render();
    };
    window.addEventListener("resize", onResize);

    if (reduced) {
      return () => window.removeEventListener("resize", onResize);
    }

    const tick = () => render();
    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(tick);
    };
  }, [paramsRef, reduced]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
