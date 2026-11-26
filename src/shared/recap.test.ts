import { describe, expect, it } from 'vitest';
import { recapText } from './recap';

describe('recapText', () => {
  it('is skipped when nobody played', () => {
    expect(
      recapText({
        doorNumber: 2,
        answer: 'x',
        stats: { players: 0, cracked: 0, probes: 0 },
      })
    ).toBeNull();
  });

  it('reports the answer, share cracked and average guests', () => {
    const t = recapText({
      doorNumber: 2,
      answer: 'Anything but elf shoes.',
      stats: { players: 14, cracked: 10, probes: 87 },
    })!;
    expect(t).toContain('#2');
    expect(t).toContain('Anything but elf shoes.');
    expect(t).toContain('14 players tried it');
    expect(t).toContain('71% cracked it');
    expect(t).toContain('6.2 guests');
  });

  it('words a single player', () => {
    const t = recapText({
      doorNumber: 3,
      answer: 'a',
      stats: { players: 1, cracked: 1, probes: 5 },
    })!;
    expect(t).toContain('1 player tried it');
    expect(t).toContain('100% cracked it');
  });
});
