/** Exam rules and result text. Pure functions, shared by server and client. */

/** Guests a player must send before the exam unlocks. */
export const MIN_PROBES = 3;
/** The third wrong call throws the player out. */
export const MAX_MISSES = 2;

export type ExamStatus = 'active' | 'passed' | 'failed';
export type Grade = 'perfect' | 'smooth' | 'sharp' | 'close' | 'out';

export const examStatus = (
  answered: number,
  misses: number,
  total: number
): ExamStatus =>
  misses > MAX_MISSES ? 'failed' : answered >= total ? 'passed' : 'active';

export const gradeOf = (args: {
  status: Exclude<ExamStatus, 'active'>;
  misses: number;
  probes: number;
  botProbes: number;
}): Grade => {
  if (args.status === 'failed') return 'out';
  if (args.misses >= 2) return 'close';
  if (args.misses === 1) return 'sharp';
  return args.probes <= args.botProbes + 1 ? 'perfect' : 'smooth';
};

export const GRADE_LABEL: Record<Grade, string> = {
  perfect: 'Flawless',
  smooth: 'Clean sweep',
  sharp: 'Sharp eye',
  close: 'Close call',
  out: 'Thrown out',
};

const QUOTES: Record<Grade, readonly string[]> = {
  perfect: [
    'Not a single slip. You could run this door.',
    "You read my mind. Come in, boss.",
  ],
  smooth: ['Clean sweep. Welcome to the list.', "Spotless. I'd hire you."],
  sharp: ['One slip, still on the list.', 'Nearly perfect. Nice work.'],
  close: [
    'Two slips. You scraped in.',
    "That was tight. Don't tell the boss.",
  ],
  out: ['Not tonight, friend. Try again tomorrow.', 'Rules are rules. Out you go.'],
};

export const quoteFor = (grade: Grade, doorNumber: number): string => {
  const list = QUOTES[grade];
  return list[doorNumber % list.length] ?? list[0] ?? '';
};

export interface DayResult {
  status: Exclude<ExamStatus, 'active'>;
  grade: Grade;
  misses: number;
  /** Guests the player sent before the exam. */
  probes: number;
  /** Plain-English rule, revealed once the day is over. */
  answer: string;
  quote: string;
  streak: number;
  best: number;
  rank: string | null;
}

/** Milliseconds until the next door opens (00:00 UTC). */
export const msUntilNextDoor = (now: Date = new Date()): number => {
  const next = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1
  );
  return next - now.getTime();
};

export const formatCountdown = (ms: number): string => {
  const mins = Math.max(0, Math.ceil(ms / 60_000));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};
