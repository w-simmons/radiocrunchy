import { lanes } from "@/lib/brand";
import { Reveal } from "@/components/motion/Reveal";

export function Lanes() {
  return (
    <section className="relative px-6 py-28 md:py-36">
      <Reveal>
        <p className="font-display text-[11px] tracking-[0.32em] text-panko uppercase">
          Lanes
        </p>
      </Reveal>
      <div className="mt-12 grid gap-12 md:grid-cols-3 md:gap-16">
        {lanes.map((lane, i) => (
          <Reveal key={lane.name} delay={i * 0.08}>
            <article className="border-t border-panko/25 pt-6">
              <p className="font-mono text-[11px] tracking-[0.28em] text-panko">
                {lane.index}
              </p>
              <h2 className="font-display mt-4 text-4xl font-bold tracking-[0.06em] text-rice uppercase md:text-5xl">
                {lane.name}
              </h2>
              <p className="mt-5 max-w-xs text-[0.98rem] leading-7 text-rice-dim">
                {lane.body}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
