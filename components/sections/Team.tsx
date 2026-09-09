import { team } from "@/lib/brand";
import { Reveal } from "@/components/motion/Reveal";

export function Team() {
  return (
    <section id="team" className="relative px-6 py-32 md:py-48">
      <div className="grid gap-24 md:grid-cols-2">
        {team.map((person, i) => (
          <Reveal key={person.name} delay={i * 0.06}>
            <article>
              <h2 className="type-grit font-sans text-6xl font-extrabold tracking-[-0.04em] text-rice uppercase md:text-8xl">
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
