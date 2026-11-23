import { ALL_GUESTS, evalRule, guestKey, truthTable } from './engine';
import type { Hypothesis } from './hypotheses';
import type { Guest, Rule } from './types';

export interface SolveResult {
  /** Guests the bot needed to test, not counting the starter evidence. */
  probes: number;
  /** Complexity of the simplest description of the rule (1 or 2). */
  complexity: 1 | 2;
}

/**
 * A reference player with perfect bookkeeping. It only considers rules no
 * more complex than the real one, and keeps testing the guest that splits
 * the remaining candidates most evenly until one candidate is left.
 * Real players take longer, so use this as a floor, not a target.
 */
export function simulateSolver(
  rule: Rule,
  starters: readonly Guest[],
  hypotheses: readonly Hypothesis[]
): SolveResult {
  const key = truthTable(rule);
  const self = hypotheses.find((h) => h.key === key);
  if (!self) throw new Error('rule is outside the hypothesis space');

  const truth = Uint8Array.from(ALL_GUESTS.map((g) => (evalRule(rule, g) ? 1 : 0)));
  const idxOf = new Map(ALL_GUESTS.map((g, i) => [guestKey(g), i]));
  const tested = new Set<number>(starters.map((g) => idxOf.get(guestKey(g))!));

  let alive = hypotheses.filter((h) => h.complexity <= self.complexity);
  for (const i of tested) alive = alive.filter((h) => h.table[i] === truth[i]);

  let probes = 0;
  while (alive.length > 1) {
    let best = -1;
    let bestWorst = Infinity;
    for (let gi = 0; gi < ALL_GUESTS.length; gi++) {
      if (tested.has(gi)) continue;
      let admit = 0;
      for (const h of alive) admit += h.table[gi]!;
      const worst = Math.max(admit, alive.length - admit);
      if (worst < bestWorst) {
        bestWorst = worst;
        best = gi;
      }
    }
    if (best < 0) break;
    tested.add(best);
    probes++;
    alive = alive.filter((h) => h.table[best] === truth[best]);
  }
  return { probes, complexity: self.complexity };
}
