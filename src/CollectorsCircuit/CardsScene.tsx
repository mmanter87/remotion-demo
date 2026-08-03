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

type CardSpec = {
  name: string;
  accent: string;
  accent2: string;
  rotate: number;
  x: number;
  delay: number;
};

// Center card renders last so it sits on top of the fan.
const CARDS: CardSpec[] = [
  {
    name: "POKÉMON",
    accent: colors.yellow,
    accent2: colors.orange,
    rotate: -14,
    x: -250,
    delay: 6,
  },
  {
    name: "SPORTS",
    accent: colors.blue,
    accent2: colors.cyan,
    rotate: 14,
    x: 250,
    delay: 14,
  },
  {
    name: "ONE PIECE",
    accent: colors.red,
    accent2: colors.redLight,
    rotate: 0,
    x: 0,
    delay: 22,
  },
];

const HoloCard: React.FC<{ spec: CardSpec }> = ({ spec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - spec.delay,
    fps,
    config: { damping: 15, stiffness: 120, mass: 0.9 },
  });
  const y = interpolate(enter, [0, 1], [900, 0]);
  const rotate = interpolate(enter, [0, 1], [spec.rotate * 2.2, spec.rotate]);

  const shineX = interpolate(frame, [spec.delay + 22, spec.delay + 60], [-260, 520], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        width: 400,
        height: 560,
        borderRadius: 26,
        border: `4px solid ${spec.accent}`,
        background: "linear-gradient(160deg, #1b1b36 0%, #0c0c1a 100%)",
        transform: `translate(${spec.x}px, ${y}px) rotate(${rotate}deg)`,
        boxShadow: `0 30px 80px rgba(0,0,0,0.65), 0 0 60px ${spec.accent}33`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 32,
      }}
    >
      <div
        style={{
          alignSelf: "flex-start",
          fontFamily: fonts.body,
          fontWeight: 800,
          fontSize: 24,
          letterSpacing: 4,
          color: spec.accent,
          border: `2px solid ${spec.accent}`,
          borderRadius: 9999,
          padding: "6px 18px",
        }}
      >
        TCG
      </div>

      <div
        style={{
          width: 210,
          height: 210,
          borderRadius: 9999,
          background: `radial-gradient(circle at 35% 30%, ${spec.accent2}, ${spec.accent} 70%)`,
          boxShadow: `0 0 80px ${spec.accent}88`,
        }}
      />

      <div
        style={{
          fontFamily: fonts.display,
          fontSize: 56,
          color: colors.white,
          letterSpacing: 2,
        }}
      >
        {spec.name}
      </div>

      {/* Holo shine sweep */}
      <div
        style={{
          position: "absolute",
          top: -150,
          left: 0,
          width: 110,
          height: 900,
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
          transform: `translateX(${shineX}px) rotate(18deg)`,
        }}
      />
    </div>
  );
};

export const CardsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headIn = spring({ frame, fps, config: { damping: 200 } });
  const captionIn = spring({
    frame: frame - 46,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill>
      <Backdrop glowA={colors.blue} glowB={colors.red} />
      <Sparkles seed="cards" count={20} />

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 190 }}>
        <div
          style={{
            textAlign: "center",
            lineHeight: 1,
            opacity: headIn,
            transform: `translateY(${interpolate(headIn, [0, 1], [-60, 0])}px)`,
          }}
        >
          <div
            style={{
              fontFamily: fonts.display,
              fontSize: 110,
              color: colors.white,
            }}
          >
            EVERY GAME.
          </div>
          <div
            style={{
              fontFamily: fonts.display,
              fontSize: 110,
              background: `linear-gradient(120deg, ${colors.yellow}, ${colors.orange})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            EVERY GRAIL.
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", paddingTop: 200 }}
      >
        {CARDS.map((spec) => (
          <HoloCard key={spec.name} spec={spec} />
        ))}
      </AbsoluteFill>

      <AbsoluteFill
        style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 170 }}
      >
        <div
          style={{
            fontFamily: fonts.body,
            fontWeight: 600,
            fontSize: 38,
            color: colors.muted,
            opacity: captionIn,
            transform: `translateY(${interpolate(captionIn, [0, 1], [40, 0])}px)`,
          }}
        >
          Pokémon&nbsp;&nbsp;•&nbsp;&nbsp;One Piece&nbsp;&nbsp;•&nbsp;&nbsp;Sports&nbsp;&nbsp;•&nbsp;&nbsp;& more
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
