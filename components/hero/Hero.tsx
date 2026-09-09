"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { copy } from "@/lib/brand";
import { STATES } from "@/lib/motion";
import { HeroCanvas } from "@/components/hero/HeroCanvas";
import { useHeroLoop } from "@/components/hero/useHeroLoop";

export function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [reduced, setReduced] = useState(false);
  const fadeRefs = useMemo(() => [taglineRef, navRef], []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const { paramsRef, mode, auto, hold, play, cycle } = useHeroLoop({
    titleRef,
    fadeRefs,
    reduced,
  });

  return (
    <section
      className="relative isolate h-dvh min-h-[36rem] overflow-hidden"
      data-hero-state={mode}
      aria-label="Radio Crunchy signal"
    >
      <HeroCanvas paramsRef={paramsRef} reduced={reduced} />

      <div className="relative z-10 flex h-full flex-col items-center px-6">
        <div className="flex flex-1 flex-col items-center justify-center">
          <button
            type="button"
            onClick={cycle}
            className="group cursor-pointer rounded-sm focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-8 focus-visible:outline-panko"
            aria-label="Cycle signal state"
          >
            <h1
              ref={titleRef}
              data-text={copy.mark}
              className="mark font-display text-center text-[clamp(3.2rem,12.5vw,9.35rem)] font-extrabold leading-none tracking-[0.03em] text-rice-dim uppercase"
              style={{ filter: "url(#ink-bleed) blur(18px)" }}
            >
              {copy.mark}
            </h1>
          </button>
          <p
            ref={taglineRef}
            className="mt-6 text-center text-[0.98rem] font-normal tracking-tight text-rice opacity-0 md:text-[1.05rem]"
          >
            {copy.tagline}
          </p>
        </div>

        <div className="flex w-full max-w-xl flex-col items-center gap-7 pb-10">
          <div
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
            role="group"
            aria-label="Signal state"
          >
            <ModeButton
              label="Auto"
              active={auto && !reduced}
              onClick={play}
              disabled={reduced}
            />
            {STATES.map((state) => (
              <ModeButton
                key={state}
                label={state}
                active={!auto && mode === state}
                current={auto && mode === state}
                onClick={() => hold(state)}
                disabled={reduced}
              />
            ))}
          </div>

          <nav
            ref={navRef}
            className="flex items-center gap-10 text-[0.98rem] text-rice opacity-0"
            aria-label="Hero"
          >
            <a
              href="#work"
              className="rounded-sm transition-colors hover:text-panko focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-panko"
            >
              Work
            </a>
            <a
              href="#talk"
              className="inline-flex items-center gap-2 rounded-sm transition-colors hover:text-panko focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-panko"
            >
              Talk
              <span className="signal-pip" aria-hidden />
            </a>
          </nav>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Signal {reduced ? "idle" : auto ? `auto, ${mode}` : mode}
      </p>
    </section>
  );
}

function ModeButton({
  label,
  active,
  current,
  onClick,
  disabled,
}: {
  label: string;
  active: boolean;
  current?: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={`font-display text-[10px] tracking-[0.28em] uppercase transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-panko disabled:cursor-default ${
        active
          ? "text-rice"
          : current
            ? "text-panko"
            : "text-rice-dim hover:text-rice"
      }`}
    >
      {label}
    </button>
  );
}
