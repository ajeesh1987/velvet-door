import { ALL_GUESTS, evalRule, guestKey } from './engine';
import type { Hypothesis } from './hypotheses';
import { hash, mulberry32, shuffle } from './rng';
import type { Guest, Rule } from './types';

export interface Exam {
  /** Guests the player must call admit or reject, in display order. */
  guests: Guest[];
  /** Plausible wrong rules that still agree with the truth on every exam guest. */
  survivors: number;
}

export interface ExamOptions {
  /** Number of exam guests (default 8: half admitted, half rejected). */
  size?: number;
  /** Guest keys to avoid, e.g. guests the player already tested. */
  exclude?: ReadonlySet<string>;
}

/**
 * Pick guests that expose as many wrong-but-plausible rules as possible.
 * A player who passes has (almost) certainly found the real rule.
 * Deterministic for a given id, so the same door always gets the same exam.
 */
export function buildExam(
  id: string,
  rule: Rule,
  hypotheses: readonly Hypothesis[],
  opts: ExamOptions = {}
): Exam {
  const size = opts.size ?? 8;
  const exclude = opts.exclude ?? new Set<string>();
  const rnd = mulberry32(hash(`exam:${id}`));
  const truth = Uint8Array.from(ALL_GUESTS.map((g) => (evalRule(rule, g) ? 1 : 0)));

  let alive = hypotheses.filter((h) => h.table.some((v, i) => v !== truth[i]));
  const order = shuffle(
    ALL_GUESTS.map((_, i) => i),
    rnd
  );
  const picked: number[] = [];

  for (let step = 0; step < size; step++) {
    const want = step % 2 === 0 ? 1 : 0; // alternate admit / reject
    let best = -1;
    let bestScore = -1;
    for (const gi of order) {
      if (truth[gi] !== want || picked.includes(gi)) continue;
      if (exclude.has(guestKey(ALL_GUESTS[gi]!))) continue;
      let score = 0;
      for (const h of alive) if (h.table[gi] !== truth[gi]) score++;
      if (score > bestScore) {
        bestScore = score;
        best = gi;
      }
    }
    if (best < 0) break;
    picked.push(best);
    alive = alive.filter((h) => h.table[best] === truth[best]);
  }

  const guests = shuffle(picked, rnd).map((i) => ALL_GUESTS[i]!);
  return { guests, survivors: alive.length };
}
