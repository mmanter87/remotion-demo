// ModuleHeadlineCard.tsx
// Animated brand-reveal card for Keychain module demo videos.
// Usage: register in Root.tsx as a <Composition>, pass moduleLine1 / moduleLine2 / subtitle as props.
// Duration: designed for ~90 frames (3s) at 30fps, but reads fine trimmed shorter.

import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  staticFile,
  random,
} from 'remotion';
import { loadFont } from '@remotion/fonts';

// Poppins is bundled in public/fonts so renders work without network access.
const fontFamily = 'Poppins';
loadFont({
  family: fontFamily,
  url: staticFile('fonts/poppins-latin-500-normal.woff2'),
  weight: '500',
});
loadFont({
  family: fontFamily,
  url: staticFile('fonts/poppins-latin-700-normal.woff2'),
  weight: '700',
});

export type ModuleHeadlineCardProps = {
  moduleLine1: string; // e.g. "Keychain AI"
  moduleLine2: string; // e.g. "Module Overview"
  subtitle: string; // module-specific value line
};

// Shared gradient text style. Uses background-clip so the same gradient
// technique we used in the static PNG versions translates directly.
const gradientText = (gradient: string): React.CSSProperties => ({
  backgroundImage: gradient,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  WebkitTextFillColor: 'transparent',
  display: 'inline-block',
});

// A title line with a specular "shimmer" band that sweeps across the
// gradient text once. The shimmer is a second copy of the text stacked on
// top, clipped to a moving white-gold highlight gradient.
const ShimmerLine: React.FC<{
  text: string;
  gradient: string;
  entrance: number; // 0..1 spring
  shimmerPos: number; // background-position percentage of the highlight band
}> = ({ text, gradient, entrance, shimmerPos }) => {
  const lineStyle: React.CSSProperties = {
    fontSize: 92,
    fontWeight: 700,
    lineHeight: 1.15,
  };
  return (
    <div
      style={{
        position: 'relative',
        opacity: entrance,
        transform: `translateY(${(1 - entrance) * 26}px)`,
        filter: `blur(${(1 - entrance) * 10}px)`,
      }}
    >
      <div style={{ ...lineStyle, ...gradientText(gradient) }}>{text}</div>
      <div
        aria-hidden
        style={{
          ...lineStyle,
          ...gradientText(
            'linear-gradient(100deg, rgba(255,255,255,0) 42%, rgba(255,248,215,0.9) 50%, rgba(255,255,255,0) 58%)'
          ),
          position: 'absolute',
          inset: 0,
          backgroundSize: '250% 100%',
          backgroundPosition: `${shimmerPos}% 0%`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

// Slow-drifting gold dust in the background. Deterministic: all positions
// derive from remotion's seeded random().
const GoldParticles: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, height } = useVideoConfig();

  return (
    <AbsoluteFill>
      {Array.from({ length: 18 }).map((_, i) => {
        const x = random(`px-${i}`) * 100;
        const size = 3 + random(`ps-${i}`) * 6;
        const startY = 20 + random(`py-${i}`) * 90; // vh, some start below frame
        const rise = 8 + random(`pr-${i}`) * 14; // vh drifted over full duration
        const y =
          startY -
          interpolate(frame, [0, durationInFrames], [0, rise], {
            extrapolateRight: 'clamp',
          });
        const sway = Math.sin((frame / 45) * Math.PI * 2 + i * 1.7) * 0.6;
        const maxOpacity = 0.14 + random(`po-${i}`) * 0.22;
        const opacity = interpolate(
          frame,
          [0, 18, durationInFrames - 16, durationInFrames - 1],
          [0, maxOpacity, maxOpacity, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x + sway}%`,
              top: (y / 100) * height,
              width: size,
              height: size,
              borderRadius: '50%',
              backgroundColor: '#C9A227',
              boxShadow: `0 0 ${size * 2.5}px rgba(201, 162, 39, 0.55)`,
              opacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const ModuleHeadlineCard: React.FC<ModuleHeadlineCardProps> = ({
  moduleLine1,
  moduleLine2,
  subtitle,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Staggered entrance timings (in frames)
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
  const subtitleOpacity = interpolate(frame, [26, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // Subtitle tracking settles from airy to normal as it fades in.
  const subtitleTracking = interpolate(frame, [26, 46], [6, 0.5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // One specular sweep across both title lines after they've landed,
  // slightly offset per line so it reads as a single diagonal pass.
  const shimmer1 = interpolate(frame, [32, 60], [130, -30], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shimmer2 = interpolate(frame, [36, 64], [130, -30], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Gold hairline between title and subtitle draws out from the center.
  const ruleWidth =
    spring({
      frame: frame - 22,
      fps,
      config: { damping: 200 },
      durationInFrames: 20,
    }) * 180;

  // Exit: over the last 12 frames, scale the text group up slightly and fade
  // to 0 so the card hands off cleanly instead of cutting mid-motion.
  const exit = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames - 1],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Slow push-in on the text group only (background stays fixed to avoid
  // edge artifacts), compounded by the exit scale-up.
  const pushIn = interpolate(frame, [0, durationInFrames], [1, 1.03], {
    extrapolateRight: 'clamp',
  });
  const scale = pushIn * (1 + exit * 0.04);

  // Background drift: ivory to warm light gray with a faint gold tint in the
  // far corner, drifting slowly over the full duration. Deliberately subtle.
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
          maxWidth: 1400,
          transform: `scale(${scale})`,
          opacity: 1 - exit,
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
          text={moduleLine1}
          gradient="linear-gradient(90deg, #1A1D29 0%, #C9A227 100%)"
          entrance={line1In}
          shimmerPos={shimmer1}
        />
        <ShimmerLine
          text={moduleLine2}
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

        {/* Module-specific subtitle */}
        <div
          style={{
            fontSize: 29,
            fontWeight: 500,
            color: '#2A2D3A',
            marginTop: 24,
            opacity: subtitleOpacity,
            letterSpacing: subtitleTracking,
          }}
        >
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
