"use client";

import { useEffect, type RefObject } from "react";
import { clampGain, type FieldInput } from "@/lib/field";

export function useField(
  fieldRef: RefObject<FieldInput>,
  reduced: boolean,
  onGain?: (value: number) => void,
) {
  useEffect(() => {
    if (reduced) return;
    const field = fieldRef.current;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let frame = 0;

    const onMove = (event: PointerEvent) => {
      field.pointerX = event.clientX / window.innerWidth;
      field.pointerY = event.clientY / window.innerHeight;
      field.pointerLive = true;
      field.scatter = Math.min(1, field.scatter + 0.045);
    };
    const onLeave = () => {
      field.pointerLive = false;
    };
    const onScroll = () => {
      const now = performance.now();
      const dy = window.scrollY - lastY;
      const dt = Math.max(8, now - lastT);
      field.scrollVel = field.scrollVel * 0.6 + (dy / dt) * 18;
      field.scatter = Math.min(1, field.scatter + Math.min(0.35, Math.abs(dy) * 0.012));
      field.gain = clampGain(field.gain + dy * 0.00045);
      lastY = window.scrollY;
      lastT = now;
      if (!frame && onGain) {
        frame = window.requestAnimationFrame(() => {
          frame = 0;
          onGain(field.gain);
        });
      }
    };

    const tick = () => {
      field.scatter *= 0.94;
      field.scrollVel *= 0.9;
    };
    const id = window.setInterval(tick, 32);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearInterval(id);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [fieldRef, onGain, reduced]);
}
