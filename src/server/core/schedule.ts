import { BANK } from '../../shared/bank';
import { RULE_META } from '../../shared/bank.generated';
import {
  LAUNCH_DAY,
  difficultyOf,
  doorNumberForDay,
  type Difficulty,
} from '../../shared/door';
import type { BankEntry } from '../../shared/types';

const botProbesOf = (id: string): number => RULE_META[id]?.botProbes ?? 99;

const byDifficulty = (d: Difficulty): BankEntry[] =>
  BANK.filter((e) => difficultyOf(botProbesOf(e.id)) === d).sort(
    (a, b) => botProbesOf(a.id) - botProbesOf(b.id) || a.id.localeCompare(b.id)
  );

const POOLS: Record<Difficulty, BankEntry[]> = {
  easy: byDifficulty('easy'),
  medium: byDifficulty('medium'),
  hard: byDifficulty('hard'),
};

/** Difficulty by UTC weekday, Sunday first. A week eases in, then climbs. */
export const WEEK: readonly Difficulty[] = [
  'easy', // Sun
  'easy', // Mon
  'easy', // Tue
  'medium', // Wed
  'medium', // Thu
  'hard', // Fri
  'hard', // Sat
];

export const difficultyForDay = (day: number): Difficulty =>
  WEEK[new Date(day * 86_400_000).getUTCDay()] ?? 'easy';

/** Which entry of its pool a day uses: each pool is walked in order. */
const poolIndex = (day: number, difficulty: Difficulty): number => {
  let n = 0;
  for (let d = LAUNCH_DAY; d < day; d++) {
    if (difficultyForDay(d) === difficulty) n++;
  }
  return n;
};

export type Door = {
  number: number;
  entry: BankEntry;
  difficulty: Difficulty;
};

export const doorForDay = (day: number): Door => {
  const number = doorNumberForDay(day);
  const today = Math.max(day, LAUNCH_DAY);
  let difficulty = difficultyForDay(today);
  // A pool with no rules falls back to the next easier one.
  if (POOLS[difficulty].length === 0) {
    difficulty = (['medium', 'easy', 'hard'] as const).find(
      (d) => POOLS[d].length > 0
    )!;
  }
  const pool = POOLS[difficulty];
  const entry = pool[poolIndex(today, difficulty) % pool.length];
  if (!entry) throw new Error('rule bank is empty');
  return { number, entry, difficulty: difficultyOf(botProbesOf(entry.id)) };
};

export const startersFor = (id: string) => {
  const meta = RULE_META[id];
  if (!meta) throw new Error(`no metadata for ${id}`);
  return meta.evidence;
};
