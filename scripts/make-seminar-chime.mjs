// Generates public/seminar-chime.wav: a soft 2.4s chime for the SQF series
// cards — three warm staggered tones (G3, D4, G4) over a low pad. Gentle
// attack, no percussive edge; meant to bookend a 5s card at low volume.
// Re-run with: node scripts/make-seminar-chime.mjs

import { writeFileSync, mkdirSync } from 'node:fs';

const SR = 44100;
const DUR = 2.4;
const N = Math.round(SR * DUR);

// [frequency Hz, start s, gain]
const TONES = [
  [196.0, 0.0, 0.5], // G3
  [293.66, 0.12, 0.45], // D4
  [392.0, 0.24, 0.5], // G4
];

const buf = new Float64Array(N);
for (let i = 0; i < N; i++) {
  const t = i / SR;
  let s = 0;
  for (const [f, t0, gain] of TONES) {
    if (t < t0) continue;
    const dt = t - t0;
    // 60ms soft attack, slow decay, warm partials.
    const env = Math.min(dt / 0.06, 1) * Math.exp(-dt * 2.2);
    s += gain * env * (Math.sin(2 * Math.PI * f * dt) + 0.3 * Math.sin(2 * Math.PI * 2 * f * dt) + 0.12 * Math.sin(2 * Math.PI * 3 * f * dt));
  }
  // Low G2 pad underneath for warmth.
  s += 0.12 * Math.exp(-t * 1.5) * Math.sin(2 * Math.PI * 98 * t);
  // Tail fade over the last 0.5s so it never clips off.
  const fade = t > DUR - 0.5 ? (DUR - t) / 0.5 : 1;
  buf[i] = s * fade;
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
console.log(`wrote public/seminar-chime.wav (${DUR}s, ${SR}Hz mono)`);
