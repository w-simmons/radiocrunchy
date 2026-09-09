# Radio Crunchy

Studio site. Dark-signal radio, panko grain, 120bpm.

**Crunchy outside. Soft center.**

## Stack

Next.js App Router · TypeScript · Tailwind · GSAP ScrollTrigger · canvas hero

## Develop

```bash
pnpm install
pnpm dev
```

```bash
pnpm build
pnpm start
```

Signal debug chrome (AUTO / LOAD / IDLE / CRISP): `/?modes=1`

## Hero

Condensed `RADIO CRUNCHY` over vertical amber bars. Three states at 120bpm:

| State | Look |
| --- | --- |
| **Load** | Soft mark, thin signal, crumbs kick |
| **Idle** | Locked mark, bars settle, crumbs drift home |
| **Crisp** | Hot amplitude, tuner needle, crumbs burst |

Turn up / turn down is a real dial. Scroll velocity and pointer scatter crumbs. Waveform follows gain.

`prefers-reduced-motion: reduce` holds a static idle.

## Brand

| Token | Hex |
| --- | --- |
| Ink | `#0B0B0C` |
| Ink 2 | `#121214` |
| Ink 3 | `#1C1B19` |
| Rice | `#F4F0E8` |
| Rice dim | `#A8A29A` |
| Panko | `#C4A574` |
| Panko hot | `#E4C58A` |
| Signal | `#E85D4C` |
| Hairline | panko at 38% |

Type: Host Grotesk. No blue SaaS. No sushi photography.

## Copy

Canon only. No invented taglines. No live MLS, board distribution, CTO title, or C.J.

- Consult · Build · Product
- GoVela — “Agents who win.” — [govela.dev](https://govela.dev)
- Stud — “The shelf for your cars.” — [bricktrail.vercel.app](https://bricktrail.vercel.app) only
- Will — “Product. Agents. Ship.”
- Tom — “Infra. Live. Real.”
- Contact — “What's the signal?” — [will@willsimmons.net](mailto:will@willsimmons.net)

## Deploy

Vercel project `radiocrunchy`. `vercel.json` sets `framework: nextjs`.
