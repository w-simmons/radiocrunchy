# Radio Crunchy

Studio site for Radio Crunchy. Dark-signal radio, panko grain, 120bpm.

**Crunchy outside. Soft center.**

## Stack

Next.js App Router · TypeScript · Tailwind CSS · GSAP ScrollTrigger · canvas hero

## Develop

```bash
pnpm install
pnpm dev
```

```bash
pnpm build
pnpm start
```

## Hero

The hero is a canvas waveform (vertical bars, not a sine) under a distressed condensed `RADIO CRUNCHY` mark — rock-poster grit, dense panko grain, crumb flecks, and a 120bpm kick. It runs three states:

| State | Look |
| --- | --- |
| **Load** | Soft/blurred mark, thin signal waking |
| **Idle** | Locked mark, amber bar field, tagline, Work / Talk + coral pip |
| **Crisp** | Hotter amplitude and grain, tuner needle |

Auto-loop is default. Manual:

- Click the mark to cycle
- `AUTO` / `LOAD` / `IDLE` / `CRISP`
- Keys `A`, `1`, `2`, `3`

`prefers-reduced-motion: reduce` holds a static idle (grit stays, motion stops).

Feel vs. the first cut: louder/thicker bars, hotter gold bloom, ink-bleed on the wordmark, dual grain + floating crumbs, beat-1 kick flash, and a slam from blur→razor on the load→idle lock. Same IA and canon copy.

## Brand

| Token | Hex |
| --- | --- |
| Ink | `#0B0B0C` |
| Rice | `#F4F0E8` |
| Rice dim | `#A8A29A` |
| Panko | `#C4A574` |
| Signal | `#E85D4C` |

No blue SaaS. No sushi photography.

## Copy

Canon only. Do not invent taglines. Do not claim live MLS, board distribution, or a formal CTO title.

- GoVela — “Agents who win.” — [govela.dev](https://govela.dev)
- Stud — “The shelf for your cars.” — [bricktrail.vercel.app](https://bricktrail.vercel.app) only
- Will — “Product. Agents. Ship.”
- Tom — “Infra. Live. Real.”
- Contact — “What's the signal?” — [will@willsimmons.net](mailto:will@willsimmons.net)

## Deploy

Vercel project `radiocrunchy` is already linked to this repo. Push to GitHub; Vercel builds from `pnpm build`.
