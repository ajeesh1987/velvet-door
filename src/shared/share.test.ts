import { describe, expect, it } from 'vitest';
import type { DayResult } from './result';
import { shareText, squareGrid } from './share';

const result: DayResult = {
  status: 'passed',
  grade: 'sharp',
  misses: 1,
  probes: 4,
  answer: 'Secret rule text.',
  quote: 'q',
  streak: 3,
  best: 3,
  rank: 'Doorman',
};

describe('share text', () => {
  it('draws one square per exam guest', () => {
    expect(squareGrid([true, false, true], 5)).toBe('🟩🟥🟩⬛⬛');
  });
  it('never leaks the rule', () => {
    const t = shareText({
      doorNumber: 2,
      difficulty: 'easy',
      result,
      correct: [true, true, false, true, true, true, true, true],
      total: 8,
    });
    expect(t).not.toContain('Secret rule');
    expect(t).toContain('Door #2');
    expect(t).toContain('Sharp eye');
    expect(t).toContain('4 guests sent');
    expect(t).toContain('Day streak: 3');
  });
  it('words a thrown out result', () => {
    const t = shareText({
      doorNumber: 5,
      difficulty: 'hard',
      result: { ...result, status: 'failed', grade: 'out', probes: 1 },
      correct: [false, false, false],
      total: 8,
    });
    expect(t).toContain('Thrown out · 1 guest sent');
    expect(t).toContain('🟥🟥🟥⬛⬛⬛⬛⬛');
  });
});
