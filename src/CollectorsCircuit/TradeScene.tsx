import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Backdrop } from "./Backdrop";
import { colors, foilGradient, fonts } from "./theme";

const TICKER_TEXT =
  "SLABS • SINGLES • PACKS • BREAKS • GRADED • VINTAGE • DEALS • ";

const TickerRow: React.FC<{ y: number; speed: number }> = ({ y, speed }) => {
  const frame = useCurrentFrame();
  const offset = ((frame * speed) % 1900) - 1900;

  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        whiteSpace: "nowrap",
        fontFamily: fonts.display,
        fontSize: 92,
        color: "transparent",
        WebkitTextStroke: `2px ${colors.faint}`,
        transform: `translateX(${speed > 0 ? offset : -offset - 1900}px)`,
      }}
    >
      {TICKER_TEXT.repeat(6)}
    </div>
  );
};

type WordSpec = {
  text: string;
  delay: number;
  x: number;
  foil: boolean;
  color: string;
};

const WORDS: WordSpec[] = [
  { text: "BUY", delay: 4, x: 0, foil: false, color: colors.cream },
  { text: "SELL", delay: 18, x: 96, foil: true, color: colors.gold },
  { text: "TRADE", delay: 32, x: 192, foil: false, color: colors.red },
];

const SlamWord: React.FC<{ spec: WordSpec }> = ({ spec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - spec.delay,
    fps,
    config: { damping: 12, stiffness: 170, mass: 0.7 },
  });
  const scale = interpolate(enter, [0, 1], [2.6, 1]);
  const ghost = (1 - enter) * 14;

  const base: React.CSSProperties = {
    fontFamily: fonts.display,
    fontSize: 236,
    lineHeight: 0.94,
    transform: `skewX(-8deg)`,
    letterSpacing: 2,
  };

  return (
    <div
      style={{
        position: "relative",
        marginLeft: spec.x,
        opacity: enter,
        transform: `scale(${scale})`,
        transformOrigin: "left bottom",
      }}
    >
      {/* Chromatic ghosts, visible only during the slam */}
      <div
        style={{
          ...base,
          position: "absolute",
          left: -ghost,
          top: 0,
          color: colors.blue,
          opacity: (1 - enter) * 0.7,
        }}
      >
        {spec.text}
      </div>
      <div
        style={{
          ...base,
          position: "absolute",
          left: ghost,
          top: 0,
          color: colors.red,
          opacity: (1 - enter) * 0.7,
        }}
      >
        {spec.text}
      </div>
      <div
        style={
          spec.foil
            ? {
                ...base,
                backgroundImage: foilGradient,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }
            : {
                ...base,
                color: spec.color,
                textShadow: `0 0 60px ${spec.color}55`,
              }
        }
      >
        {spec.text}
      </div>
    </div>
  );
};

export const TradeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const subIn = spring({ frame: frame - 58, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill>
      <Backdrop id="trade" spotlightY="46%" />

      <AbsoluteFill style={{ transform: "rotate(-5deg)" }}>
        <TickerRow y={230} speed={4} />
        <TickerRow y={890} speed={-3} />
        <TickerRow y={1560} speed={5} />
      </AbsoluteFill>

      {/* Staircase word stack, left-anchored */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          paddingLeft: 96,
          transform: "rotate(-3deg)",
          gap: 10,
        }}
      >
        {WORDS.map((spec) => (
          <SlamWord key={spec.text} spec={spec} />
        ))}

        <div
          style={{
            marginTop: 66,
            display: "flex",
            alignItems: "center",
            gap: 24,
            opacity: subIn,
            transform: `translateX(${interpolate(subIn, [0, 1], [-50, 0])}px)`,
          }}
        >
          <div style={{ width: 76, height: 4, background: colors.gold }} />
          <div
            style={{
              fontFamily: fonts.body,
              fontWeight: 600,
              fontSize: 31,
              letterSpacing: 3,
              color: colors.cream,
            }}
          >
            VENDORS & COLLECTORS UNDER ONE ROOF
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
