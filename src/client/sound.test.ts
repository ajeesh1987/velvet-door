import { describe, expect, it } from 'vitest';
import { parseStored, play, SOUNDS } from './sound';

describe('sound', () => {
  it('reads the saved choice, else the default', () => {
    expect(parseStored('1', false)).toBe(true);
    expect(parseStored('0', true)).toBe(false);
    expect(parseStored(null, true)).toBe(true);
    expect(parseStored('x', false)).toBe(false);
  });
  it('defines every sound with notes', () => {
    for (const notes of Object.values(SOUNDS))
      expect(notes.length).toBeGreaterThan(0);
  });
  it('never throws without audio support', () => {
    expect(() => play('admit')).not.toThrow();
  });
});
