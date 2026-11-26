import { ATTRS, type Attr, type Rule } from './types';

/** Guests a player must send before a hint is offered. */
export const HINT_AFTER = 6;

/** Every attribute a rule looks at, in the usual order. */
export const attrsOf = (rule: Rule): Attr[] => {
  const found = new Set<Attr>();
  const walk = (r: Rule): void => {
    switch (r.op) {
      case 'is':
      case 'in':
      case 'trait':
        found.add(r.attr);
        return;
      case 'same':
        found.add(r.a);
        found.add(r.b);
        return;
      case 'not':
        walk(r.r);
        return;
      default:
        walk(r.l);
        walk(r.r);
    }
  };
  walk(rule);
  return ATTRS.filter((a) => found.has(a));
};

/** One attribute to point at, picked by door number so it never changes. */
export const hintFor = (
  rule: Rule,
  doorNumber: number
): { attr: Attr; total: number } => {
  const attrs = attrsOf(rule);
  const attr = attrs[doorNumber % attrs.length] ?? ATTRS[0];
  return { attr, total: attrs.length };
};

export const hintText = (attr: Attr, total: number): string =>
  total > 1
    ? `Hint: the rule involves ${total} parts of the outfit. One is the ${attr}.`
    : `Hint: the rule only looks at the guest's ${attr}.`;
