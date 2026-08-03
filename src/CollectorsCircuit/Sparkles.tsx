import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";

// Deterministic twinkling particle field (seeded with remotion's random()).
export const Sparkles: React.FC<{
  count?: number;
  seed?: string;
}> = ({ count = 26, seed = "sparkle" }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }).map((_, i) => {
        const x = random(`${seed}-x-${i}`) * 100;
        const y = random(`${seed}-y-${i}`) * 100;
        const size = 2 + random(`${seed}-s-${i}`) * 5;
        const phase = random(`${seed}-p-${i}`) * Math.PI * 2;
        const twinkle = (Math.sin(frame / 9 + phase) + 1) / 2;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              borderRadius: 9999,
              background: "white",
              opacity: 0.1 + twinkle * 0.7,
              boxShadow: `0 0 ${size * 3}px rgba(255,255,255,0.7)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
