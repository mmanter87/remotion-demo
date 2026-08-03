import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Backdrop } from "./Backdrop";
import { Sparkles } from "./Sparkles";
import { colors, fonts } from "./theme";

export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoIn = spring({ frame: frame - 2, fps, config: { damping: 200 } });
  const lineIn = spring({ frame: frame - 14, fps, config: { damping: 200 } });
  const buttonIn = spring({
    frame: frame - 26,
    fps,
    config: { damping: 13, stiffness: 150, mass: 0.8 },
  });
  const footIn = spring({ frame: frame - 44, fps, config: { damping: 200 } });

  const pulse = 1 + Math.sin(frame / 6) * 0.025;

  return (
    <AbsoluteFill>
      <Backdrop glowA={colors.yellow} glowB={colors.purple} />
      <Sparkles seed="cta" count={40} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 56,
          padding: 60,
        }}
      >
        <div
          style={{
            textAlign: "center",
            lineHeight: 0.95,
            opacity: logoIn,
            transform: `translateY(${interpolate(logoIn, [0, 1], [-50, 0])}px)`,
          }}
        >
          <div
            style={{
              fontFamily: fonts.display,
              fontSize: 120,
              color: colors.white,
            }}
          >
            COLLECTORS
          </div>
          <div
            style={{
              fontFamily: fonts.display,
              fontSize: 120,
              background: `linear-gradient(120deg, ${colors.yellow}, ${colors.orange})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            CIRCUIT
          </div>
        </div>

        <div
          style={{
            fontFamily: fonts.body,
            fontWeight: 700,
            fontSize: 52,
            color: colors.white,
            opacity: lineIn,
            transform: `translateY(${interpolate(lineIn, [0, 1], [40, 0])}px)`,
          }}
        >
          Your next grail is waiting.
        </div>

        <div
          style={{
            fontFamily: fonts.display,
            fontSize: 64,
            letterSpacing: 2,
            color: colors.bg,
            background: `linear-gradient(120deg, ${colors.yellow}, ${colors.orange})`,
            borderRadius: 9999,
            padding: "30px 70px",
            opacity: buttonIn,
            transform: `scale(${interpolate(buttonIn, [0, 1], [0.4, 1]) * pulse})`,
            boxShadow: `0 0 90px ${colors.yellow}55`,
          }}
        >
          COLLECTORSCIRCUIT.COM
        </div>

        <div
          style={{
            fontFamily: fonts.body,
            fontWeight: 600,
            fontSize: 36,
            color: colors.muted,
            opacity: footIn,
            transform: `translateY(${interpolate(footIn, [0, 1], [30, 0])}px)`,
          }}
        >
          Follow for show dates & vendor drops
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
