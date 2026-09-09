import { colors } from "@/lib/brand";

export type HeroParams = {
  amplitude: number;
  heat: number;
  wake: number;
  grain: number;
  blur: number;
  chrome: number;
  typeDim: number;
  needleX: number;
  needleAlpha: number;
  beat: number;
  kick: number;
  slam: number;
  split: number;
  gain: number;
};

export type HeroStateName = "load" | "idle" | "crisp";

export const STATE_TARGETS: Record<
  HeroStateName,
  Omit<HeroParams, "beat" | "needleX" | "kick" | "slam" | "gain">
> = {
  load: {
    amplitude: 0.2,
    heat: 0.1,
    wake: 0.2,
    grain: 0.98,
    blur: 18,
    chrome: 0,
    typeDim: 1,
    needleAlpha: 0,
    split: 0.15,
  },
  idle: {
    amplitude: 1.04,
    heat: 0.48,
    wake: 1,
    grain: 0.82,
    blur: 0,
    chrome: 1,
    typeDim: 0,
    needleAlpha: 0,
    split: 0.22,
  },
  crisp: {
    amplitude: 1.46,
    heat: 1,
    wake: 1,
    grain: 1.2,
    blur: 0,
    chrome: 1,
    typeDim: 0,
    needleAlpha: 1,
    split: 0.55,
  },
};

export function createHeroParams(): HeroParams {
  return {
    ...STATE_TARGETS.load,
    needleX: 0.12,
    beat: 0,
    kick: 0,
    slam: 0,
    gain: 0.62,
  };
}

export function mixHex(a: string, b: string, t: number) {
  const pa = hexToRgb(a);
  const pb = hexToRgb(b);
  const m = (x: number, y: number) => Math.round(x + (y - x) * t);
  return `rgb(${m(pa.r, pb.r)} ${m(pa.g, pb.g)} ${m(pa.b, pb.b)})`;
}

function hexToRgb(hex: string) {
  const n = hex.replace("#", "");
  return {
    r: parseInt(n.slice(0, 2), 16),
    g: parseInt(n.slice(2, 4), 16),
    b: parseInt(n.slice(4, 6), 16),
  };
}

export const riceMix = (dim: number) => mixHex(colors.rice, colors.riceDim, dim);
