// SeriesCard.tsx
// Animated intro card matching the Keychain thumbnail series spec
// (REMOTIONSPEC.md): dark ground, left-aligned headline with an accent
// "turn" line, a mock product screenshot right-of-centre under a ground
// gradient, a highlight box hugging real content, runtime badge, wordmark.
// Spec coordinates are 1280x720; everything here is that space scaled by
// 1.5 to the 1920x1080 canvas.

import React from 'react';
import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  staticFile,
} from 'remotion';
import { loadFont } from '@remotion/fonts';

const inter = 'Inter';
loadFont({
  family: inter,
  url: staticFile('fonts/inter-latin-500-normal.woff2'),
  weight: '500',
});
loadFont({
  family: inter,
  url: staticFile('fonts/inter-latin-700-normal.woff2'),
  weight: '700',
});

// Palette per spec
const GROUND = '#0e1114';
const ACCENT = '#FFD429';
const MUTED = '#8b9098';
const WORDMARK = '#6d737b';
const BADGE_TEXT = '#14171c';

// Mock purchasing UI palette (stands in for the screenshot)
const UI_BG = '#d8d5c9';
const UI_TEXT = '#6b6f66';
const UI_STRONG = '#3a3d35';

export type SeriesCardProps = {
  headlineLines: string[]; // white lines; the accent turn goes in accentLine
  accentLine: string; // the turn — only line in accent colour
  subLine: string;
  badgeText: string; // e.g. "4 MINUTES"
  // Optional real product screenshot (filename in public/). When set it
  // replaces the built-in mock purchasing UI on the right side.
  screenshotSrc?: string;
};

// One "recommended order" block of the mock purchasing screenshot.
const OrderBlock: React.FC<{
  rows: Array<[string, string]>;
  subtotal: string;
  showTabs?: boolean;
}> = ({ rows, subtotal, showTabs }) => (
  <div style={{ padding: '18px 30px 10px', fontFamily: inter, fontWeight: 500 }}>
    {showTabs ? (
      <div style={{ textAlign: 'right', fontSize: 15, color: UI_TEXT, marginBottom: 10 }}>
        <span style={{ borderBottom: `2px solid ${UI_STRONG}`, color: UI_STRONG, marginRight: 18 }}>
          Recommended
        </span>
        <span style={{ marginRight: 18 }}>Created</span>
        <span>Archive</span>
      </div>
    ) : null}
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginBottom: 16 }}>
      <div
        style={{
          width: 40,
          height: 32,
          borderRadius: 5,
          backgroundColor: '#2a2d31',
          color: '#d8d5c9',
          fontSize: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        🗑
      </div>
      <div
        style={{
          height: 32,
          padding: '0 18px',
          borderRadius: 5,
          backgroundColor: '#eceadf',
          color: UI_STRONG,
          fontSize: 16,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        Edit
      </div>
      <div
        style={{
          height: 32,
          padding: '0 18px',
          borderRadius: 5,
          backgroundColor: ACCENT,
          color: BADGE_TEXT,
          fontSize: 16,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        Create Order
      </div>
    </div>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 15,
        color: UI_TEXT,
        marginBottom: 8,
      }}
    >
      <span>Unit Price</span>
      <span>Item Total</span>
    </div>
    {rows.map(([price, total], i) => (
      <div
        key={i}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 16,
          color: UI_TEXT,
          padding: '9px 0',
        }}
      >
        <span style={{ borderBottom: '1px dotted #a8a698' }}>{price}</span>
        <span style={{ color: UI_STRONG }}>{total}</span>
      </div>
    ))}
    <div
      style={{
        textAlign: 'right',
        fontSize: 17,
        color: UI_STRONG,
        fontWeight: 700,
        padding: '12px 0 6px',
      }}
    >
      <span style={{ fontWeight: 500, color: UI_TEXT, marginRight: 14 }}>Subtotal</span>
      {subtotal}
    </div>
  </div>
);

export const SeriesCard: React.FC<SeriesCardProps> = ({
  headlineLines,
  accentLine,
  subLine,
  badgeText,
  screenshotSrc,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const rise = (delay: number) =>
    spring({ frame: frame - delay, fps, config: { damping: 200 }, durationInFrames: 16 });

  // Mock screenshot drifts in from the right and settles.
  const uiIn = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 20 });

  const line1In = rise(6);
  const line2In = rise(14);

  // The turn: accent line wipes on left-to-right.
  const accentWipe = interpolate(frame, [30, 46], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const subIn = interpolate(frame, [44, 56], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Highlight box snaps onto the recommended order right after the turn.
  const boxIn = spring({
    frame: frame - 52,
    fps,
    config: { damping: 16, mass: 0.7 },
    durationInFrames: 22,
  });
  // Gentle stroke glow so the box stays alive during the hold.
  const boxGlow = 0.35 + 0.2 * Math.sin(((frame - 74) / 55) * Math.PI * 2);

  const badgeIn = spring({
    frame: frame - 64,
    fps,
    config: { damping: 14, mass: 0.7 },
    durationInFrames: 20,
  });

  const wordmarkIn = interpolate(frame, [20, 34], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Exit: everything except the ground fades over the last 14 frames.
  const exit = interpolate(
    frame,
    [durationInFrames - 14, durationInFrames - 2],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const headlineStyle = (entrance: number): React.CSSProperties => ({
    fontSize: 105,
    fontWeight: 700,
    letterSpacing: -4.5,
    lineHeight: '117px',
    color: '#ffffff',
    opacity: entrance,
    transform: `translateY(${(1 - entrance) * 26}px)`,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: GROUND, fontFamily: inter }}>
      {/* Screenshot, full-bleed to the right edge (x=1920, no gap) */}
      <div
        style={{
          position: 'absolute',
          left: 700,
          top: 0,
          right: 0,
          bottom: 0,
          backgroundColor: UI_BG,
          opacity: uiIn * exit,
          transform: `translateX(${(1 - uiIn) * 60}px)`,
          overflow: 'hidden',
        }}
      >
        {screenshotSrc ? (
          <Img
            src={staticFile(screenshotSrc)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'right top' }}
          />
        ) : null}
        {screenshotSrc ? null : (
        <div style={{ position: 'absolute', left: 340, top: 45, width: 850 }}>
          <OrderBlock
            showTabs
            rows={[
              ['$1.02 /lb', '$306.00'],
              ['$1.68 /lb', '$504.00'],
              ['$1.77 /lb', '$442.50'],
              ['$1.91 /lb', '$382.00'],
              ['$2.24 /lb', '$672.00'],
              ['$3.12 /lb', '$636.00'],
            ]}
            subtotal="$ 2,942.50"
          />
        </div>
        )}
        {screenshotSrc ? null : (
        <div style={{ position: 'absolute', left: 340, top: 640, width: 850 }}>
          <OrderBlock
            rows={[
              ['$1.45 /lb', '$5,075.00'],
              ['$1.21 /lb', '$3,267.00'],
              ['$1.48 /lb', '$4,736.00'],
              ['$1.27 /lb', '$3,175.00'],
            ]}
            subtotal="$ 16,253.00"
          />
        </div>
        )}
      </div>

      {/* Flat ground panel over the left 43% — kills the seam */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 834,
          height: '100%',
          backgroundColor: GROUND,
        }}
      />
      {/* Ground gradient x 834 -> 1920, opacity 1 / .58 / .12 / 0 */}
      <div
        style={{
          position: 'absolute',
          left: 834,
          top: 0,
          width: 1086,
          height: '100%',
          backgroundImage: `linear-gradient(90deg,
            rgba(14,17,20,1) 0%,
            rgba(14,17,20,0.58) 22%,
            rgba(14,17,20,0.12) 60%,
            rgba(14,17,20,0) 100%)`,
        }}
      />

      {/* Highlight box hugging the first recommended order */}
      <div
        style={{
          position: 'absolute',
          left: 1030,
          top: 92,
          width: 872,
          height: 510,
          borderRadius: 13.5,
          border: `7.5px solid ${ACCENT}`,
          backgroundColor: 'rgba(255, 212, 41, 0.08)',
          boxShadow: `0 0 ${26 * boxGlow}px rgba(255, 212, 41, ${boxGlow})`,
          opacity: Math.min(boxIn * 1.3, 1) * exit,
          transform: `scale(${1.12 - boxIn * 0.12})`,
        }}
      />

      {/* Text block, x = 108 */}
      <div style={{ position: 'absolute', left: 108, top: 285, opacity: exit }}>
        {headlineLines.map((line, i) => (
          <div key={i} style={headlineStyle(i === 0 ? line1In : line2In)}>
            {line}
          </div>
        ))}
        <div
          style={{
            fontSize: 99,
            fontWeight: 700,
            letterSpacing: -3.75,
            lineHeight: '124px',
            color: ACCENT,
            clipPath: `inset(0 ${100 - accentWipe}% 0 0)`,
          }}
        >
          {accentLine}
        </div>
        <div
          style={{
            fontSize: 43.5,
            fontWeight: 500,
            color: MUTED,
            marginTop: 26,
            opacity: subIn,
          }}
        >
          {subLine}
        </div>
      </div>

      {/* Runtime badge */}
      <div
        style={{
          position: 'absolute',
          left: 108,
          top: 830,
          height: 66,
          minWidth: 225,
          padding: '0 28px',
          borderRadius: 9,
          backgroundColor: ACCENT,
          color: BADGE_TEXT,
          fontSize: 28.5,
          fontWeight: 700,
          letterSpacing: 0.75,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: Math.min(badgeIn * 1.3, 1) * exit,
          transform: `scale(${0.85 + badgeIn * 0.15})`,
          transformOrigin: 'left center',
        }}
      >
        {badgeText}
      </div>

      {/* Wordmark */}
      <div
        style={{
          position: 'absolute',
          left: 108,
          top: 968,
          fontSize: 33,
          fontWeight: 700,
          color: WORDMARK,
          opacity: wordmarkIn * exit,
        }}
      >
        keychain
      </div>
    </AbsoluteFill>
  );
};
