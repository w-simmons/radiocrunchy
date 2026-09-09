export const colors = {
  ink: "#0B0B0C",
  rice: "#F4F0E8",
  riceDim: "#A8A29A",
  panko: "#C4A574",
  signal: "#E85D4C",
} as const;

export const copy = {
  mark: "RADIO CRUNCHY",
  tagline: "Crunchy outside. Soft center.",
  contact: "What's the signal?",
  email: "will@willsimmons.net",
} as const;

export const lanes = [
  {
    index: "01",
    name: "Consult",
    body: "Scope, sequence, and the call — the work before we build.",
  },
  {
    index: "02",
    name: "Build",
    body: "Design and engineering through to a live product.",
  },
  {
    index: "03",
    name: "Product",
    body: "What we keep in market: GoVela and Stud.",
  },
] as const;

export const products = [
  {
    name: "GoVela",
    line: "Agents who win.",
    href: "https://govela.dev",
  },
  {
    name: "Stud",
    line: "The shelf for your cars.",
    href: "https://bricktrail.vercel.app",
  },
] as const;

export const team = [
  {
    name: "Will",
    line: "Product. Agents. Ship.",
  },
  {
    name: "Tom",
    line: "Infra. Live. Real.",
  },
] as const;
