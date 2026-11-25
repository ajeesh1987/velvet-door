import { describe, expect, it } from 'vitest';
import {
  examStatus,
  formatCountdown,
  gradeOf,
  msUntilNextDoor,
  quoteFor,
} from './result';

describe('examStatus', () => {
  it('stays active until done', () => {
    expect(examStatus(3, 1, 8)).toBe('active');
  });
  it('passes with two or fewer misses', () => {
    expect(examStatus(8, 0, 8)).toBe('passed');
    expect(examStatus(8, 2, 8)).toBe('passed');
  });
  it('fails on the third miss, even early', () => {
    expect(examStatus(4, 3, 8)).toBe('failed');
  });
});

describe('gradeOf', () => {
  const base = { status: 'passed', probes: 4, botProbes: 4 } as const;
  it('grades by misses and probes', () => {
    expect(gradeOf({ ...base, misses: 0 })).toBe('perfect');
    expect(gradeOf({ ...base, misses: 0, probes: 9 })).toBe('smooth');
    expect(gradeOf({ ...base, misses: 1 })).toBe('sharp');
    expect(gradeOf({ ...base, misses: 2 })).toBe('close');
    expect(gradeOf({ ...base, status: 'failed', misses: 3 })).toBe('out');
  });
});

describe('quotes and countdown', () => {
  it('picks a quote deterministically', () => {
    expect(quoteFor('out', 5)).toBe(quoteFor('out', 5));
    expect(quoteFor('perfect', 1).length).toBeGreaterThan(0);
  });
  it('counts down to midnight UTC', () => {
    const t = new Date(Date.UTC(2026, 10, 25, 22, 30));
    expect(msUntilNextDoor(t)).toBe(90 * 60_000);
    expect(formatCountdown(90 * 60_000)).toBe('1h 30m');
    expect(formatCountdown(5 * 60_000)).toBe('5m');
  });
});
