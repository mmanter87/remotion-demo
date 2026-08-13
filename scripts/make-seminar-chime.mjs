// Generates public/seminar-chime.wav: the 2.4s bookend for the SQF series
// cards. A warm low pad swell with a soft rising three-note figure
// (D4 -> F#4 -> A4) on top — understated, but with a lift.
// Re-run with: node scripts/make-seminar-chime.mjs

import { writeFileSync, mkdirSync } from 'node:fs';

const SR = 44100;
const DUR = 2.4;
const N = Math.round(SR * DUR);

// Rising major figure: [frequency Hz, start s, gain]. Soft 50ms attacks —
// motion without pluckiness.
const MOTIF = [
  [293.66, 0.25, 0.3], // D4
  [369.99, 0.55, 0.28], // F#4
  [440.0, 0.85, 0.36], // A4 — lands the lift
];

const buf = new Float64Array(N);
for (let i = 0; i < N; i++) {
  const t = i / SR;

  // Warm pad swell underneath (D2 + D3 + A3).
  const attack = Math.min(t / 0.7, 1);
  const attackSmooth = attack * attack * (3 - 2 * attack);
  const release = t < 0.7 ? 1 : Math.exp(-(t - 0.7) * 1.8);
  const pad =
    0.6 *
    attackSmooth *
    release *
    (0.5 * Math.sin(2 * Math.PI * 73.42 * t) +
      0.35 * Math.sin(2 * Math.PI * 146.83 * t) +
      0.3 * Math.sin(2 * Math.PI * 220.0 * t));

  let motif = 0;
  for (const [f, t0, gain] of MOTIF) {
    if (t < t0) continue;
    const dt = t - t0;
    const env = Math.min(dt / 0.05, 1) * Math.exp(-dt * 2.0);
    motif += gain * env * (Math.sin(2 * Math.PI * f * dt) + 0.25 * Math.sin(2 * Math.PI * 2 * f * dt));
  }

  const tailFade = t > DUR - 0.15 ? (DUR - t) / 0.15 : 1;
  buf[i] = (pad + motif) * tailFade;
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
console.log(`wrote public/seminar-chime.wav (${DUR}s pad + rising figure)`);
