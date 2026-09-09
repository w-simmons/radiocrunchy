"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { gsap, registerGsap } from "@/lib/gsap";
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
  reduced: boolean;
};

export function useHeroLoop({ titleRef, fadeRefs, reduced }: UseHeroLoopArgs) {
  const paramsRef = useRef<HeroParams>(createHeroParams());
  const [mode, setMode] = useState<HeroState>(reduced ? "idle" : "load");
  const [auto, setAuto] = useState(!reduced);
  const mainRef = useRef<gsap.core.Timeline | null>(null);
  const beatRef = useRef<gsap.core.Timeline | null>(null);
  const needleRef = useRef<gsap.core.Timeline | null>(null);

  const applyDom = useCallback(() => {
    const p = paramsRef.current;
    const title = titleRef.current;
    if (title) {
      title.style.filter = `blur(${p.blur}px)`;
      title.style.color = riceMix(p.typeDim);
      title.style.opacity = String(0.58 + (1 - p.typeDim) * 0.42);
    }
    for (const ref of fadeRefs) {
      if (ref.current) ref.current.style.opacity = String(p.chrome);
    }
  }, [fadeRefs, titleRef]);

  const hold = useCallback(
    (state: HeroState) => {
      setAuto(false);
      setMode(state);
      mainRef.current?.pause();
      needleRef.current?.pause();
      gsap.to(paramsRef.current, {
        ...STATE_TARGETS[state],
        duration: BEAT_S,
        ease: "power2.inOut",
        onUpdate: applyDom,
      });
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
    [applyDom],
  );

  const play = useCallback(() => {
    setAuto(true);
    setMode("load");
    needleRef.current?.pause();
    mainRef.current?.restart();
  }, []);

  const cycle = useCallback(() => {
    hold(nextState(mode));
  }, [hold, mode]);

  useEffect(() => {
    registerGsap();
    const p = paramsRef.current;

    if (reduced) {
      Object.assign(p, STATE_TARGETS.idle, { needleAlpha: 0, beat: 0 });
      applyDom();
      return;
    }

    const beat = gsap.timeline({ repeat: -1 });
    beat
      .to(p, { beat: 1, duration: 0.08, ease: "power2.out" })
      .to(p, { beat: 0, duration: 0.42, ease: "power2.in" });
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
    });

    main
      .call(() => setMode("load"))
      .set(p, { ...STATE_TARGETS.load, needleX: 0.12, needleAlpha: 0 })
      .to(p, {
        amplitude: 0.22,
        wake: 0.34,
        blur: 8,
        grain: 0.62,
        duration: BEAT_S * 7,
        ease: "power1.out",
      })
      .call(() => setMode("idle"))
      .to(p, {
        ...STATE_TARGETS.idle,
        duration: BEAT_S,
        ease: "power3.out",
      })
      .to(p, { duration: BEAT_S * 11 })
      .call(() => {
        setMode("crisp");
        p.needleX = 0.08;
      })
      .to(p, {
        ...STATE_TARGETS.crisp,
        duration: BEAT_S,
        ease: "power2.in",
      })
      .to(p, {
        needleX: 0.92,
        duration: BEAT_S * 6,
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
  }, [applyDom, reduced]);

  useEffect(() => {
    if (reduced) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }
      if (event.key === "1") hold("load");
      if (event.key === "2") hold("idle");
      if (event.key === "3") hold("crisp");
      if (event.key === "a" || event.key === "A") play();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hold, play, reduced]);

  return { paramsRef, mode, auto, hold, play, cycle };
}
