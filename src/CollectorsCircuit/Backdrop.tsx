import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors } from "./theme";

// Card-table backdrop: warm spotlight over near-black, halftone print dots,
// optional slow-rotating gold ray burst, film grain, and a vignette.
// `id` must be unique per scene — two scenes overlap during transitions and
// the SVG noise filter id would otherwise collide.
export const Backdrop: React.FC<{
  id: string;
  rays?: boolean;
  spotlightY?: string;
}> = ({ id, rays = false, spotlightY = "36%" }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {/* Warm spotlight */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 90% 55% at 50% ${spotlightY}, ${colors.bgWarm} 0%, transparent 70%)`,
        }}
      />

      {/* Slow gold ray burst */}
      {rays ? (
        <AbsoluteFill
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <div
            style={{
              width: 3200,
              height: 3200,
              flexShrink: 0,
              background: `repeating-conic-gradient(from ${frame * 0.25}deg, rgba(245,197,66,0.055) 0deg 7deg, transparent 7deg 16deg)`,
              maskImage:
                "radial-gradient(circle, black 0%, transparent 62%)",
              WebkitMaskImage:
                "radial-gradient(circle, black 0%, transparent 62%)",
            }}
          />
        </AbsoluteFill>
      ) : null}

      {/* Halftone print dots */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(245,239,226,0.05) 1.3px, transparent 1.4px)",
          backgroundSize: "16px 16px",
        }}
      />

      {/* Film grain */}
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", opacity: 0.05 }}
      >
        <filter id={`grain-${id}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="2"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${id})`} />
      </svg>

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, transparent 48%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
