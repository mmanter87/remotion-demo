// SQFSeries.tsx
// Educational series cards for "SQF Edition 10" seminar clips (1080x1080).
// Two layouts matching the reference stills:
//  - SQFEpisodeCard: numbered episode with kicker, accent-phrase headline,
//    speaker block, and footer line.
//  - SQFNextCard: "next in the series" card with a tilted stamp.
// Both play a soft chime at the start and again into the final hold.

import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  staticFile,
} from 'remotion';
import { loadFont } from '@remotion/fonts';

const poppins = 'Poppins';
loadFont({
  family: poppins,
  url: staticFile('fonts/poppins-latin-700-normal.woff2'),
  weight: '700',
});
const mono = 'JetBrains Mono';
loadFont({
  family: mono,
  url: staticFile('fonts/jetbrains-mono-latin-500-normal.woff2'),
  weight: '500',
});
loadFont({
  family: mono,
  url: staticFile('fonts/jetbrains-mono-latin-700-normal.woff2'),
  weight: '700',
});

const BG = '#1A231F';
const BAR = '#D9A426';
const CREAM = '#F1EDE2';
const GOLD = '#D9A426';
const MUTED = '#8E9992';
const WARM_MUTED = '#ADA48C';
const STAMP = '#C4705C';

const CHIME = 'seminar-chime.wav';
const CHIME_FRAMES = 72; // 2.4s at 30fps

export type HeadlineSegment = { text: string; accent?: boolean };

// Shared chrome: ground, gold spine bar, faint ruled lines, bookend chime.
const CardShell: React.FC<{
  children: React.ReactNode;
  chimeVolume?: number;
}> = ({ children, chimeVolume = 0.4 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const barIn = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 14 });
  const exit = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames - 1],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Audio src={staticFile(CHIME)} volume={chimeVolume} />
      <Sequence from={durationInFrames - CHIME_FRAMES}>
        <Audio src={staticFile(CHIME)} volume={chimeVolume} />
      </Sequence>
      {/* Faint ruled lines */}
      {Array.from({ length: 13 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 75 + i * 75,
            height: 1,
            backgroundColor: 'rgba(255,255,255,0.045)',
          }}
        />
      ))}
      {/* Gold spine bar wipes down */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 22,
          height: '100%',
          backgroundColor: BAR,
          transform: `scaleY(${barIn})`,
          transformOrigin: 'top',
        }}
      />
      <div style={{ position: 'absolute', inset: 0, opacity: exit }}>{children}</div>
    </AbsoluteFill>
  );
};

const fadeRise = (
  frame: number,
  fps: number,
  delay: number
): React.CSSProperties => {
  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
    durationInFrames: 16,
  });
  return { opacity: s, transform: `translateY(${(1 - s) * 18}px)` };
};

export type SQFEpisodeCardProps = {
  seriesLabel: string; // "SQF EDITION 10"
  episodeNumber: string; // "01"
  kicker: string; // "THE QUESTION"
  headline: HeadlineSegment[];
  speaker: string; // "Jim White"
  speakerRole: string; // "SQF consultant & trainer"
  footer: string; // "RECORDED LIVE · EDITION 10 SESSION"
};

export const SQFEpisodeCard: React.FC<SQFEpisodeCardProps> = ({
  seriesLabel,
  episodeNumber,
  kicker,
  headline,
  speaker,
  speakerRole,
  footer,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dividerIn = spring({
    frame: frame - 34,
    fps,
    config: { damping: 200 },
    durationInFrames: 18,
  });

  return (
    <CardShell>
      {/* Top row */}
      <div
        style={{
          position: 'absolute',
          left: 90,
          right: 90,
          top: 88,
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: mono,
          ...fadeRise(frame, fps, 6),
        }}
      >
        <span style={{ fontSize: 28, fontWeight: 500, letterSpacing: 9, color: MUTED }}>
          {seriesLabel}
        </span>
        <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: 4, color: GOLD }}>
          {episodeNumber}
        </span>
      </div>

      {/* Kicker */}
      <div
        style={{
          position: 'absolute',
          left: 90,
          top: 272,
          fontFamily: mono,
          fontSize: 26,
          fontWeight: 500,
          letterSpacing: 10,
          color: MUTED,
          ...fadeRise(frame, fps, 16),
        }}
      >
        {kicker}
      </div>

      {/* Headline */}
      <div
        style={{
          position: 'absolute',
          left: 88,
          top: 330,
          width: 910,
          fontFamily: poppins,
          fontWeight: 700,
          fontSize: 86,
          lineHeight: 1.1,
          letterSpacing: -1.5,
          color: CREAM,
          ...fadeRise(frame, fps, 24),
        }}
      >
        {headline.map((seg, i) => (
          <span key={i} style={{ color: seg.accent ? GOLD : CREAM }}>
            {seg.text}
          </span>
        ))}
      </div>

      {/* Divider draws left to right */}
      <div
        style={{
          position: 'absolute',
          left: 90,
          top: 682,
          width: 900 * dividerIn,
          height: 1.5,
          backgroundColor: 'rgba(241,237,226,0.35)',
        }}
      />

      {/* Speaker block */}
      <div style={{ position: 'absolute', left: 90, top: 722, fontFamily: mono, ...fadeRise(frame, fps, 44) }}>
        <div style={{ fontSize: 34, fontWeight: 700, color: CREAM }}>{speaker}</div>
        <div style={{ fontSize: 29, fontWeight: 500, color: WARM_MUTED, marginTop: 14 }}>
          {speakerRole}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          left: 90,
          top: 962,
          fontFamily: mono,
          fontSize: 26,
          fontWeight: 500,
          letterSpacing: 6,
          color: '#7E8B85',
          ...fadeRise(frame, fps, 54),
        }}
      >
        {footer}
      </div>
    </CardShell>
  );
};

export type SQFNextCardProps = {
  titleLine1: string; // "SQF Edition 10"
  titleLine2: string; // "with Jim White"
  kicker: string; // "NEXT IN THE SERIES"
  teaser: string; // "When the auditor is wrong, appeal it."
  stamp: string; // "AUDITS FROM 2 JAN 2027"
};

export const SQFNextCard: React.FC<SQFNextCardProps> = ({
  titleLine1,
  titleLine2,
  kicker,
  teaser,
  stamp,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // The stamp slams in: overshoots big and settles, like it was pressed on.
  const stampIn = spring({
    frame: frame - 44,
    fps,
    config: { damping: 13, mass: 0.6 },
    durationInFrames: 20,
  });

  return (
    <CardShell>
      <div style={{ position: 'absolute', left: 88, top: 292, fontFamily: poppins, fontWeight: 700, fontSize: 74, lineHeight: 1.16, letterSpacing: -1 }}>
        <div style={{ color: CREAM, ...fadeRise(frame, fps, 6) }}>{titleLine1}</div>
        <div style={{ color: GOLD, ...fadeRise(frame, fps, 13) }}>{titleLine2}</div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 90,
          top: 540,
          fontFamily: mono,
          fontSize: 26,
          fontWeight: 500,
          letterSpacing: 10,
          color: MUTED,
          ...fadeRise(frame, fps, 24),
        }}
      >
        {kicker}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 88,
          top: 596,
          width: 910,
          fontFamily: poppins,
          fontWeight: 700,
          fontSize: 44,
          letterSpacing: -0.5,
          color: CREAM,
          ...fadeRise(frame, fps, 32),
        }}
      >
        {teaser}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 90,
          top: 706,
          padding: '16px 30px',
          border: `2.5px solid ${STAMP}`,
          fontFamily: mono,
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: 7,
          color: STAMP,
          opacity: Math.min(stampIn * 1.5, 1),
          transform: `rotate(-3deg) scale(${1.6 - stampIn * 0.6})`,
          transformOrigin: 'center',
          display: 'inline-block',
        }}
      >
        {stamp}
      </div>
    </CardShell>
  );
};
