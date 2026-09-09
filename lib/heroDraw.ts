import { colors } from "@/lib/brand";
import type { HeroParams } from "@/lib/heroParams";

export function createGrainTile(size = 256) {
  const tile = document.createElement("canvas");
  tile.width = size;
  tile.height = size;
  const ctx = tile.getContext("2d", { willReadFrequently: true });
  if (!ctx) return tile;
  const image = ctx.createImageData(size, size);
  for (let i = 0; i < image.data.length; i += 4) {
    const n = Math.random() * 255;
    image.data[i] = n;
    image.data[i + 1] = n * 0.9;
    image.data[i + 2] = n * 0.72;
    image.data[i + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);
  return tile;
}

function hash(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function envelope(t: number) {
  const radio = Math.exp(-((t - 0.3) ** 2) / (2 * 0.062 ** 2));
  const crunchy = Math.exp(-((t - 0.7) ** 2) / (2 * 0.072 ** 2));
  const left = Math.exp(-((t - 0.1) ** 2) / (2 * 0.038 ** 2)) * 0.4;
  const right = Math.exp(-((t - 0.9) ** 2) / (2 * 0.038 ** 2)) * 0.36;
  const valley = 1 - 0.16 * Math.exp(-((t - 0.5) ** 2) / (2 * 0.032 ** 2));
  return (0.14 + 0.86 * (radio * 0.92 + crunchy + left + right)) * valley;
}

function jag(i: number) {
  return 0.52 + 0.48 * (0.55 * hash(i) + 0.28 * hash(i * 2.17) + 0.17 * hash(i * 5.3));
}

function barScale(t: number, i: number, p: HeroParams, time: number) {
  const env = envelope(t);
  const n1 = Math.sin(time * 2.35 + i * 0.37);
  const n2 = Math.sin(time * 3.85 + i * 0.19 + 1.7);
  const flicker = hash(i + Math.floor(time * (6 + p.heat * 18)));
  const live = 0.78 + 0.12 * n1 + 0.07 * n2 + (0.03 + p.heat * 0.1) * flicker;
  const waking = 0.7 + 0.3 * p.wake + (1 - p.wake) * (0.2 + 0.8 * hash(i * 9 + Math.floor(time * 20)));
  const beat = 1 + p.beat * (0.07 + p.heat * 0.18);
  return p.amplitude * env * jag(i) * live * waking * beat;
}

export function drawHero(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  p: HeroParams,
  time: number,
  grain: HTMLCanvasElement,
  grainShift: { x: number; y: number },
) {
  ctx.fillStyle = colors.ink;
  ctx.fillRect(0, 0, width, height);

  const cx = width * 0.5;
  const cy = height * 0.475;
  const span = Math.min(width * 0.88, 1180);
  const left = cx - span / 2;
  const count = Math.round(Math.min(176, Math.max(68, span / 6.2)));
  const step = span / count;
  const maxH = height * (0.14 + 0.2 * p.wake + 0.2 * p.heat);

  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  for (let i = 0; i < count; i += 1) {
    const t = i / (count - 1);
    const h = Math.max(0.6, barScale(t, i, p, time) * maxH);
    const x = left + i * step + step * 0.5;
    const w = Math.max(1, step * (0.26 + p.heat * 0.1));
    const glow = 0.05 + p.heat * 0.14 + p.wake * 0.04;
    ctx.fillStyle = `rgba(196, 165, 116, ${glow})`;
    ctx.fillRect(x - w * 1.7, cy - h * 1.04, w * 3.4, h * 2.08);

    const alpha = 0.28 + p.wake * 0.38 + p.heat * 0.22 + hash(i) * 0.12;
    ctx.fillStyle = `rgba(196, 165, 116, ${alpha})`;
    ctx.fillRect(x - w / 2, cy - h, w, h * 2);

    if (p.heat > 0.55 && hash(i * 3.3 + Math.floor(time * 10)) > 0.72) {
      const spark = 2 + hash(i + 4) * 5;
      ctx.fillStyle = `rgba(244, 240, 232, ${0.08 + p.heat * 0.12})`;
      ctx.fillRect(x - 0.6, cy - h - spark, 1.2, spark);
      ctx.fillRect(x - 0.6, cy + h, 1.2, spark * 0.7);
    }
  }

  ctx.restore();

  if (p.needleAlpha > 0.02) {
    const nx = left + p.needleX * span;
    const top = cy - maxH * 1.18;
    const bot = cy + maxH * 1.06;
    ctx.save();
    ctx.globalAlpha = p.needleAlpha;
    ctx.strokeStyle = colors.panko;
    ctx.fillStyle = colors.panko;
    ctx.lineWidth = 1.15;
    ctx.shadowColor = colors.panko;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(nx, top);
    ctx.lineTo(nx, bot);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(nx, bot + 5, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const pattern = ctx.createPattern(grain, "repeat");
  if (pattern) {
    ctx.save();
    ctx.globalAlpha = 0.12 + p.grain * 0.28;
    ctx.globalCompositeOperation = "overlay";
    ctx.translate(grainShift.x, grainShift.y);
    ctx.fillStyle = pattern;
    ctx.fillRect(-grainShift.x, -grainShift.y, width, height);
    ctx.restore();
  }

  const vig = ctx.createRadialGradient(cx, cy, width * 0.12, cx, cy, width * 0.72);
  vig.addColorStop(0, "rgba(11,11,12,0)");
  vig.addColorStop(1, "rgba(11,11,12,0.58)");
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, width, height);
}
