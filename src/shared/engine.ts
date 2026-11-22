import { VALUES, type ValueDef } from './attributes';
import { ATTRS, type Attr, type Guest, type Rule } from './types';

const defOf = (attr: Attr, id: string): ValueDef => {
  const d = VALUES[attr].find((x) => x.id === id);
  if (!d) throw new Error(`Unknown value ${attr}:${id}`);
  return d;
};

export function evalRule(rule: Rule, g: Guest): boolean {
  switch (rule.op) {
    case 'is':
      return g[rule.attr] === rule.val;
    case 'in':
      return rule.vals.includes(g[rule.attr]);
    case 'trait': {
      const d = defOf(rule.attr, g[rule.attr]);
      return d.temp === rule.trait || d.shape === rule.trait;
    }
    case 'same': {
      const a = defOf(rule.a, g[rule.a]);
      const b = defOf(rule.b, g[rule.b]);
      return a[rule.kind] === b[rule.kind];
    }
    case 'not':
      return !evalRule(rule.r, g);
    case 'and':
      return evalRule(rule.l, g) && evalRule(rule.r, g);
    case 'or':
      return evalRule(rule.l, g) || evalRule(rule.r, g);
    case 'xor':
      return evalRule(rule.l, g) !== evalRule(rule.r, g);
  }
}

/** All 256 guests in a fixed, deterministic order. */
export const ALL_GUESTS: Guest[] = (() => {
  let out: Partial<Guest>[] = [{}];
  for (const attr of ATTRS) {
    out = out.flatMap((g) =>
      VALUES[attr].map((val) => ({ ...g, [attr]: val.id })),
    );
  }
  return out as Guest[];
})();

/** 256-char string of 1/0. Equal strings mean equivalent rules. */
export const truthTable = (rule: Rule): string =>
  ALL_GUESTS.map((g) => (evalRule(rule, g) ? '1' : '0')).join('');

export const guestKey = (g: Guest): string =>
  ATTRS.map((a) => g[a]).join('|');
