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
import { StaggerText } from "./StaggerText";
import { colors, foilGradient, fonts } from "./theme";

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const kickerIn = spring({ frame: frame - 4, fps, config: { damping: 200 } });
  const circuitIn = spring({
    frame: frame - 26,
    fps,
    config: { damping: 13, stiffness: 150, mass: 0.8 },
  });
  const chipIn = spring({ frame: frame - 56, fps, config: { damping: 200 } });

  const wave = interpolate(frame, [28, 62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shine = interpolate(frame, [34, 100], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Backdrop id="hook" rays />
      <Sparkles seed="hook" count={26} />

      {/* Shockwave ring on the foil-line slam */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            width: 560,
            height: 560,
            borderRadius: 9999,
            border: `5px solid ${colors.gold}`,
            transform: `scale(${0.3 + wave * 2.5})`,
            opacity: (1 - wave) * 0.5,
          }}
        />
      </AbsoluteFill>

      {/* Poster block: left-aligned, slightly rotated */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          paddingLeft: 84,
          paddingRight: 40,
          transform: "rotate(-3deg)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 26,
            marginBottom: 38,
            opacity: kickerIn,
            transform: `translateX(${interpolate(kickerIn, [0, 1], [-60, 0])}px)`,
          }}
        >
          <div
            style={{
              width: 92,
              height: 4,
              background: colors.gold,
            }}
          />
          <div
            style={{
              fontFamily: fonts.body,
              fontWeight: 600,
              fontSize: 32,
              letterSpacing: 8,
              color: colors.gold,
            }}
          >
            CALLING ALL COLLECTORS
          </div>
        </div>

        <StaggerText
          text="COLLECTORS"
          delay={10}
          style={{
            justifyContent: "flex-start",
            fontFamily: fonts.display,
            fontSize: 176,
            lineHeight: 1,
            color: colors.cream,
            textShadow: "0 18px 60px rgba(0,0,0,0.7)",
          }}
        />

        <div
          style={{
            fontFamily: fonts.display,
            fontSize: 244,
            lineHeight: 1.02,
            opacity: circuitIn,
            transform: `scale(${interpolate(circuitIn, [0, 1], [2.3, 1])})`,
            transformOrigin: "left center",
            backgroundImage: foilGradient,
            backgroundSize: "300% 100%",
            backgroundPosition: `${shine}% 50%`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          CIRCUIT
        </div>

        <div
          style={{
            marginTop: 46,
            alignSelf: "flex-start",
            fontFamily: fonts.body,
            fontWeight: 600,
            fontSize: 34,
            letterSpacing: 5,
            color: colors.cream,
            border: `2px solid ${colors.gold}`,
            borderRadius: 9999,
            padding: "18px 44px",
            background: "rgba(245,197,66,0.08)",
            opacity: chipIn,
            transform: `translateY(${interpolate(chipIn, [0, 1], [40, 0])}px)`,
          }}
        >
          THE ULTIMATE TCG CARD SHOW
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
