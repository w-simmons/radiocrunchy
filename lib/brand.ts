export const colors = {
  ink: "#0B0B0C",
  ink2: "#121214",
  ink3: "#1C1B19",
  rice: "#F4F0E8",
  riceDim: "#A8A29A",
  panko: "#C4A574",
  pankoHot: "#E4C58A",
  signal: "#E85D4C",
  hairline: "color-mix(in srgb, #C4A574 38%, transparent)",
} as const;

export const copy = {
  mark: "RADIO CRUNCHY",
  tagline: "Crunchy outside. Soft center.",
  contact: "What's the signal?",
  email: "will@willsimmons.net",
} as const;

export const lanes = ["Consult", "Build", "Product"] as const;

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
