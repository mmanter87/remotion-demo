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
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Poppins';

const { fontFamily } = loadFont();

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
            'linear-gradient(120deg, #FFFFFF 0%, #F5F3EF 60%, rgba(201, 162, 39, 0.07) 100%)',
          backgroundSize: '180% 180%',
          backgroundPosition: `${bgDrift}% ${bgDrift}%`,
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

        {/* Module title, line 1 */}
        <div>
          <div
            style={{
              fontSize: 92,
              fontWeight: 700,
              lineHeight: 1.15,
              opacity: line1In,
              transform: `translateY(${(1 - line1In) * 20}px)`,
              ...gradientText('linear-gradient(90deg, #1A1D29 0%, #C9A227 100%)'),
            }}
          >
            {moduleLine1}
          </div>
        </div>

        {/* Module title, line 2 */}
        <div>
          <div
            style={{
              fontSize: 92,
              fontWeight: 700,
              lineHeight: 1.15,
              opacity: line2In,
              transform: `translateY(${(1 - line2In) * 20}px)`,
              ...gradientText(
                'linear-gradient(90deg, #C9A227 0%, #7A6B3D 50%, #1A1D29 100%)'
              ),
            }}
          >
            {moduleLine2}
          </div>
        </div>

        {/* Module-specific subtitle */}
        <div
          style={{
            fontSize: 29,
            fontWeight: 500,
            color: '#2A2D3A',
            marginTop: 28,
            opacity: subtitleOpacity,
          }}
        >
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
