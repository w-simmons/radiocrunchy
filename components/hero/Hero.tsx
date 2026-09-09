"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import { copy } from "@/lib/brand";
import { createField, type FieldInput } from "@/lib/field";
import { STATES } from "@/lib/motion";
import { HeroCanvas } from "@/components/hero/HeroCanvas";
import { RadioGain } from "@/components/hero/RadioGain";
import { useField } from "@/components/hero/useField";
import { useHeroLoop } from "@/components/hero/useHeroLoop";

export function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const fieldRef = useRef<FieldInput>(createField());
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );
  const showModes = useSyncExternalStore(subscribeModes, getModes, () => false);
  const [gain, setGain] = useState(0.62);
  const fadeRefs = useMemo(() => [taglineRef, navRef], []);

  const { paramsRef, mode, auto, hold, play, cycle } = useHeroLoop({
    titleRef,
    fadeRefs,
    fieldRef,
    reduced,
    showModes,
  });

  useField(fieldRef, reduced, setGain);

  return (
    <>
      <HeroCanvas paramsRef={paramsRef} fieldRef={fieldRef} reduced={reduced} />
      <section
        className="relative z-10 h-dvh min-h-[36rem]"
        data-hero-state={mode}
        aria-label="Radio Crunchy signal"
      >
        <div className="flex h-full flex-col items-center px-6">
          <div className="flex flex-1 flex-col items-center justify-center">
            <button
              type="button"
              onClick={cycle}
              className="cursor-pointer rounded-sm focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-8 focus-visible:outline-panko"
              aria-label="Cycle signal state"
            >
              <h1
                ref={titleRef}
                data-text={copy.mark}
                className="mark font-sans text-center text-[clamp(3.4rem,13vw,9.6rem)] font-extrabold leading-none tracking-[0.02em] text-rice-dim uppercase"
                style={{
                  filter: "url(#ink-bleed) blur(18px)",
                  transform: "scaleX(0.72)",
                }}
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

          <div className="flex w-full max-w-xl flex-col items-center gap-8 pb-10">
            {showModes && (
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
            )}

            <RadioGain
              gain={gain}
              reduced={reduced}
              onGain={(value) => {
                setGain(value);
                fieldRef.current.gain = value;
                paramsRef.current.gain = value;
              }}
            />

            <nav
              ref={navRef}
              className="flex items-center gap-10 text-[0.98rem] text-rice opacity-0"
              aria-label="Hero"
            >
              <a
                href="#work"
                className="rounded-sm transition-colors hover:text-panko-hot focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-panko"
              >
                Work
              </a>
              <a
                href="#talk"
                className="inline-flex items-center gap-2 rounded-sm transition-colors hover:text-panko-hot focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-panko"
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
    </>
  );
}

function subscribeReducedMotion(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function subscribeModes(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange);
  return () => window.removeEventListener("popstate", onStoreChange);
}

function getModes() {
  const modes = new URLSearchParams(window.location.search).get("modes");
  return modes === "1" || modes === "true";
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
      className={`font-sans text-[10px] tracking-[0.28em] uppercase transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-panko disabled:cursor-default ${
        active
          ? "text-rice"
          : current
            ? "text-panko-hot"
            : "text-rice-dim hover:text-rice"
      }`}
    >
      {label}
    </button>
  );
}
