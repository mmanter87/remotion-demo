// Generates public/jingle.wav: a 6s "hook" jingle used by demo intro cards.
// Rising C-major pluck motif with a soft low pad, feedback echo, and a tail
// fade. Pure Node so it runs offline; re-run with: node scripts/make-jingle.mjs

import { writeFileSync, mkdirSync } from 'node:fs';

const SR = 44100;
const DUR = 6;
const N = SR * DUR;

// [frequency Hz, start s, decay rate, gain]
const PLUCKS = [
  [523.25, 0.0, 5, 0.45], // C5
  [659.25, 0.18, 5, 0.45], // E5
  [783.99, 0.36, 5, 0.45], // G5
  [1046.5, 0.54, 3, 0.55], // C6 — the hook lands here
  [783.99, 1.1, 2, 0.35], // G5 afterglow
];

const buf = new Float64Array(N);
for (let i = 0; i < N; i++) {
  const t = i / SR;
  let s = 0;
  for (const [f, t0, decay, gain] of PLUCKS) {
    if (t < t0) continue;
    const dt = t - t0;
    const env = Math.exp(-dt * decay);
    // Fundamental plus one octave partial for a bright, bell-like pluck.
    s += gain * env * (Math.sin(2 * Math.PI * f * dt) + 0.4 * Math.sin(2 * Math.PI * 2 * f * dt));
  }
  // Warm low pad: C3 + G3 fifth, slow decay.
  s += 0.12 * Math.exp(-t * 0.9) * (Math.sin(2 * Math.PI * 130.81 * t) + Math.sin(2 * Math.PI * 196 * t));
  buf[i] = s;
}

// Feedback echo: 120ms delay, 25% feedback.
const delay = Math.round(0.12 * SR);
for (let i = delay; i < N; i++) {
  buf[i] += 0.25 * buf[i - delay];
}

// Fade out over the final 1.2s so the card can end on silence.
const fadeStart = (DUR - 1.2) * SR;
for (let i = fadeStart; i < N; i++) {
  buf[i] *= 1 - (i - fadeStart) / (N - fadeStart);
}

// Normalize to -3 dBFS.
let peak = 0;
for (const s of buf) peak = Math.max(peak, Math.abs(s));
const norm = 0.708 / peak;

// 16-bit mono PCM WAV.
const data = Buffer.alloc(N * 2);
for (let i = 0; i < N; i++) {
  data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, buf[i] * norm)) * 32767), i * 2);
}
const header = Buffer.alloc(44);
header.write('RIFF', 0);
header.writeUInt32LE(36 + data.length, 4);
header.write('WAVEfmt ', 8);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20); // PCM
header.writeUInt16LE(1, 22); // mono
header.writeUInt32LE(SR, 24);
header.writeUInt32LE(SR * 2, 28);
header.writeUInt16LE(2, 32);
header.writeUInt16LE(16, 34);
header.write('data', 36);
header.writeUInt32LE(data.length, 40);

mkdirSync('public', { recursive: true });
writeFileSync('public/jingle.wav', Buffer.concat([header, data]));
console.log(`wrote public/jingle.wav (${DUR}s, ${SR}Hz mono)`);
