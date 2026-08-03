import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Backdrop } from "./Backdrop";
import { BoltEmblem, StarGlyph, SwordsEmblem, TrophyEmblem } from "./emblems";
import { StaggerText } from "./StaggerText";
import { colors, foilGradient, fonts, holoGradient } from "./theme";

type CardSpec = {
  name: string;
  accent: string;
  setNumber: string;
  Emblem: React.FC<{ size: number; color: string }>;
  rotate: number;
  x: number;
  delay: number;
  scale: number;
  phase: number;
};

// Center card renders last so it sits on top of the fan.
const CARDS: CardSpec[] = [
  {
    name: "POKÉMON",
    accent: colors.yellow,
    setNumber: "001/151",
    Emblem: BoltEmblem,
    rotate: -16,
    x: -238,
    delay: 8,
    scale: 1,
    phase: 0,
  },
  {
    name: "SPORTS",
    accent: colors.blue,
    setNumber: "023/100",
    Emblem: TrophyEmblem,
    rotate: 16,
    x: 238,
    delay: 16,
    scale: 1,
    phase: 2.2,
  },
  {
    name: "ONE PIECE",
    accent: colors.red,
    setNumber: "051/121",
    Emblem: SwordsEmblem,
    rotate: -2,
    x: 0,
    delay: 24,
    scale: 1.06,
    phase: 4.1,
  },
];

const HoloCard: React.FC<{ spec: CardSpec }> = ({ spec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { Emblem } = spec;

  const enter = spring({
    frame: frame - spec.delay,
    fps,
    config: { damping: 15, stiffness: 120, mass: 0.9 },
  });
  const y = interpolate(enter, [0, 1], [950, 0]);
  const rotate = interpolate(enter, [0, 1], [spec.rotate * 2.2, spec.rotate]);
  const bob = Math.sin(frame / 22 + spec.phase) * 7;
  const tilt = Math.sin(frame / 34 + spec.phase) * 7;

  const shineX = interpolate(
    frame,
    [spec.delay + 26, spec.delay + 58],
    [-280, 560],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        position: "absolute",
        transform: `translate(${spec.x}px, ${y + bob}px) rotate(${rotate}deg) scale(${spec.scale}) perspective(1200px) rotateY(${tilt}deg)`,
      }}
    >
      {/* Rainbow holo foil border — authentic on a card, banned as page wash */}
      <div
        style={{
          width: 400,
          height: 560,
          borderRadius: 24,
          padding: 9,
          background: holoGradient(frame * 3 + spec.phase * 60),
          boxShadow: `0 34px 90px rgba(0,0,0,0.7), 0 0 54px ${spec.accent}33`,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 16,
            background: "linear-gradient(165deg, #17130B 0%, #0C0A07 100%)",
            padding: 22,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                fontFamily: fonts.display,
                fontSize: 40,
                color: colors.cream,
                letterSpacing: 1,
              }}
            >
              {spec.name}
            </div>
            <div
              style={{
                fontFamily: fonts.body,
                fontWeight: 600,
                fontSize: 19,
                letterSpacing: 2,
                color: spec.accent,
                border: `1.5px solid ${spec.accent}`,
                borderRadius: 8,
                padding: "4px 10px",
              }}
            >
              HOLO
            </div>
          </div>

          {/* Art window: ray burst + halftone + emblem */}
          <div
            style={{
              flex: 1,
              borderRadius: 12,
              border: `1.5px solid ${spec.accent}55`,
              overflow: "hidden",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: 900,
                height: 900,
                background: `repeating-conic-gradient(from ${frame * 0.6 + spec.phase * 40}deg, ${spec.accent}1A 0deg 9deg, transparent 9deg 20deg)`,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "radial-gradient(circle, rgba(245,239,226,0.06) 1.2px, transparent 1.3px)",
                backgroundSize: "12px 12px",
              }}
            />
            <Emblem size={148} color={spec.accent} />
          </div>

          {/* Footer: rarity stars + set number */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              {[0, 1, 2].map((s) => (
                <StarGlyph key={s} size={24} color={colors.gold} />
              ))}
            </div>
            <div
              style={{
                fontFamily: fonts.body,
                fontWeight: 500,
                fontSize: 22,
                letterSpacing: 2,
                color: colors.muted,
              }}
            >
              {spec.setNumber}
            </div>
          </div>
        </div>

        {/* Gloss sweep on entrance */}
        <div
          style={{
            position: "absolute",
            top: -170,
            left: 0,
            width: 120,
            height: 940,
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.32), transparent)",
            transform: `translateX(${shineX}px) rotate(18deg)`,
          }}
        />
      </div>
    </div>
  );
};

export const CardsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const grailIn = spring({
    frame: frame - 14,
    fps,
    config: { damping: 14, stiffness: 150, mass: 0.8 },
  });
  const captionIn = spring({
    frame: frame - 50,
    fps,
    config: { damping: 200 },
  });

  return (
    <AbsoluteFill>
      <Backdrop id="cards" spotlightY="58%" />

      {/* Headline: top-left poster block */}
      <AbsoluteFill
        style={{ paddingTop: 150, paddingLeft: 84, transform: "rotate(-2deg)" }}
      >
        <StaggerText
          text="EVERY GAME."
          delay={2}
          perChar={1.1}
          style={{
            justifyContent: "flex-start",
            fontFamily: fonts.display,
            fontSize: 112,
            lineHeight: 1.04,
            color: colors.cream,
          }}
        />
        <div
          style={{
            fontFamily: fonts.display,
            fontSize: 112,
            lineHeight: 1.04,
            opacity: grailIn,
            transform: `scale(${interpolate(grailIn, [0, 1], [1.8, 1])})`,
            transformOrigin: "left center",
            backgroundImage: foilGradient,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          EVERY GRAIL.
        </div>
      </AbsoluteFill>

      {/* Card fan, weighted low */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 330,
        }}
      >
        {CARDS.map((spec) => (
          <HoloCard key={spec.name} spec={spec} />
        ))}
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 120,
        }}
      >
        <div
          style={{
            fontFamily: fonts.body,
            fontWeight: 500,
            fontSize: 31,
            letterSpacing: 5,
            color: colors.muted,
            opacity: captionIn,
            transform: `translateY(${interpolate(captionIn, [0, 1], [40, 0])}px)`,
          }}
        >
          POKÉMON • ONE PIECE • SPORTS • + MORE
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
