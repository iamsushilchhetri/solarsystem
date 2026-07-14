/** Procedurally generated ambient space drone + UI blips via Web Audio — no audio assets to
 * download. Must only be started from a user gesture (browser autoplay policy). */

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let started = false;

function ensureContext() {
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as any).webkitAudioContext;
    ctx = new Ctor();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(ctx.destination);
  }
  return { ctx, masterGain: masterGain! };
}

/** Layered detuned sine drone through a slow-shimmering lowpass filter — a soft deep-space pad. */
export function startAmbient() {
  const { ctx, masterGain } = ensureContext();
  if (ctx.state === 'suspended') ctx.resume();
  if (started) return;
  started = true;

  const freqs = [55, 82.5, 110];
  freqs.forEach((f, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = f * (1 + (Math.random() - 0.5) * 0.006);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 700;

    const voiceGain = ctx.createGain();
    const base = 0.5 / freqs.length;
    voiceGain.gain.value = base;

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.04 + i * 0.015;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = base * 0.4;
    lfo.connect(lfoGain);
    lfoGain.connect(voiceGain.gain);

    osc.connect(filter);
    filter.connect(voiceGain);
    voiceGain.connect(masterGain);
    osc.start();
    lfo.start();
  });
}

export function setAmbientVolume(target: number) {
  const { ctx, masterGain } = ensureContext();
  masterGain.gain.setTargetAtTime(target, ctx.currentTime, 0.6);
}

/** Soft chime played on body selection. No-op if audio was never started (i.e. still muted). */
export function playSelectBlip() {
  if (!ctx || !masterGain) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.exponentialRampToValueAtTime(1320, now + 0.12);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.22, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

  osc.connect(gain);
  gain.connect(masterGain);
  osc.start(now);
  osc.stop(now + 0.4);
}
