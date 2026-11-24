import { BANK } from '../../shared/bank';
import { RULE_META } from '../../shared/bank.generated';
import { difficultyOf, doorNumberForDay } from '../../shared/door';
import type { BankEntry } from '../../shared/types';

const botProbesOf = (id: string): number => RULE_META[id]?.botProbes ?? 99;

/** Easiest doors first, so a new player's first doors are quick wins. */
export const SCHEDULE: readonly BankEntry[] = [...BANK].sort(
  (a, b) => botProbesOf(a.id) - botProbesOf(b.id) || a.id.localeCompare(b.id)
);

export type Door = {
  number: number;
  entry: BankEntry;
  difficulty: ReturnType<typeof difficultyOf>;
};

export const doorForDay = (day: number): Door => {
  const number = doorNumberForDay(day);
  const entry = SCHEDULE[(number - 1) % SCHEDULE.length];
  if (!entry) throw new Error('rule bank is empty');
  return { number, entry, difficulty: difficultyOf(botProbesOf(entry.id)) };
};

export const startersFor = (id: string) => {
  const meta = RULE_META[id];
  if (!meta) throw new Error(`no metadata for ${id}`);
  return meta.evidence;
};
