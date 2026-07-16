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
  tagline?: string; // optional company tagline, defaults below
};

const DEFAULT_TAGLINE =
  'KeychainOS is a next-generation ERP, built with best-in-class technology and AI to redefine modern manufacturing.';

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
  tagline = DEFAULT_TAGLINE,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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
  const taglineOpacity = interpolate(frame, [34, 48], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Subtle continuous zoom on the whole card, matching the "slow push-in"
  // treatment used across the OpenArt-generated clips for visual consistency.
  const scale = interpolate(frame, [0, 90], [1, 1.03], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#FFFFFF',
        fontFamily,
        justifyContent: 'center',
        alignItems: 'center',
        transform: `scale(${scale})`,
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 1400 }}>
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

        {/* Company tagline */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 400,
            color: '#7A7D8A',
            marginTop: 8,
            opacity: taglineOpacity,
          }}
        >
          {tagline}
        </div>
      </div>
    </AbsoluteFill>
  );
};
