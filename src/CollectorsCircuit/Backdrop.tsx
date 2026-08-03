import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors } from "./theme";

// Shared dark-arena background: radial vignette plus two slowly drifting
// color blobs so every scene has subtle motion behind the foreground.
export const Backdrop: React.FC<{
  glowA?: string;
  glowB?: string;
}> = ({ glowA = colors.purple, glowB = colors.blue }) => {
  const frame = useCurrentFrame();
  const driftX = Math.sin(frame / 55) * 60;
  const driftY = Math.cos(frame / 70) * 40;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 32%, #181838 0%, ${colors.bg} 68%)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: 9999,
          left: -300 + driftX,
          top: -200 + driftY,
          background: glowA,
          opacity: 0.14,
          filter: "blur(160px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: 9999,
          right: -320 - driftX,
          bottom: -260 - driftY,
          background: glowB,
          opacity: 0.13,
          filter: "blur(160px)",
        }}
      />
    </AbsoluteFill>
  );
};
