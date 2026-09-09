export type Crumb = {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  tilt: number;
  vt: number;
  w: number;
  h: number;
  gold: number;
  homeX: number;
  homeY: number;
};

export type CrumbField = {
  gain: number;
  scatter: number;
  pointerX: number;
  pointerY: number;
  pointerLive: boolean;
  scrollVel: number;
  kick: number;
  heat: number;
  mode: "load" | "idle" | "crisp";
  reduced: boolean;
};

function hash(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function createCrumbs(count = 280): Crumb[] {
  return Array.from({ length: count }, (_, i) => {
    const homeX = 0.04 + hash(i * 3.17) * 0.92;
    const homeY = 0.04 + hash(i * 8.91) * 0.92;
    return {
      x: homeX,
      y: homeY,
      z: 0.3 + hash(i * 6.4) * 1.25,
      vx: 0,
      vy: 0,
      rot: hash(i * 9.2) * Math.PI * 2,
      vr: (hash(i * 11.1) - 0.5) * 0.1,
      tilt: hash(i * 13.4) * 1.2,
      vt: (hash(i * 15.6) - 0.5) * 0.06,
      w: 1.4 + hash(i * 17.8) * 5.2,
      h: 0.7 + hash(i * 19.3) * 2.8,
      gold: 0.2 + hash(i * 21.5) * 0.8,
      homeX,
      homeY,
    };
  });
}

export function kickCrumbs(crumbs: Crumb[], power: number) {
  for (let i = 0; i < crumbs.length; i += 1) {
    const crumb = crumbs[i];
    const a = hash(i * 29 + power * 50) * Math.PI * 2;
    const mag = power * (0.55 + hash(i * 31) * 0.9);
    crumb.vx += Math.cos(a) * mag;
    crumb.vy += Math.sin(a) * mag * 0.85;
    crumb.vr += (hash(i * 33) - 0.5) * power * 8;
    crumb.vt += (hash(i * 35) - 0.5) * power * 4;
  }
}

export function stepCrumbs(crumbs: Crumb[], dt: number, field: CrumbField) {
  if (field.reduced) return;
  const t = Math.min(dt, 0.033) * 60;
  const idle = field.mode === "idle";
  const settle = idle && field.scatter < 0.18 ? 0.018 : 0.003;
  const energy =
    0.28 +
    field.gain * 1.05 +
    field.heat * 0.28 +
    field.scatter * 0.7 +
    (field.mode === "crisp" ? 0.4 : 0) +
    (field.mode === "load" ? 0.22 : 0) +
    field.kick * 0.35;
  const drag = idle ? 0.9 : 0.955;

  for (const crumb of crumbs) {
    crumb.vx += (crumb.homeX - crumb.x) * settle;
    crumb.vy += (crumb.homeY - crumb.y) * settle;

    if (field.pointerLive) {
      const dx = crumb.x - field.pointerX;
      const dy = crumb.y - field.pointerY;
      const d2 = dx * dx + dy * dy;
      if (d2 < 0.05) {
        const d = Math.sqrt(d2) + 0.0008;
        const force = (0.05 - d2) * (0.9 + field.gain) * 0.19;
        crumb.vx += (dx / d) * force;
        crumb.vy += (dy / d) * force;
        crumb.vr += force * 3;
      }
    }

    crumb.vy += field.scrollVel * 0.00042 * (0.4 + crumb.z);
    crumb.vx += field.scrollVel * 0.0001 * (crumb.gold - 0.5);
    crumb.vx += (hash(crumb.homeX * 80 + crumb.y * 10) - 0.5) * 0.0012 * energy;
    crumb.vy += (hash(crumb.homeY * 80 + crumb.x * 10) - 0.5) * 0.0012 * energy;

    crumb.vx *= drag;
    crumb.vy *= drag;
    crumb.x += crumb.vx * t * energy;
    crumb.y += crumb.vy * t * energy;
    crumb.rot += crumb.vr * t * energy;
    crumb.tilt += crumb.vt * t * energy;

    if (crumb.x < -0.06) crumb.x = 1.06;
    if (crumb.x > 1.06) crumb.x = -0.06;
    if (crumb.y < -0.06) crumb.y = 1.06;
    if (crumb.y > 1.06) crumb.y = -0.06;
  }
}

export function drawCrumbs(
  ctx: CanvasRenderingContext2D,
  crumbs: Crumb[],
  width: number,
  height: number,
  field: CrumbField,
) {
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  const visible = Math.floor(crumbs.length * (0.5 + field.gain * 0.5));

  for (let i = 0; i < visible; i += 1) {
    const crumb = crumbs[i];
    const scale = 0.5 + crumb.z * 0.75;
    const x = crumb.x * width;
    const y = crumb.y * height;
    const ww = crumb.w * scale * (0.8 + field.gain * 0.4 + field.kick * 0.15);
    const hh = crumb.h * scale;
    const alpha =
      (0.2 + crumb.gold * 0.5 + field.gain * 0.16 + field.kick * 0.14) *
      Math.min(1, 0.35 + crumb.z * 0.55);
    const r = 196 + crumb.gold * 52;
    const g = 150 + crumb.gold * 60;
    const b = 86 + crumb.gold * 46;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(crumb.rot);
    ctx.transform(1, 0, Math.sin(crumb.tilt) * 0.42, 1, 0, 0);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    const rad = Math.min(ww, hh) * 0.38;
    ctx.beginPath();
    ctx.moveTo(-ww / 2 + rad, -hh / 2);
    ctx.arcTo(ww / 2, -hh / 2, ww / 2, hh / 2, rad);
    ctx.arcTo(ww / 2, hh / 2, -ww / 2, hh / 2, rad);
    ctx.arcTo(-ww / 2, hh / 2, -ww / 2, -hh / 2, rad);
    ctx.arcTo(-ww / 2, -hh / 2, ww / 2, -hh / 2, rad);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = `rgba(244, 232, 196, ${alpha * 0.5})`;
    ctx.fillRect(-ww / 2, -hh / 2, ww * 0.38, hh * 0.3);
    ctx.restore();
  }
  ctx.restore();
}
