"use client";

import { useEffect, useRef, type RefObject } from "react";
import { createCrumbs, kickCrumbs } from "@/lib/crumbs";
import { createCrumbTile, createGrainTile, drawHero } from "@/lib/heroDraw";
import type { FieldInput } from "@/lib/field";
import type { HeroParams } from "@/lib/heroParams";
import { gsap } from "@/lib/gsap";

type HeroCanvasProps = {
  paramsRef: RefObject<HeroParams>;
  fieldRef: RefObject<FieldInput>;
  reduced: boolean;
};

export function HeroCanvas({ paramsRef, fieldRef, reduced }: HeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const textures = {
      fine: createGrainTile(),
      crumb: createCrumbTile(),
      crumbs: createCrumbs(),
    };
    kickCrumbs(textures.crumbs, 0.034);
    const shift = { x: 0, y: 0 };
    let width = 0;
    let height = 0;
    let last = performance.now();
    const start = last;
    let lastMode = fieldRef.current.mode;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const render = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const p = paramsRef.current;
      const field = fieldRef.current;
      if (field.mode !== lastMode) {
        if (field.mode === "load") kickCrumbs(textures.crumbs, 0.03);
        if (field.mode === "crisp") kickCrumbs(textures.crumbs, 0.05);
        lastMode = field.mode;
      }
      const time = (now - start) / 1000;
      if (!reduced) {
        shift.x = (time * 22) % textures.fine.width;
        shift.y = (time * 13) % textures.fine.height;
      }
      drawHero(
        ctx,
        width,
        height,
        p,
        time,
        dt,
        textures,
        shift,
        field,
        reduced,
        window.scrollY,
      );
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
  }, [fieldRef, paramsRef, reduced]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      aria-hidden
    />
  );
}
