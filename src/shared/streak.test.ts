import { describe, expect, it } from 'vitest';
import {
  EMPTY_STREAK,
  currentStreak,
  flairText,
  rankFor,
  recordFinish,
  utcDayIndex,
} from './streak';

describe('recordFinish', () => {
  it('starts a streak on the first finish', () => {
    const r = recordFinish(EMPTY_STREAK, 100);
    expect(r.changed).toBe(true);
    expect(r.state).toEqual({ count: 1, best: 1, lastDay: 100 });
  });

  it('adds one for consecutive days', () => {
    let s = recordFinish(EMPTY_STREAK, 100).state;
    s = recordFinish(s, 101).state;
    s = recordFinish(s, 102).state;
    expect(s.count).toBe(3);
    expect(s.best).toBe(3);
  });

  it('ignores a second finish on the same day', () => {
    const s = recordFinish(EMPTY_STREAK, 100).state;
    const r = recordFinish(s, 100);
    expect(r.changed).toBe(false);
    expect(r.state).toBe(s);
  });

  it('ignores days earlier than the last finish', () => {
    const s = recordFinish(EMPTY_STREAK, 100).state;
    expect(recordFinish(s, 99).changed).toBe(false);
  });

  it('resets to 1 after a missed day but keeps best', () => {
    let s = recordFinish(EMPTY_STREAK, 100).state;
    s = recordFinish(s, 101).state;
    s = recordFinish(s, 103).state;
    expect(s.count).toBe(1);
    expect(s.best).toBe(2);
  });
});

describe('currentStreak', () => {
  const s = { count: 4, best: 4, lastDay: 100 };
  it('is alive on the finish day and the day after', () => {
    expect(currentStreak(s, 100)).toBe(4);
    expect(currentStreak(s, 101)).toBe(4);
  });
  it('is broken once a full day is missed', () => {
    expect(currentStreak(s, 102)).toBe(0);
  });
  it('is 0 for a new player', () => {
    expect(currentStreak(EMPTY_STREAK, 100)).toBe(0);
  });
});

describe('ranks and flair', () => {
  it('maps streaks to ranks at the boundaries', () => {
    expect(rankFor(0)).toBeNull();
    expect(rankFor(1)?.name).toBe('Guest list');
    expect(rankFor(2)?.name).toBe('Guest list');
    expect(rankFor(3)?.name).toBe('Doorman');
    expect(rankFor(7)?.name).toBe('Head Bouncer');
    expect(rankFor(14)?.name).toBe('Club Owner');
    expect(rankFor(99)?.name).toBe('Club Owner');
  });

  it('builds flair text', () => {
    expect(flairText(0)).toBeNull();
    expect(flairText(1)).toBe('Guest list - 1 day');
    expect(flairText(3)).toBe('Doorman - 3 days');
  });
});

describe('utcDayIndex', () => {
  it('rolls over at UTC midnight', () => {
    const a = utcDayIndex(new Date('2026-11-23T23:59:59Z'));
    const b = utcDayIndex(new Date('2026-11-24T00:00:00Z'));
    expect(b - a).toBe(1);
  });
});
