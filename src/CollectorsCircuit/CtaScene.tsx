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
import { colors, foilGradient, fonts } from "./theme";

export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const panelIn = spring({
    frame: frame - 2,
    fps,
    config: { damping: 15, stiffness: 130, mass: 0.9 },
  });
  const lineIn = spring({ frame: frame - 18, fps, config: { damping: 200 } });
  const buttonIn = spring({
    frame: frame - 30,
    fps,
    config: { damping: 13, stiffness: 150, mass: 0.8 },
  });
  const footIn = spring({ frame: frame - 48, fps, config: { damping: 200 } });

  const pulse = 1 + Math.sin(frame / 6) * 0.02;
  const shine = interpolate(frame, [24, 110], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Backdrop id="cta" rays spotlightY="42%" />
      <Sparkles seed="cta" count={38} color={colors.gold} />

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 54,
          padding: 60,
        }}
      >
        {/* Gold-foil framed panel */}
        <div
          style={{
            borderRadius: 40,
            padding: 4,
            background: foilGradient,
            boxShadow: "0 40px 120px rgba(0,0,0,0.7), 0 0 80px rgba(245,197,66,0.18)",
            opacity: panelIn,
            transform: `scale(${interpolate(panelIn, [0, 1], [0.8, 1])})`,
          }}
        >
          <div
            style={{
              borderRadius: 36,
              background: "#100D08",
              padding: "72px 84px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 40,
            }}
          >
            <div style={{ textAlign: "center", lineHeight: 1 }}>
              <div
                style={{
                  fontFamily: fonts.display,
                  fontSize: 112,
                  color: colors.cream,
                }}
              >
                COLLECTORS
              </div>
              <div
                style={{
                  fontFamily: fonts.display,
                  fontSize: 112,
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
            </div>

            {/* Diamond divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ width: 90, height: 2, background: colors.goldDeep }} />
              <div
                style={{
                  width: 13,
                  height: 13,
                  background: colors.gold,
                  transform: "rotate(45deg)",
                }}
              />
              <div style={{ width: 90, height: 2, background: colors.goldDeep }} />
            </div>

            <div
              style={{
                fontFamily: fonts.body,
                fontWeight: 500,
                fontSize: 46,
                color: colors.cream,
                opacity: lineIn,
                transform: `translateY(${interpolate(lineIn, [0, 1], [30, 0])}px)`,
              }}
            >
              Your next grail is waiting.
            </div>

            <div
              style={{
                fontFamily: fonts.display,
                fontSize: 54,
                letterSpacing: 2,
                color: "#0B0A08",
                background: foilGradient,
                borderRadius: 9999,
                padding: "26px 62px",
                opacity: buttonIn,
                transform: `scale(${interpolate(buttonIn, [0, 1], [0.4, 1]) * pulse})`,
                boxShadow: "0 0 70px rgba(245,197,66,0.4)",
              }}
            >
              COLLECTORSCIRCUIT.COM
            </div>
          </div>
        </div>

        <div
          style={{
            fontFamily: fonts.body,
            fontWeight: 500,
            fontSize: 30,
            letterSpacing: 6,
            color: colors.muted,
            opacity: footIn,
            transform: `translateY(${interpolate(footIn, [0, 1], [30, 0])}px)`,
          }}
        >
          FOLLOW FOR SHOW DATES + VENDOR DROPS
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
