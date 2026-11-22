import type { Attr, BankEntry, Rule, Trait } from './types';

const is = (attr: Attr, val: string): Rule => ({ op: 'is', attr, val });
const trait = (attr: Attr, t: Trait): Rule => ({
  op: 'trait',
  attr,
  trait: t,
});
const same = (a: Attr, b: Attr, kind: 'temp' | 'shape'): Rule => ({
  op: 'same',
  a,
  b,
  kind,
});
const not = (r: Rule): Rule => ({ op: 'not', r });
const and = (l: Rule, r: Rule): Rule => ({ op: 'and', l, r });
const or = (l: Rule, r: Rule): Rule => ({ op: 'or', l, r });
const xor = (l: Rule, r: Rule): Rule => ({ op: 'xor', l, r });

export const BANK: BankEntry[] = [
  // Tier 1: one attribute
  {
    id: 't1-warm-hats',
    tier: 1,
    rule: trait('headwear', 'warm'),
    answer: 'Warm-colored headwear only.',
  },
  {
    id: 't1-round-items',
    tier: 1,
    rule: trait('item', 'round'),
    answer: 'Round items only.',
  },
  {
    id: 't1-no-elf-shoes',
    tier: 1,
    rule: not(is('footwear', 'elfshoes')),
    answer: 'Anything but elf shoes.',
  },

  // Tier 2: two attributes
  {
    id: 't2-warm-hat-round-top',
    tier: 2,
    rule: and(trait('headwear', 'warm'), trait('top', 'round')),
    answer: 'Warm headwear AND a round top.',
  },
  {
    id: 't2-pointy-item-or-shoes',
    tier: 2,
    rule: or(trait('item', 'pointy'), trait('footwear', 'pointy')),
    answer: 'A pointy item OR pointy footwear.',
  },
  {
    id: 't2-warm-top-xor-warm-shoes',
    tier: 2,
    rule: xor(trait('top', 'warm'), trait('footwear', 'warm')),
    answer: 'Warm top or warm footwear, but not both.',
  },
  {
    id: 't2-round-hat-no-warm-item',
    tier: 2,
    rule: and(trait('headwear', 'round'), not(trait('item', 'warm'))),
    answer: 'Round headwear and no warm item.',
  },
  {
    id: 't2-blazer-or-torch',
    tier: 2,
    rule: or(is('top', 'blazer'), is('item', 'torch')),
    answer: 'A blazer or a torch.',
  },

  // Tier 3: relational
  {
    id: 't3-hat-top-same-temp',
    tier: 3,
    rule: same('headwear', 'top', 'temp'),
    answer: 'Headwear and top share a temperature.',
  },
  {
    id: 't3-item-shoes-same-shape',
    tier: 3,
    rule: same('item', 'footwear', 'shape'),
    answer: 'Item and footwear share a shape.',
  },
  {
    id: 't3-all-same-temp',
    tier: 3,
    rule: and(
      same('headwear', 'top', 'temp'),
      same('top', 'item', 'temp'),
    ),
    answer: 'Headwear, top and item all share a temperature.',
  },
  {
    id: 't3-shape-pairs-differ',
    tier: 3,
    rule: xor(
      same('headwear', 'top', 'shape'),
      same('item', 'footwear', 'shape'),
    ),
    answer: 'Exactly one pair (headwear/top, item/footwear) matches in shape.',
  },
];
