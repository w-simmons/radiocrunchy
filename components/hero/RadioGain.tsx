"use client";

import { useRef } from "react";
import { clampGain } from "@/lib/field";

type RadioGainProps = {
  gain: number;
  onGain: (value: number) => void;
  reduced: boolean;
};

export function RadioGain({ gain, onGain, reduced }: RadioGainProps) {
  const knobRef = useRef<HTMLDivElement>(null);
  const angle = -135 + gain * 270;

  const setFromPoint = (clientX: number, clientY: number) => {
    const el = knobRef.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const dx = clientX - (box.left + box.width / 2);
    const dy = clientY - (box.top + box.height / 2);
    const deg = (Math.atan2(dx, -dy) * 180) / Math.PI;
    onGain(clampGain((deg + 135) / 270));
  };

  return (
    <div className="flex items-center gap-5">
      <button
        type="button"
        onClick={() => onGain(clampGain(gain - 0.08))}
        className="font-sans text-[10px] tracking-[0.22em] text-rice-dim uppercase transition-colors hover:text-panko-hot focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-panko"
      >
        Turn down
      </button>
      <div
        ref={knobRef}
        role="slider"
        aria-label="Signal"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(gain * 100)}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowUp" || event.key === "+") {
            onGain(clampGain(gain + 0.06));
          }
          if (event.key === "ArrowLeft" || event.key === "ArrowDown" || event.key === "-") {
            onGain(clampGain(gain - 0.06));
          }
        }}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setFromPoint(event.clientX, event.clientY);
        }}
        onPointerMove={(event) => {
          if (event.buttons === 1) setFromPoint(event.clientX, event.clientY);
        }}
        onWheel={(event) => {
          onGain(clampGain(gain + (event.deltaY > 0 ? -0.04 : 0.04)));
        }}
        className="relative h-14 w-14 cursor-grab rounded-full border border-hairline bg-ink-2 active:cursor-grabbing"
      >
        {!reduced &&
          Array.from({ length: 12 }, (_, i) => (
            <span
              key={i}
              className="absolute left-1/2 top-1.5 h-1.5 w-px origin-[center_24px] bg-panko/50"
              style={{ transform: `translateX(-50%) rotate(${i * 30}deg)` }}
            />
          ))}
        <span
          className="absolute left-1/2 top-2 h-4 w-0.5 origin-[center_20px] bg-panko-hot"
          style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
        />
        <span className="absolute inset-[18px] rounded-full border border-hairline bg-ink-3" />
      </div>
      <button
        type="button"
        onClick={() => onGain(clampGain(gain + 0.08))}
        className="font-sans text-[10px] tracking-[0.22em] text-rice-dim uppercase transition-colors hover:text-panko-hot focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-panko"
      >
        Turn up
      </button>
    </div>
  );
}
