import { copy } from "@/lib/brand";
import { Reveal } from "@/components/motion/Reveal";

export function Contact() {
  return (
    <section id="talk" className="relative px-6 py-28 md:py-40">
      <Reveal>
        <p className="font-display text-[11px] tracking-[0.32em] text-panko uppercase">
          Contact
        </p>
        <h2 className="type-grit font-display mt-8 max-w-4xl text-5xl font-extrabold leading-[0.95] tracking-[0.02em] text-rice md:text-7xl">
          {copy.contact}
        </h2>
        <a
          href={`mailto:${copy.email}`}
          className="mt-10 inline-flex items-center gap-3 text-lg text-panko transition-colors hover:text-rice focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-panko"
        >
          {copy.email}
          <span className="signal-pip" aria-hidden />
        </a>
      </Reveal>
    </section>
  );
}
