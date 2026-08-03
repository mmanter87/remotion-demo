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

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const kickerIn = spring({ frame: frame - 4, fps, config: { damping: 200 } });
  const titleIn = spring({
    frame: frame - 12,
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.8 },
  });
  const circuitIn = spring({
    frame: frame - 22,
    fps,
    config: { damping: 13, stiffness: 160, mass: 0.8 },
  });
  const chipIn = spring({ frame: frame - 50, fps, config: { damping: 200 } });

  const titleScale = interpolate(titleIn, [0, 1], [2.6, 1]);
  const circuitScale = interpolate(circuitIn, [0, 1], [2.6, 1]);

  const wave = interpolate(frame, [14, 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Backdrop glowA={colors.yellow} glowB={colors.purple} />
      <Sparkles seed="hook" count={30} />

      {/* Shockwave ring on the title slam */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            width: 500,
            height: 500,
            borderRadius: 9999,
            border: `6px solid ${colors.yellow}`,
            transform: `scale(${0.3 + wave * 2.6})`,
            opacity: (1 - wave) * 0.6,
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 30,
        }}
      >
        <div
          style={{
            fontFamily: fonts.body,
            fontWeight: 800,
            fontSize: 36,
            letterSpacing: 10,
            color: colors.yellow,
            opacity: kickerIn,
            transform: `translateY(${interpolate(kickerIn, [0, 1], [40, 0])}px)`,
          }}
        >
          CALLING ALL COLLECTORS
        </div>

        <div style={{ textAlign: "center", lineHeight: 0.92 }}>
          <div
            style={{
              fontFamily: fonts.display,
              fontSize: 200,
              color: colors.white,
              transform: `scale(${titleScale})`,
              opacity: titleIn,
              textShadow: "0 20px 60px rgba(0,0,0,0.6)",
            }}
          >
            COLLECTORS
          </div>
          <div
            style={{
              fontFamily: fonts.display,
              fontSize: 200,
              transform: `scale(${circuitScale})`,
              opacity: circuitIn,
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
            fontSize: 38,
            letterSpacing: 4,
            color: colors.white,
            border: `2px solid rgba(248,249,255,0.35)`,
            borderRadius: 9999,
            padding: "18px 46px",
            opacity: chipIn,
            transform: `translateY(${interpolate(chipIn, [0, 1], [40, 0])}px)`,
            background: "rgba(255,255,255,0.06)",
          }}
        >
          THE ULTIMATE TCG CARD SHOW
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
