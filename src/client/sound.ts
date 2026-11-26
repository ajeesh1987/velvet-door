/** Flip this to false to ship with sound off until the player turns it on. */
export const SOUND_DEFAULT_ON = true;
const VOLUME = 0.12;
const KEY = 'vr:sound';

export type SoundName =
  'admit' | 'reject' | 'right' | 'wrong' | 'perfect' | 'pass' | 'fail';

interface Note {
  f: number;
  at: number;
  dur: number;
  type: OscillatorType;
  gain: number;
}

const n = (
  f: number,
  at: number,
  dur: number,
  type: OscillatorType = 'sine',
  gain = 1
): Note => ({ f, at, dur, type, gain });

/** Each sound is a few notes. No audio files to ship. */
export const SOUNDS: Record<SoundName, Note[]> = {
  admit: [n(880, 0, 0.18, 'sine'), n(1320, 0.09, 0.3, 'sine', 0.8)],
  reject: [n(110, 0, 0.16, 'triangle', 1.4), n(80, 0.05, 0.14, 'sine', 1.2)],
  right: [n(1500, 0, 0.05, 'square', 0.35)],
  wrong: [n(150, 0, 0.22, 'sawtooth', 0.5)],
  pass: [n(523, 0, 0.14), n(659, 0.12, 0.14), n(784, 0.24, 0.3)],
  perfect: [
    n(523, 0, 0.14),
    n(659, 0.12, 0.14),
    n(784, 0.24, 0.14),
    n(1047, 0.36, 0.5, 'triangle'),
    n(1319, 0.5, 0.6, 'triangle', 0.9),
    n(1568, 0.66, 0.8, 'triangle', 0.8),
  ],
  fail: [
    n(330, 0, 0.25, 'triangle'),
    n(262, 0.22, 0.25, 'triangle'),
    n(196, 0.44, 0.5, 'triangle'),
  ],
};

export const parseStored = (raw: string | null, fallback: boolean): boolean =>
  raw === '1' ? true : raw === '0' ? false : fallback;

let on = SOUND_DEFAULT_ON;
try {
  on = parseStored(localStorage.getItem(KEY), SOUND_DEFAULT_ON);
} catch {
  /* storage can be blocked; keep the default */
}

export const soundOn = (): boolean => on;

export const setSoundOn = (value: boolean): void => {
  on = value;
  try {
    localStorage.setItem(KEY, value ? '1' : '0');
  } catch {
    /* ignore */
  }
};

let ctx: AudioContext | null = null;

export const play = (name: SoundName): void => {
  if (!on) return;
  try {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return;
    ctx ??= new Ctor();
    if (ctx.state === 'suspended') void ctx.resume();
    const t0 = ctx.currentTime;
    for (const note of SOUNDS[name]) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = note.type;
      osc.frequency.value = note.f;
      const peak = VOLUME * note.gain;
      g.gain.setValueAtTime(0.0001, t0 + note.at);
      g.gain.exponentialRampToValueAtTime(peak, t0 + note.at + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + note.at + note.dur);
      osc.connect(g).connect(ctx.destination);
      osc.start(t0 + note.at);
      osc.stop(t0 + note.at + note.dur + 0.05);
    }
  } catch {
    /* audio is a bonus, never an error */
  }
};
