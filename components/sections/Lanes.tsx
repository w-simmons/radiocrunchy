import { lanes } from "@/lib/brand";
import { Reveal } from "@/components/motion/Reveal";

export function Lanes() {
  return (
    <section className="relative px-6 py-40 md:py-56">
      <div className="grid gap-24 md:grid-cols-3 md:gap-16">
        {lanes.map((name, i) => (
          <Reveal key={name} delay={i * 0.06}>
            <h2 className="type-grit font-sans text-5xl font-extrabold tracking-[-0.03em] text-rice uppercase md:text-6xl">
              {name}
            </h2>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
