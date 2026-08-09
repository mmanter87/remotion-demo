// Generates public/sting.wav: a 20s instrumental sting for explainer openers.
// Brief: low synth pulse with a single sustained pad above it. No melody,
// no vocals, no percussion. Starts sparse, thins out further toward the end
// so a voiceover can ride over the tail. No build, no drop, no key change.
// Re-run with: node scripts/make-sting.mjs

import { writeFileSync, mkdirSync } from 'node:fs';

const SR = 44100;
const DUR = 20;
const N = SR * DUR;

// Key of D. Root pulse at D2 with a sub octave; pad holds D3 + A3 (a bare
// fifth — reads as confident without being a chord progression).
const ROOT = 73.42; // D2
const SUB = 36.71; // D1
const PAD = [146.83, 220.0]; // D3, A3

const L = new Float64Array(N);
const R = new Float64Array(N);

const PULSE_PERIOD = 0.8; // seconds between pulses — a slow heartbeat
for (let i = 0; i < N; i++) {
  const t = i / SR;

  // --- Low pulse ---
  const pt = t % PULSE_PERIOD;
  // 30ms soft attack, then exponential decay. No transient click.
  const pulseEnv = Math.min(pt / 0.03, 1) * Math.exp(-pt * 6);
  // Thinning: full weight until 10s, then ease down to 35% by the end.
  const pulseWeight = t < 10 ? 1 : 1 - 0.65 * ((t - 10) / 10);
  const pulse =
    pulseEnv *
    pulseWeight *
    0.5 *
    (Math.sin(2 * Math.PI * ROOT * t) +
      0.45 * Math.sin(2 * Math.PI * SUB * t) +
      0.12 * Math.sin(2 * Math.PI * ROOT * 2 * t));

  // --- Sustained pad ---
  // 2.5s slow attack; from 13s the pad eases down to 50% ("thins further").
  const padAttack = Math.min(t / 2.5, 1);
  const padWeight = t < 13 ? 1 : 1 - 0.5 * ((t - 13) / 7);
  // Very slow amplitude drift so the sustain doesn't read as a test tone.
  const drift = 1 + 0.08 * Math.sin(2 * Math.PI * 0.07 * t);
  let padL = 0;
  let padR = 0;
  for (const f of PAD) {
    // Detuned pair per note, split L/R for width. Beating stays subtle.
    padL += Math.sin(2 * Math.PI * f * 0.9985 * t);
    padR += Math.sin(2 * Math.PI * f * 1.0015 * t);
  }
  const padGain = 0.16 * padAttack * padWeight * drift;

  // --- Mix ---
  // Master tail: gentle ramp from 15s down to silence at 20s.
  const master = t < 15 ? 1 : 1 - (t - 15) / 5;
  L[i] = (pulse + padL * padGain) * master;
  R[i] = (pulse + padR * padGain) * master;
}

// Normalize to -6 dBFS — understated; leaves room for a voice on top.
let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const norm = 0.501 / peak;

// 16-bit stereo PCM WAV.
const data = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * norm)) * 32767), i * 4);
  data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * norm)) * 32767), i * 4 + 2);
}
const header = Buffer.alloc(44);
header.write('RIFF', 0);
header.writeUInt32LE(36 + data.length, 4);
header.write('WAVEfmt ', 8);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20); // PCM
header.writeUInt16LE(2, 22); // stereo
header.writeUInt32LE(SR, 24);
header.writeUInt32LE(SR * 4, 28);
header.writeUInt16LE(4, 32);
header.writeUInt16LE(16, 34);
header.write('data', 36);
header.writeUInt32LE(data.length, 40);

mkdirSync('public', { recursive: true });
writeFileSync('public/sting.wav', Buffer.concat([header, data]));
console.log(`wrote public/sting.wav (${DUR}s, ${SR}Hz stereo)`);
