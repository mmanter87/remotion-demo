// OutroCard.tsx
// Closing CTA card for Keychain module demo videos: invites the viewer to
// book time over email to see the full suite. Shares the brand system
// (Poppins, navy/gold, shimmer, gold dust) with ModuleHeadlineCard.
// Duration: designed for ~150 frames (5s) at 30fps. Holds on the final
// frame instead of fading out, since it ends the video.

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
  gradientText,
  GoldParticles,
  ShimmerLine,
} from './ModuleHeadlineCard';

export type OutroCardProps = {
  headlineLine1: string; // e.g. "See the Full"
  headlineLine2: string; // e.g. "Keychain Suite"
  body: string; // one-line value statement
  ctaLabel: string; // line above the email pill
  email: string;
};

export const OutroCard: React.FC<OutroCardProps> = ({
  headlineLine1,
  headlineLine2,
  body,
  ctaLabel,
  email,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const tagIn = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 15 });
  const line1In = spring({
    frame: frame - 6,
    fps,
    config: { damping: 200 },
    durationInFrames: 18,
  });
  const line2In = spring({
    frame: frame - 14,
    fps,
    config: { damping: 200 },
    durationInFrames: 18,
  });

  // Single diagonal shimmer pass over the headline once it lands.
  const shimmer1 = interpolate(frame, [32, 60], [130, -30], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shimmer2 = interpolate(frame, [36, 64], [130, -30], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const ruleWidth =
    spring({
      frame: frame - 24,
      fps,
      config: { damping: 200 },
      durationInFrames: 20,
    }) * 180;

  const bodyOpacity = interpolate(frame, [30, 44], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bodyTracking = interpolate(frame, [30, 50], [6, 0.5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const ctaOpacity = interpolate(frame, [44, 56], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Email pill pops in on a spring, then a highlight band sweeps across it.
  const pillIn = spring({
    frame: frame - 50,
    fps,
    config: { damping: 14, mass: 0.8 },
    durationInFrames: 26,
  });
  const pillShimmer = interpolate(frame, [78, 108], [130, -30], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // Gentle breathing glow so the CTA stays alive while the card holds.
  const glow =
    0.25 + 0.15 * Math.sin(((frame - 60) / 50) * Math.PI * 2);

  // Slow push-in on the text group only; no exit fade on the final card.
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.03], {
    extrapolateRight: 'clamp',
  });

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
      <AbsoluteFill
        style={{
          backgroundImage:
            'radial-gradient(ellipse 75% 70% at 50% 48%, rgba(26,29,41,0) 60%, rgba(26,29,41,0.10) 100%)',
        }}
      />
      <div
        style={{
          textAlign: 'center',
          maxWidth: 1400,
          transform: `scale(${scale})`,
        }}
      >
        {/* KeychainOS tag */}
        <div
          style={{
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: 0.5,
            marginBottom: 40,
            opacity: tagIn,
            transform: `translateY(${(1 - tagIn) * 12}px)`,
          }}
        >
          <span style={{ color: '#1A1D29' }}>Keychain</span>
          <span style={{ color: '#C9A227' }}>OS</span>
        </div>

        <ShimmerLine
          text={headlineLine1}
          gradient="linear-gradient(90deg, #1A1D29 0%, #C9A227 100%)"
          entrance={line1In}
          shimmerPos={shimmer1}
        />
        <ShimmerLine
          text={headlineLine2}
          gradient="linear-gradient(90deg, #C9A227 0%, #7A6B3D 50%, #1A1D29 100%)"
          entrance={line2In}
          shimmerPos={shimmer2}
        />

        {/* Gold hairline divider */}
        <div
          style={{
            height: 3,
            width: ruleWidth,
            margin: '26px auto 0',
            borderRadius: 2,
            backgroundImage:
              'linear-gradient(90deg, rgba(201,162,39,0) 0%, #C9A227 50%, rgba(201,162,39,0) 100%)',
          }}
        />

        {/* Value statement */}
        <div
          style={{
            fontSize: 29,
            fontWeight: 500,
            color: '#2A2D3A',
            marginTop: 24,
            opacity: bodyOpacity,
            letterSpacing: bodyTracking,
          }}
        >
          {body}
        </div>

        {/* CTA label */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 500,
            color: '#6B6E7B',
            marginTop: 48,
            opacity: ctaOpacity,
          }}
        >
          {ctaLabel}
        </div>

        {/* Email pill */}
        <div
          style={{
            position: 'relative',
            display: 'inline-block',
            marginTop: 20,
            padding: '22px 56px',
            borderRadius: 999,
            backgroundColor: '#1A1D29',
            border: '2px solid #C9A227',
            boxShadow: `0 0 ${30 + glow * 40}px rgba(201, 162, 39, ${glow})`,
            opacity: Math.min(pillIn * 1.4, 1),
            transform: `scale(${0.8 + pillIn * 0.2})`,
            overflow: 'hidden',
          }}
        >
          <span
            style={{
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: 0.5,
              color: '#FFFFFF',
            }}
          >
            {email.split('@')[0]}
            <span style={{ color: '#C9A227' }}>@{email.split('@')[1]}</span>
          </span>
          {/* Highlight band sweeping across the pill */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'linear-gradient(100deg, rgba(255,255,255,0) 42%, rgba(255,248,215,0.22) 50%, rgba(255,255,255,0) 58%)',
              backgroundSize: '250% 100%',
              backgroundPosition: `${pillShimmer}% 0%`,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
