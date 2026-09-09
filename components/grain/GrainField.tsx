export function GrainField() {
  return (
    <div className="pointer-events-none fixed inset-0 z-40" aria-hidden>
      <svg className="absolute h-0 w-0" aria-hidden>
        <filter
          id="ink-bleed"
          x="-4%"
          y="-8%"
          width="108%"
          height="116%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.7 0.95"
            numOctaves="3"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2.8"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        <filter
          id="ink-bleed-soft"
          x="-3%"
          y="-6%"
          width="106%"
          height="112%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85 1.1"
            numOctaves="2"
            seed="3"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="1.35"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      <div className="grain-field grain-field--fine" />
      <div className="grain-field grain-field--crumb" />
      <div className="scanlines" />
    </div>
  );
}
