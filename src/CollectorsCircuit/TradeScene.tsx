import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Backdrop } from "./Backdrop";
import { colors, fonts } from "./theme";

const TICKER_TEXT =
  "SLABS • SINGLES • PACKS • BREAKS • GRADED • VINTAGE • DEALS • ";

const TickerRow: React.FC<{ y: number; speed: number }> = ({ y, speed }) => {
  const frame = useCurrentFrame();
  // Loop the ticker seamlessly by wrapping the offset at half the doubled text.
  const offset = ((frame * speed) % 1800) - 1800;

  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        whiteSpace: "nowrap",
        fontFamily: fonts.display,
        fontSize: 84,
        color: colors.white,
        opacity: 0.07,
        transform: `translateX(${speed > 0 ? offset : -offset - 1800}px)`,
      }}
    >
      {TICKER_TEXT.repeat(6)}
    </div>
  );
};

const WORDS = [
  { text: "BUY", color: colors.yellow, delay: 4 },
  { text: "SELL", color: colors.teal, delay: 18 },
  { text: "TRADE", color: colors.red, delay: 32 },
];

export const TradeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const subIn = spring({ frame: frame - 56, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill>
      <Backdrop glowA={colors.teal} glowB={colors.yellow} />

      <AbsoluteFill style={{ transform: "rotate(-4deg)" }}>
        <TickerRow y={260} speed={4} />
        <TickerRow y={900} speed={-3} />
        <TickerRow y={1540} speed={5} />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 0,
        }}
      >
        {WORDS.map((word) => {
          const enter = spring({
            frame: frame - word.delay,
            fps,
            config: { damping: 12, stiffness: 170, mass: 0.7 },
          });
          const scale = interpolate(enter, [0, 1], [3, 1]);
          return (
            <div
              key={word.text}
              style={{
                fontFamily: fonts.display,
                fontSize: 250,
                lineHeight: 0.95,
                color: word.color,
                opacity: enter,
                transform: `scale(${scale})`,
                textShadow: `0 0 70px ${word.color}66`,
              }}
            >
              {word.text}
            </div>
          );
        })}

        <div
          style={{
            marginTop: 60,
            fontFamily: fonts.body,
            fontWeight: 600,
            fontSize: 42,
            color: colors.white,
            opacity: subIn,
            transform: `translateY(${interpolate(subIn, [0, 1], [40, 0])}px)`,
          }}
        >
          Vendors & collectors under one roof.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
