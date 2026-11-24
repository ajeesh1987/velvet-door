import { z } from 'zod';
import { VALUES } from './attributes';
import type { Attr, Guest } from './types';

export type Probe = { guest: Guest; admit: boolean };
export type Difficulty = 'easy' | 'medium' | 'hard';

/** Door #1 is this UTC day. Everyone shares one clock. */
export const LAUNCH_DAY = Math.floor(Date.UTC(2026, 10, 24) / 86_400_000);

export const doorNumberForDay = (day: number): number =>
  Math.max(1, day - LAUNCH_DAY + 1);

export const dayLabel = (day: number): string =>
  new Date(day * 86_400_000).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });

/** Difficulty comes from how many guests a perfect reference player needs. */
export const difficultyOf = (botProbes: number): Difficulty => {
  if (botProbes <= 4) return 'easy';
  if (botProbes <= 8) return 'medium';
  return 'hard';
};

const valueOf = (attr: Attr) =>
  z.string().refine((id) => VALUES[attr].some((v) => v.id === id), {
    message: `unknown ${attr}`,
  });

export const guestSchema = z.object({
  headwear: valueOf('headwear'),
  top: valueOf('top'),
  item: valueOf('item'),
  footwear: valueOf('footwear'),
});
