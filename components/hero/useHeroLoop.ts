"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import type { FieldInput } from "@/lib/field";
import { BEAT_S, nextState, type HeroState } from "@/lib/motion";
import {
  createHeroParams,
  riceMix,
  STATE_TARGETS,
  type HeroParams,
} from "@/lib/heroParams";

type UseHeroLoopArgs = {
  titleRef: RefObject<HTMLElement | null>;
  fadeRefs: RefObject<HTMLElement | null>[];
  fieldRef: RefObject<FieldInput>;
  reduced: boolean;
  onLooped?: () => void;
  onKeyHint?: () => void;
};

export function useHeroLoop({
  titleRef,
  fadeRefs,
  fieldRef,
  reduced,
  onLooped,
  onKeyHint,
}: UseHeroLoopArgs) {
  const paramsRef = useRef<HeroParams>(createHeroParams());
  const [mode, setMode] = useState<HeroState>(reduced ? "idle" : "load");
  const [auto, setAuto] = useState(!reduced);
  const mainRef = useRef<gsap.core.Timeline | null>(null);
  const beatRef = useRef<gsap.core.Timeline | null>(null);
  const needleRef = useRef<gsap.core.Timeline | null>(null);
  const onLoopedRef = useRef(onLooped);
  const onKeyHintRef = useRef(onKeyHint);

  useEffect(() => {
    onLoopedRef.current = onLooped;
    onKeyHintRef.current = onKeyHint;
  }, [onKeyHint, onLooped]);

  const applyDom = useCallback(() => {
    const p = paramsRef.current;
    p.gain = fieldRef.current.gain;
    const title = titleRef.current;
    if (title) {
      const punch = p.slam * 0.4 + p.kick * 0.2;
      const split = p.split + p.slam * 0.9 + p.kick * 0.45;
      title.style.filter = `url(#ink-bleed) blur(${p.blur}px) contrast(${1.14 + punch})`;
      title.style.color = riceMix(p.typeDim);
      title.style.opacity = String(0.62 + (1 - p.typeDim) * 0.38);
      title.style.transform = `scaleX(0.72) scale(${1 + p.slam * 0.045 + p.kick * 0.012})`;
      title.style.textShadow = `${-split * 0.9}px 0 0 rgba(196,165,116,${0.28 + p.slam * 0.25}), ${split}px 0.4px 0 rgba(232,93,76,${0.12 + p.kick * 0.12})`;
    }
    for (const ref of fadeRefs) {
      if (ref.current) ref.current.style.opacity = String(p.chrome);
    }
  }, [fadeRefs, fieldRef, titleRef]);

  const punchInto = useCallback(
    (state: HeroState) => {
      const p = paramsRef.current;
      const hit = gsap.timeline({ onUpdate: applyDom });
      hit.to(p, {
        ...STATE_TARGETS[state],
        kick: 1,
        slam: state === "load" ? 0 : 1,
        grain: Math.max(STATE_TARGETS[state].grain, 1.15),
        duration: 0.1,
        ease: "power4.out",
      });
      hit.to(p, {
        kick: 0,
        slam: 0,
        grain: STATE_TARGETS[state].grain,
        duration: 0.48,
        ease: "power2.out",
      });
    },
    [applyDom],
  );

  const hold = useCallback(
    (state: HeroState) => {
      setAuto(false);
      setMode(state);
      fieldRef.current.mode = state;
      mainRef.current?.pause();
      needleRef.current?.pause();
      punchInto(state);
      if (state === "crisp") {
        paramsRef.current.needleX = 0.08;
        needleRef.current?.restart();
      } else {
        gsap.to(paramsRef.current, {
          needleAlpha: 0,
          duration: BEAT_S * 0.6,
          ease: "power1.out",
        });
      }
    },
    [fieldRef, punchInto],
  );

  const play = useCallback(() => {
    setAuto(true);
    setMode("load");
    fieldRef.current.mode = "load";
    needleRef.current?.pause();
    mainRef.current?.restart();
  }, [fieldRef]);

  const cycle = useCallback(() => {
    hold(nextState(mode));
  }, [hold, mode]);

  useEffect(() => {
    registerGsap();
    const p = paramsRef.current;

    if (reduced) {
      Object.assign(p, STATE_TARGETS.idle, {
        needleAlpha: 0,
        beat: 0,
        kick: 0,
        slam: 0,
      });
      fieldRef.current.mode = "idle";
      applyDom();
      return;
    }

    const beat = gsap.timeline({ repeat: -1 });
    beat
      .to(p, { beat: 1, kick: 1, duration: 0.07, ease: "power3.out" })
      .to(p, { beat: 0, kick: 0, duration: 0.43, ease: "power2.in" })
      .to(p, { beat: 0.75, duration: 0.06, ease: "power2.out" })
      .to(p, { beat: 0, duration: 0.44, ease: "power2.in" })
      .to(p, { beat: 0.75, duration: 0.06, ease: "power2.out" })
      .to(p, { beat: 0, duration: 0.44, ease: "power2.in" })
      .to(p, { beat: 0.75, duration: 0.06, ease: "power2.out" })
      .to(p, { beat: 0, duration: 0.44, ease: "power2.in" });
    beatRef.current = beat;

    const needle = gsap.timeline({ paused: true, repeat: -1 });
    needle
      .set(p, { needleX: 0.06, needleAlpha: 1 })
      .to(p, { needleX: 0.94, duration: BEAT_S * 7, ease: "none" })
      .to(p, { needleX: 0.06, duration: BEAT_S * 7, ease: "none" });
    needleRef.current = needle;

    const main = gsap.timeline({
      repeat: -1,
      onUpdate: applyDom,
      onRepeat: () => onLoopedRef.current?.(),
    });

    main
      .call(() => {
        setMode("load");
        fieldRef.current.mode = "load";
      })
      .set(p, {
        ...STATE_TARGETS.load,
        needleX: 0.12,
        needleAlpha: 0,
        kick: 0,
        slam: 0,
      })
      .to(p, {
        amplitude: 0.34,
        wake: 0.4,
        blur: 10,
        grain: 0.88,
        duration: BEAT_S * 6.4,
        ease: "power1.out",
      })
      .to(p, {
        blur: 22,
        grain: 1.18,
        duration: 0.18,
        ease: "power2.in",
      })
      .call(() => {
        setMode("idle");
        fieldRef.current.mode = "idle";
      })
      .to(p, {
        ...STATE_TARGETS.idle,
        blur: 0,
        kick: 1,
        slam: 1,
        grain: 1.28,
        amplitude: 1.2,
        duration: 0.1,
        ease: "power4.out",
      })
      .to(p, {
        kick: 0,
        slam: 0,
        grain: STATE_TARGETS.idle.grain,
        amplitude: STATE_TARGETS.idle.amplitude,
        duration: 0.5,
        ease: "power2.out",
      })
      .to(p, { duration: BEAT_S * 8.6 })
      .call(() => {
        setMode("crisp");
        fieldRef.current.mode = "crisp";
        p.needleX = 0.08;
      })
      .to(p, {
        ...STATE_TARGETS.crisp,
        kick: 1,
        slam: 0.7,
        grain: 1.35,
        duration: 0.12,
        ease: "power3.in",
      })
      .to(p, {
        kick: 0,
        slam: 0,
        grain: STATE_TARGETS.crisp.grain,
        duration: 0.4,
        ease: "power2.out",
      })
      .to(p, {
        needleX: 0.92,
        duration: BEAT_S * 5.2,
        ease: "none",
      })
      .to(p, {
        needleAlpha: 0,
        duration: BEAT_S,
        ease: "power1.in",
      });

    mainRef.current = main;
    applyDom();

    return () => {
      main.kill();
      beat.kill();
      needle.kill();
      mainRef.current = null;
      beatRef.current = null;
      needleRef.current = null;
    };
  }, [applyDom, fieldRef, reduced]);

  useEffect(() => {
    if (reduced) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }
      if (event.key === "1") {
        onKeyHintRef.current?.();
        hold("load");
      }
      if (event.key === "2") {
        onKeyHintRef.current?.();
        hold("idle");
      }
      if (event.key === "3") {
        onKeyHintRef.current?.();
        hold("crisp");
      }
      if (event.key === "a" || event.key === "A") {
        onKeyHintRef.current?.();
        play();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hold, play, reduced]);

  return { paramsRef, mode, auto, hold, play, cycle };
}
