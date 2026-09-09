import type { HeroState } from "@/lib/motion";

export type FieldInput = {
  gain: number;
  scatter: number;
  pointerX: number;
  pointerY: number;
  pointerLive: boolean;
  scrollVel: number;
  mode: HeroState;
};

export function createField(): FieldInput {
  return {
    gain: 0.62,
    scatter: 0,
    pointerX: 0.5,
    pointerY: 0.45,
    pointerLive: false,
    scrollVel: 0,
    mode: "load",
  };
}

export function clampGain(value: number) {
  return Math.min(1, Math.max(0.08, value));
}
