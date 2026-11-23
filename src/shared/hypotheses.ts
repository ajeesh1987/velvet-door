import { VALUES } from './attributes';
import { ALL_GUESTS, evalRule } from './engine';
import { ATTRS, type Rule } from './types';

/** A candidate rule a player might believe, reduced to its truth table. */
export interface Hypothesis {
  /** 1 = a single (possibly negated) test, 2 = two tests combined. */
  complexity: 1 | 2;
  /** One of 256 values (1 = admit), in ALL_GUESTS order. */
  table: Uint8Array;
  /** 256-char string of the same table, used as an identity key. */
  key: string;
  /** One formula that produces this table. */
  rule: Rule;
}

const atoms = (): Rule[] => {
  const out: Rule[] = [];
  for (const attr of ATTRS) {
    for (const v of VALUES[attr]) out.push({ op: 'is', attr, val: v.id });
    // cool and pointy are just the negations of warm and round
    out.push({ op: 'trait', attr, trait: 'warm' });
    out.push({ op: 'trait', attr, trait: 'round' });
  }
  for (let i = 0; i < ATTRS.length; i++) {
    for (let j = i + 1; j < ATTRS.length; j++) {
      const a = ATTRS[i]!;
      const b = ATTRS[j]!;
      out.push({ op: 'same', a, b, kind: 'temp' });
      out.push({ op: 'same', a, b, kind: 'shape' });
    }
  }
  return out;
};

const tableOf = (rule: Rule): Uint8Array =>
  Uint8Array.from(ALL_GUESTS.map((g) => (evalRule(rule, g) ? 1 : 0)));

const keyOf = (t: Uint8Array): string => Array.from(t).join('');

/**
 * Every distinct rule made of one test or two tests combined with
 * and / or / xor (tests may be negated). Duplicates by truth table are
 * dropped, keeping the simplest form. Constant rules are excluded.
 */
export function buildHypotheses(): Hypothesis[] {
  const literals: Rule[] = atoms().flatMap((a) => [a, { op: 'not', r: a } as Rule]);
  const seen = new Map<string, Hypothesis>();

  const add = (rule: Rule, complexity: 1 | 2): void => {
    const table = tableOf(rule);
    const ones = table.reduce((n, x) => n + x, 0);
    if (ones === 0 || ones === table.length) return;
    const key = keyOf(table);
    if (!seen.has(key)) seen.set(key, { complexity, table, key, rule });
  };

  for (const l of literals) add(l, 1);
  for (let i = 0; i < literals.length; i++) {
    for (let j = i + 1; j < literals.length; j++) {
      const l = literals[i]!;
      const r = literals[j]!;
      for (const op of ['and', 'or', 'xor'] as const) add({ op, l, r }, 2);
    }
  }
  return [...seen.values()];
}
