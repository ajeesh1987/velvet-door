import { ALL_GUESTS, evalRule, truthTable } from './engine';
import { ATTRS, type BankEntry, type Guest } from './types';

export interface Evidence {
  admit: Guest;
  reject: Guest;
}

export function admitRate(entry: BankEntry): number {
  const n = ALL_GUESTS.filter((g) => evalRule(entry.rule, g)).length;
  return n / ALL_GUESTS.length;
}

export function checkBank(bank: BankEntry[]): string[] {
  const errors: string[] = [];
  const seenTables = new Map<string, string>();
  const seenIds = new Set<string>();
  for (const e of bank) {
    if (seenIds.has(e.id)) errors.push(`${e.id}: duplicate id`);
    seenIds.add(e.id);

    const rate = admitRate(e);
    if (rate < 0.25 || rate > 0.75) {
      const pct = (rate * 100).toFixed(1);
      errors.push(`${e.id}: admit rate ${pct}% outside 25-75%`);
    }

    const table = truthTable(e.rule);
    const clash = seenTables.get(table);
    if (clash) errors.push(`${e.id}: equivalent to ${clash}`);
    seenTables.set(table, e.id);

    if (!pickEvidence(e)) errors.push(`${e.id}: no evidence pair found`);
  }
  return errors;
}

// Deterministic seeded randomness: evidence never changes between runs.
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const diff = (a: Guest, b: Guest): number =>
  ATTRS.filter((k) => a[k] !== b[k]).length;

/** One admitted + one rejected guest that differ in 2-3 attributes. */
export function pickEvidence(entry: BankEntry): Evidence | null {
  const rnd = mulberry32(hash(entry.id));
  const shuffled = <T,>(arr: T[]): T[] =>
    arr
      .map((x) => [rnd(), x] as const)
      .sort((p, q) => p[0] - q[0])
      .map((p) => p[1]);

  const admitted = shuffled(ALL_GUESTS.filter((g) => evalRule(entry.rule, g)));
  const rejected = ALL_GUESTS.filter((g) => !evalRule(entry.rule, g));
  for (const a of admitted) {
    const cands = rejected.filter((r) => {
      const d = diff(a, r);
      return d >= 2 && d <= 3;
    });
    if (cands.length === 0) continue;
    const r = shuffled(cands)[0];
    if (r) return { admit: a, reject: r };
  }
  return null;
}
