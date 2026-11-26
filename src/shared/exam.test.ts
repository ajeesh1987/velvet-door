import { describe, expect, it } from 'vitest';
import { BANK } from './bank';
import { ALL_GUESTS, evalRule, guestKey } from './engine';
import { buildExam } from './exam';
import { buildHypotheses } from './hypotheses';
import { simulateSolver } from './solver';
import { pickEvidence } from './validate';

const H = buildHypotheses();

/** The whole bank is checked in one test, so give CI machines room. */
const SLOW = 60_000;

describe('exam', () => {
  it(
    'is balanced, deterministic and leaves few wrong rules alive',
    () => {
      for (const e of BANK) {
        const a = buildExam(e.id, e.rule, H);
        const b = buildExam(e.id, e.rule, H);
        expect(a.guests).toEqual(b.guests);
        expect(a.guests).toHaveLength(8);
        const admits = a.guests.filter((g) => evalRule(e.rule, g)).length;
        expect(admits).toBe(4);
        expect(new Set(a.guests.map(guestKey)).size).toBe(8);
        expect(a.survivors).toBeLessThanOrEqual(5);
      }
    },
    SLOW
  );

  it('avoids excluded guests', () => {
    const e = BANK[0]!;
    const first = buildExam(e.id, e.rule, H);
    const exclude = new Set(first.guests.map(guestKey));
    const second = buildExam(e.id, e.rule, H, { exclude });
    for (const g of second.guests) expect(exclude.has(guestKey(g))).toBe(false);
  });
});

describe('solver', () => {
  it(
    'solves every bank rule in a sane number of probes',
    () => {
      for (const e of BANK) {
        const ev = pickEvidence(e)!;
        const r = simulateSolver(e.rule, [ev.admit, ev.reject], H);
        expect(r.probes).toBeGreaterThanOrEqual(2);
        expect(r.probes).toBeLessThanOrEqual(14);
      }
    },
    SLOW
  );
});

describe('hypothesis space', () => {
  it('has many distinct rules and covers the whole guest list', () => {
    expect(H.length).toBeGreaterThan(1000);
    expect(H[0]!.table).toHaveLength(ALL_GUESTS.length);
  });
});
