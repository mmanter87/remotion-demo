// Generates public/seminar-chime.wav: a soft 2.4s swell that bookends the
// SQF series cards. No melody, no bell tones — a warm low pad (D2 root,
// D3+A3 fifth above) that breathes in over ~0.9s and releases to silence.
// Re-run with: node scripts/make-seminar-chime.mjs

import { writeFileSync, mkdirSync } from 'node:fs';

const SR = 44100;
const DUR = 2.4;
const N = Math.round(SR * DUR);

const buf = new Float64Array(N);
for (let i = 0; i < N; i++) {
  const t = i / SR;
  // Swell: smooth 0.9s attack, then a long even release to the end.
  const attack = Math.min(t / 0.9, 1);
  const attackSmooth = attack * attack * (3 - 2 * attack); // smoothstep
  const release = t < 0.9 ? 1 : Math.exp(-(t - 0.9) * 2.2);
  const env = attackSmooth * release;

  const s =
    0.5 * Math.sin(2 * Math.PI * 73.42 * t) + // D2 root
    0.35 * Math.sin(2 * Math.PI * 146.83 * t) + // D3
    0.3 * Math.sin(2 * Math.PI * 220.0 * t) + // A3 — open fifth, no melody
    0.06 * Math.sin(2 * Math.PI * 293.66 * t); // faint D4 for air

  // Hard fade over the last 0.15s guarantees a click-free end.
  const tailFade = t > DUR - 0.15 ? (DUR - t) / 0.15 : 1;
  buf[i] = s * env * tailFade;
}

// Normalize to -6 dBFS.
let peak = 0;
for (const s of buf) peak = Math.max(peak, Math.abs(s));
const norm = 0.501 / peak;

const data = Buffer.alloc(N * 2);
for (let i = 0; i < N; i++) {
  data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, buf[i] * norm)) * 32767), i * 2);
}
const header = Buffer.alloc(44);
header.write('RIFF', 0);
header.writeUInt32LE(36 + data.length, 4);
header.write('WAVEfmt ', 8);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(1, 22);
header.writeUInt32LE(SR, 24);
header.writeUInt32LE(SR * 2, 28);
header.writeUInt16LE(2, 32);
header.writeUInt16LE(16, 34);
header.write('data', 36);
header.writeUInt32LE(data.length, 40);

mkdirSync('public', { recursive: true });
writeFileSync('public/seminar-chime.wav', Buffer.concat([header, data]));
console.log(`wrote public/seminar-chime.wav (${DUR}s swell, ${SR}Hz mono)`);
