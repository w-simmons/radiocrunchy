import { colors } from "@/lib/brand";
import { drawCrumbs, stepCrumbs, type Crumb } from "@/lib/crumbs";
import type { FieldInput } from "@/lib/field";
import type { HeroParams } from "@/lib/heroParams";

export type HeroTextures = {
  fine: HTMLCanvasElement;
  crumb: HTMLCanvasElement;
  crumbs: Crumb[];
};

export function createGrainTile(size = 320) {
  const tile = document.createElement("canvas");
  tile.width = size;
  tile.height = size;
  const ctx = tile.getContext("2d", { willReadFrequently: true });
  if (!ctx) return tile;
  const image = ctx.createImageData(size, size);
  for (let i = 0; i < image.data.length; i += 4) {
    const n = Math.random();
    const fleck = n > 0.975 ? 255 : n * 200;
    image.data[i] = fleck;
    image.data[i + 1] = fleck * 0.86;
    image.data[i + 2] = fleck * 0.58;
    image.data[i + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);
  return tile;
}

export function createCrumbTile(size = 512) {
  const tile = document.createElement("canvas");
  tile.width = size;
  tile.height = size;
  const ctx = tile.getContext("2d");
  if (!ctx) return tile;
  ctx.clearRect(0, 0, size, size);
  for (let i = 0; i < 140; i += 1) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 0.4 + Math.random() * 2.6;
    const hot = Math.random();
    ctx.fillStyle = `rgba(${210 + hot * 35}, ${170 + hot * 40}, ${100 + hot * 40}, ${0.35 + Math.random() * 0.55})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  return tile;
}

function hash(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function envelope(t: number) {
  const radio = Math.exp(-((t - 0.3) ** 2) / (2 * 0.06 ** 2));
  const crunchy = Math.exp(-((t - 0.7) ** 2) / (2 * 0.07 ** 2));
  const left = Math.exp(-((t - 0.1) ** 2) / (2 * 0.036 ** 2)) * 0.48;
  const right = Math.exp(-((t - 0.9) ** 2) / (2 * 0.036 ** 2)) * 0.42;
  const valley = 1 - 0.12 * Math.exp(-((t - 0.5) ** 2) / (2 * 0.03 ** 2));
  return (0.22 + 0.78 * (radio * 0.94 + crunchy + left + right)) * valley;
}

function jag(i: number) {
  return 0.72 + 0.28 * (0.55 * hash(i) + 0.28 * hash(i * 2.17) + 0.17 * hash(i * 5.3));
}

function barScale(t: number, i: number, p: HeroParams, time: number, gain: number) {
  const env = envelope(t);
  const n1 = Math.sin(time * 2.35 + i * 0.37);
  const n2 = Math.sin(time * 3.85 + i * 0.19 + 1.7);
  const flicker = hash(i + Math.floor(time * (8 + p.heat * 22)));
  const live = 0.9 + 0.06 * n1 + 0.04 * n2 + (0.02 + p.heat * 0.08) * flicker;
  const waking =
    0.78 +
    0.22 * p.wake +
    (1 - p.wake) * (0.15 + 0.85 * hash(i * 9 + Math.floor(time * 22)));
  const beat = 1 + p.beat * (0.1 + p.heat * 0.22) + p.kick * 0.18;
  const radio = 0.38 + gain * 0.78;
  return p.amplitude * env * jag(i) * live * waking * beat * radio;
}

export function drawHero(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  p: HeroParams,
  time: number,
  dt: number,
  textures: HeroTextures,
  grainShift: { x: number; y: number },
  field: FieldInput,
  reduced: boolean,
  scrollY: number,
) {
  ctx.fillStyle = colors.ink;
  ctx.fillRect(0, 0, width, height);

  const gain = Math.min(1.15, Math.max(0.08, field.gain + field.scatter * 0.28));
  const heroFade = 1 - Math.min(1, Math.max(0, scrollY / (height * 0.88)));

  const cx = width * 0.5;
  const cy = height * 0.475;
  const span = Math.min(width * 0.9, 1240);
  const left = cx - span / 2;
  const count = Math.round(Math.min(156, Math.max(64, span / 7.1)));
  const step = span / count;
  const maxH = height * (0.2 + 0.16 * p.wake + 0.2 * p.heat + p.kick * 0.04 + gain * 0.06);

  ctx.save();
  ctx.globalAlpha = heroFade;
  ctx.globalCompositeOperation = "lighter";

  for (let i = 0; i < count; i += 1) {
    const t = i / (count - 1);
    const h = Math.max(1.1, barScale(t, i, p, time, gain) * maxH);
    const x = left + i * step + step * 0.5;
    const w = Math.max(1.35, step * (0.38 + p.heat * 0.16 + p.kick * 0.04 + gain * 0.06));
    const chip = (hash(i * 4.2) - 0.5) * 2.4;
    const hot = Math.min(1, p.heat * 0.7 + p.kick * 0.35 + p.wake * 0.1 + gain * 0.22);
    const pr = 196 + hot * 40;
    const pg = 165 + hot * 48;
    const pb = 116 + hot * 42;

    ctx.fillStyle = `rgba(${pr}, ${pg}, ${pb}, ${0.1 + p.heat * 0.2 + p.kick * 0.1 + gain * 0.06})`;
    ctx.fillRect(x - w * 2.2, cy - h * 1.08, w * 4.4, h * 2.16);

    const alpha = 0.42 + p.wake * 0.32 + p.heat * 0.22 + hash(i) * 0.1;
    ctx.fillStyle = `rgba(${pr}, ${pg}, ${pb}, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(x - w / 2, cy + h);
    ctx.lineTo(x - w / 2, cy - h + chip);
    ctx.lineTo(x + w / 2, cy - h - chip * 0.6);
    ctx.lineTo(x + w / 2, cy + h + chip * 0.35);
    ctx.closePath();
    ctx.fill();

    if (p.heat > 0.35 || p.kick > 0.4 || gain > 0.8) {
      const spark = 3 + hash(i + 4) * (7 + p.heat * 8);
      ctx.fillStyle = `rgba(244, 232, 196, ${0.1 + p.heat * 0.18 + p.kick * 0.12})`;
      ctx.fillRect(x - 0.7, cy - h - spark, 1.4, spark);
      ctx.fillRect(x - 0.7, cy + h, 1.4, spark * 0.75);
    }
  }

  ctx.restore();

  ctx.save();
  ctx.globalAlpha = (0.22 + p.wake * 0.2 + p.heat * 0.12) * heroFade;
  ctx.strokeStyle = colors.panko;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(left, cy);
  ctx.lineTo(left + span, cy);
  ctx.stroke();
  ctx.restore();

  if (p.needleAlpha > 0.02 && heroFade > 0.05) {
    const nx = left + p.needleX * span;
    const top = cy - maxH * 1.22;
    const bot = cy + maxH * 1.1;
    ctx.save();
    ctx.globalAlpha = p.needleAlpha * heroFade;
    ctx.strokeStyle = colors.pankoHot;
    ctx.fillStyle = colors.pankoHot;
    ctx.lineWidth = 1.35;
    ctx.shadowColor = colors.panko;
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.moveTo(nx, top);
    ctx.lineTo(nx, bot);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(nx, bot + 6, 3.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  stepCrumbs(textures.crumbs, dt, {
    gain,
    scatter: field.scatter,
    pointerX: field.pointerX,
    pointerY: field.pointerY,
    pointerLive: field.pointerLive,
    scrollVel: field.scrollVel,
    kick: p.kick,
    heat: p.heat,
    mode: field.mode,
    reduced,
  });
  drawCrumbs(ctx, textures.crumbs, width, height, {
    gain,
    scatter: field.scatter,
    pointerX: field.pointerX,
    pointerY: field.pointerY,
    pointerLive: field.pointerLive,
    scrollVel: field.scrollVel,
    kick: p.kick,
    heat: p.heat,
    mode: field.mode,
    reduced,
  });

  const fine = ctx.createPattern(textures.fine, "repeat");
  if (fine) {
    ctx.save();
    ctx.globalAlpha = 0.22 + p.grain * 0.34 + p.kick * 0.08 + gain * 0.08;
    ctx.globalCompositeOperation = "overlay";
    ctx.translate(grainShift.x, grainShift.y);
    ctx.fillStyle = fine;
    ctx.fillRect(-grainShift.x, -grainShift.y, width, height);
    ctx.restore();
  }

  const crumbs = ctx.createPattern(textures.crumb, "repeat");
  if (crumbs) {
    ctx.save();
    ctx.globalAlpha = 0.16 + p.grain * 0.28 + p.heat * 0.08 + gain * 0.06;
    ctx.globalCompositeOperation = "screen";
    ctx.translate(-grainShift.x * 0.6, grainShift.y * 0.8);
    ctx.fillStyle = crumbs;
    ctx.fillRect(grainShift.x * 0.6, -grainShift.y * 0.8, width, height);
    ctx.restore();
  }

  if ((p.kick > 0.04 || p.slam > 0.04) && heroFade > 0.1) {
    const flash = Math.max(p.kick, p.slam);
    const band = ctx.createLinearGradient(0, cy - maxH * 1.6, 0, cy + maxH * 1.6);
    band.addColorStop(0, "rgba(196,165,116,0)");
    band.addColorStop(0.5, `rgba(232,210,150,${(0.07 + flash * 0.16) * heroFade})`);
    band.addColorStop(1, "rgba(196,165,116,0)");
    ctx.fillStyle = band;
    ctx.fillRect(0, cy - maxH * 1.6, width, maxH * 3.2);
  }

  const vig = ctx.createRadialGradient(cx, cy, width * 0.1, cx, cy, width * 0.78);
  vig.addColorStop(0, "rgba(11,11,12,0)");
  vig.addColorStop(0.55, "rgba(11,11,12,0.12)");
  vig.addColorStop(1, "rgba(11,11,12,0.72)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, width, height);
}
