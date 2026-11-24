import { describe, expect, it } from 'vitest';
import {
  LAUNCH_DAY,
  dayLabel,
  difficultyOf,
  doorNumberForDay,
  guestSchema,
} from './door';
import { alreadyTested, decide } from './judge';
import type { Guest } from './types';

const guest: Guest = {
  headwear: 'beret',
  top: 'puffer',
  item: 'kite',
  footwear: 'heels',
};

describe('door numbering', () => {
  it('starts at door 1 on launch day and counts up daily', () => {
    expect(doorNumberForDay(LAUNCH_DAY)).toBe(1);
    expect(doorNumberForDay(LAUNCH_DAY + 11)).toBe(12);
  });

  it('never goes below door 1', () => {
    expect(doorNumberForDay(LAUNCH_DAY - 5)).toBe(1);
  });

  it('labels the launch day as a Tuesday in November', () => {
    expect(dayLabel(LAUNCH_DAY)).toBe('Tuesday, November 24');
  });
});

describe('difficultyOf', () => {
  it('maps bot probes to bands', () => {
    expect(difficultyOf(3)).toBe('easy');
    expect(difficultyOf(4)).toBe('easy');
    expect(difficultyOf(5)).toBe('medium');
    expect(difficultyOf(8)).toBe('medium');
    expect(difficultyOf(10)).toBe('hard');
  });
});

describe('guestSchema', () => {
  it('accepts real guests and rejects unknown values', () => {
    expect(guestSchema.safeParse(guest).success).toBe(true);
    expect(guestSchema.safeParse({ ...guest, top: 'toga' }).success).toBe(false);
    expect(guestSchema.safeParse({ headwear: 'beret' }).success).toBe(false);
  });
});

describe('judge', () => {
  it('finds guests that were already tested', () => {
    const known = [{ guest, admit: true }];
    expect(alreadyTested(known, guest)?.admit).toBe(true);
    expect(alreadyTested(known, { ...guest, item: 'torch' })).toBeUndefined();
  });

  it('decides with the rule', () => {
    const rule = { op: 'trait', attr: 'headwear', trait: 'warm' } as const;
    expect(decide(rule, guest)).toBe(true);
    expect(decide(rule, { ...guest, headwear: 'beanie' })).toBe(false);
  });
});
