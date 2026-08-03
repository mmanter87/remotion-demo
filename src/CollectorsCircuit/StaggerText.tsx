import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

// Per-character headline reveal (ui-ux-pro-max motion: char-stagger with
// small per-item delay, expo-out feel via a stiff spring).
export const StaggerText: React.FC<{
  text: string;
  delay?: number;
  perChar?: number;
  style?: React.CSSProperties;
}> = ({ text, delay = 0, perChar = 1.4, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        perspective: 700,
        ...style,
      }}
    >
      {text.split("").map((ch, i) => {
        const s = spring({
          frame: frame - delay - i * perChar,
          fps,
          config: { damping: 16, stiffness: 190, mass: 0.6 },
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              opacity: s,
              transform: `translateY(${(1 - s) * 80}px) rotateX(${(1 - s) * 75}deg)`,
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};
