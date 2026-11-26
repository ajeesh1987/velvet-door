import { describe, expect, it } from 'vitest';
import { ADMIT_QUIPS, pickQuip, REJECT_QUIPS } from './quips';

describe('pickQuip', () => {
  it('is deterministic and always returns a line', () => {
    for (let i = -3; i < 40; i++) {
      expect(ADMIT_QUIPS).toContain(pickQuip(ADMIT_QUIPS, i));
      expect(pickQuip(REJECT_QUIPS, i)).toBe(pickQuip(REJECT_QUIPS, i));
    }
  });
});
