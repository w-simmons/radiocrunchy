import { team } from "@/lib/brand";
import { Reveal } from "@/components/motion/Reveal";

export function Team() {
  return (
    <section id="team" className="relative px-6 py-28 md:py-36">
      <Reveal>
        <p className="font-display text-[11px] tracking-[0.32em] text-panko uppercase">
          Studio
        </p>
      </Reveal>
      <div className="mt-12 grid gap-16 md:grid-cols-2">
        {team.map((person, i) => (
          <Reveal key={person.name} delay={i * 0.08}>
            <article>
              <h2 className="type-grit font-display text-6xl font-extrabold tracking-[0.05em] text-rice uppercase md:text-7xl">
                {person.name}
              </h2>
              <p className="mt-4 text-lg text-rice-dim">{person.line}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
