export const BPM = 120;
export const BEAT_MS = 500;
export const BEAT_S = BEAT_MS / 1000;

export const beats = {
  load: 8,
  idle: 12,
  crisp: 8,
} as const;

export type HeroState = "load" | "idle" | "crisp";

export const STATES: HeroState[] = ["load", "idle", "crisp"];

export function nextState(state: HeroState): HeroState {
  return STATES[(STATES.indexOf(state) + 1) % STATES.length];
}
