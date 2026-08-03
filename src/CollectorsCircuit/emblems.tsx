import React from "react";

// SVG emblems for the card art windows (no emoji — ui-ux-pro-max checklist).
// Stroke-based icons in the Lucide style, tinted per franchise.

type EmblemProps = { size: number; color: string };

export const BoltEmblem: React.FC<EmblemProps> = ({ size, color }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    style={{ filter: `drop-shadow(0 0 ${size / 8}px ${color})` }}
  >
    <polygon
      points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
      fill={color}
      stroke={color}
      strokeWidth={1}
      strokeLinejoin="round"
    />
  </svg>
);

export const SwordsEmblem: React.FC<EmblemProps> = ({ size, color }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={1.7}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ filter: `drop-shadow(0 0 ${size / 8}px ${color})` }}
  >
    <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
    <line x1="13" y1="19" x2="19" y2="13" />
    <line x1="16" y1="16" x2="20" y2="20" />
    <line x1="19" y1="21" x2="21" y2="19" />
    <polyline points="9.5 6.5 21 18 21 21 18 21 6.5 9.5" opacity={0.45} />
  </svg>
);

export const TrophyEmblem: React.FC<EmblemProps> = ({ size, color }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={1.7}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ filter: `drop-shadow(0 0 ${size / 8}px ${color})` }}
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

export const StarGlyph: React.FC<EmblemProps> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <polygon
      points="12 2 15 9 22 9.3 16.5 14 18.3 21.2 12 17.3 5.7 21.2 7.5 14 2 9.3 9 9"
      fill={color}
    />
  </svg>
);
