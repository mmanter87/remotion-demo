// AuditFunnelOpener.tsx
// 8-second top-of-funnel opener for the audit readiness / food safety /
// forms training / traceability video. Uses the same brand formation as
// ModuleHeadlineCard (ivory gradient drift, gold particles, shimmer
// headline lines, gold hairline, push-in, exit fade) but deliberately
// carries no Keychain branding — the brand only appears on the OutroCard.
// Duration: designed for 240 frames (8s) at 30fps.

import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from 'remotion';
import {
  fontFamily,
  GoldParticles,
  ShimmerLine,
} from './ModuleHeadlineCard';

export type AuditFunnelOpenerProps = {
  kicker: string; // small muted label at the top, e.g. "AUDIT READINESS"
  topics: string; // closing topics line, e.g. "Audit Readiness · Food Safety · …"
};

// The hook, staged as beats. Each line lands, shimmers once, and stays
// while the next arrives — the pile-up mirrors the auditor's chain of asks.
const HOOK_LINES: Array<{
  text: string;
  delay: number; // frame the entrance spring starts
  fontSize: number;
  gradient: string;
}> = [
  {
    text: "Your auditor doesn't ask for a record.",
    delay: 14,
    fontSize: 64,
    gradient: 'linear-gradient(90deg, #1A1D29 0%, #2A2D3A 100%)',
  },
  {
    text: 'They ask for one.',
    delay: 62,
    fontSize: 88,
    gradient: 'linear-gradient(90deg, #1A1D29 0%, #C9A227 100%)',
  },
  {
    text: 'Then the one behind it.',
    delay: 112,
    fontSize: 64,
    gradient: 'linear-gradient(90deg, #2A2D3A 0%, #7A6B3D 100%)',
  },
  {
    text: 'And then the one behind that.',
    delay: 152,
    fontSize: 64,
    gradient: 'linear-gradient(90deg, #C9A227 0%, #7A6B3D 50%, #1A1D29 100%)',
  },
];

export const AuditFunnelOpener: React.FC<AuditFunnelOpenerProps> = ({
  kicker,
  topics,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const kickerIn = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 15,
  });

  // Gold hairline draws once the full hook has landed.
  const ruleWidth =
    spring({
      frame: frame - 186,
      fps,
      config: { damping: 200 },
      durationInFrames: 20,
    }) * 180;

  const topicsOpacity = interpolate(frame, [192, 208], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // Topics tracking settles from airy to normal as the line fades in.
  const topicsTracking = interpolate(frame, [192, 214], [6, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Exit: scale up slightly and fade so the opener hands off cleanly to
  // whatever runs next in the edit.
  const exit = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames - 1],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const pushIn = interpolate(frame, [0, durationInFrames], [1, 1.04], {
    extrapolateRight: 'clamp',
  });
  const scale = pushIn * (1 + exit * 0.04);

  const bgDrift = interpolate(frame, [0, durationInFrames], [0, 45], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#FFFFFF',
        fontFamily,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage:
            'linear-gradient(120deg, #FFFFFF 0%, #EFEBE3 60%, rgba(201, 162, 39, 0.14) 100%)',
          backgroundSize: '180% 180%',
          backgroundPosition: `${bgDrift}% ${bgDrift}%`,
        }}
      />
      <GoldParticles />
      {/* Soft vignette keeps the eye centered on the type. */}
      <AbsoluteFill
        style={{
          backgroundImage:
            'radial-gradient(ellipse 75% 70% at 50% 48%, rgba(26,29,41,0) 60%, rgba(26,29,41,0.10) 100%)',
        }}
      />
      <div
        style={{
          textAlign: 'center',
          maxWidth: 1500,
          transform: `scale(${scale})`,
          opacity: 1 - exit,
        }}
      >
        {/* Neutral kicker — no brand until the end card */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 9,
            color: '#6B6E7B',
            marginBottom: 44,
            opacity: kickerIn,
            transform: `translateY(${(1 - kickerIn) * 12}px)`,
          }}
        >
          {kicker}
        </div>

        {HOOK_LINES.map(({ text, delay, fontSize, gradient }, i) => {
          const entrance = spring({
            frame: frame - delay,
            fps,
            config: { damping: 200 },
            durationInFrames: 18,
          });
          // One specular pass per line, right after it lands.
          const shimmerPos = interpolate(
            frame,
            [delay + 18, delay + 46],
            [130, -30],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );
          return (
            <div key={i} style={{ marginTop: i === 0 ? 0 : 10 }}>
              <ShimmerLine
                text={text}
                gradient={gradient}
                entrance={entrance}
                shimmerPos={shimmerPos}
                fontSize={fontSize}
              />
            </div>
          );
        })}

        {/* Gold hairline divider */}
        <div
          style={{
            height: 3,
            width: ruleWidth,
            margin: '30px auto 0',
            borderRadius: 2,
            backgroundImage:
              'linear-gradient(90deg, rgba(201,162,39,0) 0%, #C9A227 50%, rgba(201,162,39,0) 100%)',
          }}
        />

        {/* Topics covered by the video */}
        <div
          style={{
            fontSize: 29,
            fontWeight: 500,
            color: '#2A2D3A',
            marginTop: 26,
            opacity: topicsOpacity,
            letterSpacing: topicsTracking,
          }}
        >
          {topics}
        </div>
      </div>
    </AbsoluteFill>
  );
};
