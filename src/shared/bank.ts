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

  {
    id: 't1-cool-tops',
    tier: 1,
    rule: trait('top', 'cool'),
    answer: 'Cool-colored tops only.',
  },
  {
    id: 't1-pointy-shoes',
    tier: 1,
    rule: trait('footwear', 'pointy'),
    answer: 'Pointy footwear only.',
  },
  {
    id: 't1-no-wizard-hat',
    tier: 1,
    rule: not(is('headwear', 'wizard')),
    answer: 'Anything but a wizard hat.',
  },
  {
    id: 't1-warm-items',
    tier: 1,
    rule: trait('item', 'warm'),
    answer: 'Warm-colored items only.',
  },
  {
    id: 't1-round-hats',
    tier: 1,
    rule: trait('headwear', 'round'),
    answer: 'Round headwear only.',
  },
  {
    id: 't1-no-poncho',
    tier: 1,
    rule: not(is('top', 'poncho')),
    answer: 'Anything but a poncho.',
  },
  {
    id: 't1-beanies-only',
    tier: 1,
    rule: is('headwear', 'beanie'),
    answer: 'Blue beanies only.',
  },

  // More tier 1 rules. Their ids sort after the doors already played.
  {
    id: 't1-top-blazer',
    tier: 1,
    rule: is('top', 'blazer'),
    answer: 'Red blazers only.',
  },
  {
    id: 't1-top-poncho',
    tier: 1,
    rule: is('top', 'poncho'),
    answer: 'Teal ponchos only.',
  },
  {
    id: 't1-top-pointy',
    tier: 1,
    rule: trait('top', 'pointy'),
    answer: 'Pointy tops only.',
  },
  {
    id: 't1-only-lantern',
    tier: 1,
    rule: is('item', 'lantern'),
    answer: 'Lanterns only.',
  },
  {
    id: 't1-snowglobe-out',
    tier: 1,
    rule: not(is('item', 'snowglobe')),
    answer: 'Anything but a snow globe.',
  },
  {
    id: 't1-shoes-cool',
    tier: 1,
    rule: trait('footwear', 'cool'),
    answer: 'Cool-colored footwear only.',
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

  {
    id: 't2-warm-hat-cool-shoes',
    tier: 2,
    rule: and(trait('headwear', 'warm'), trait('footwear', 'cool')),
    answer: 'Warm headwear AND cool footwear.',
  },
  {
    id: 't2-beret-or-kite',
    tier: 2,
    rule: or(is('headwear', 'beret'), is('item', 'kite')),
    answer: 'A red beret or a kite.',
  },
  {
    id: 't2-round-hat-xor-round-item',
    tier: 2,
    rule: xor(trait('headwear', 'round'), trait('item', 'round')),
    answer: 'Round headwear or a round item, but not both.',
  },
  {
    id: 't2-pointy-top-no-sneakers',
    tier: 2,
    rule: and(trait('top', 'pointy'), not(is('footwear', 'sneakers'))),
    answer: 'A pointy top and no sneakers.',
  },
  {
    id: 't2-warm-hat-or-warm-item',
    tier: 2,
    rule: or(trait('headwear', 'warm'), trait('item', 'warm')),
    answer: 'Warm headwear OR a warm item.',
  },
  {
    id: 't2-cool-top-round-item',
    tier: 2,
    rule: and(trait('top', 'cool'), trait('item', 'round')),
    answer: 'A cool top AND a round item.',
  },
  {
    id: 't2-puffer-or-lantern',
    tier: 2,
    rule: or(is('top', 'puffer'), is('item', 'lantern')),
    answer: 'An orange puffer or a lantern.',
  },
  {
    id: 't2-no-heels-no-torch',
    tier: 2,
    rule: and(not(is('footwear', 'heels')), not(is('item', 'torch'))),
    answer: 'No heels and no torch.',
  },
  {
    id: 't2-wizard-or-elf-shoes',
    tier: 2,
    rule: or(is('headwear', 'wizard'), is('footwear', 'elfshoes')),
    answer: 'A wizard hat or elf shoes.',
  },
  {
    id: 't2-pointy-hat-xor-pointy-top',
    tier: 2,
    rule: xor(trait('headwear', 'pointy'), trait('top', 'pointy')),
    answer: 'Pointy headwear or a pointy top, but not both.',
  },
  {
    id: 't2-warm-shoes-pointy-hat',
    tier: 2,
    rule: and(trait('footwear', 'warm'), trait('headwear', 'pointy')),
    answer: 'Warm footwear AND pointy headwear.',
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
    rule: and(same('headwear', 'top', 'temp'), same('top', 'item', 'temp')),
    answer: 'Headwear, top and item all share a temperature.',
  },
  {
    id: 't3-shape-pairs-differ',
    tier: 3,
    rule: xor(
      same('headwear', 'top', 'shape'),
      same('item', 'footwear', 'shape')
    ),
    answer: 'Exactly one pair (headwear/top, item/footwear) matches in shape.',
  },
  {
    id: 't3-hat-shoes-same-temp',
    tier: 3,
    rule: same('headwear', 'footwear', 'temp'),
    answer: 'Headwear and footwear share a temperature.',
  },
  {
    id: 't3-top-shoes-same-shape',
    tier: 3,
    rule: same('top', 'footwear', 'shape'),
    answer: 'Top and footwear share a shape.',
  },
  {
    id: 't3-hat-item-same-temp',
    tier: 3,
    rule: same('headwear', 'item', 'temp'),
    answer: 'Headwear and item share a temperature.',
  },
  {
    id: 't3-top-item-differ-shape',
    tier: 3,
    rule: not(same('top', 'item', 'shape')),
    answer: 'Top and item have different shapes.',
  },
  {
    id: 't3-hat-top-differ-temp',
    tier: 3,
    rule: not(same('headwear', 'top', 'temp')),
    answer: 'Headwear and top have different temperatures.',
  },
  {
    id: 't3-hat-top-same-shape-warm-item',
    tier: 3,
    rule: and(same('headwear', 'top', 'shape'), trait('item', 'warm')),
    answer: 'Headwear and top share a shape, AND the item is warm.',
  },
  {
    id: 't3-top-item-same-temp-round-hat',
    tier: 3,
    rule: and(same('top', 'item', 'temp'), trait('headwear', 'round')),
    answer: 'Top and item share a temperature, AND the headwear is round.',
  },
  {
    id: 't3-temp-pairs-differ',
    tier: 3,
    rule: xor(
      same('headwear', 'item', 'temp'),
      same('top', 'footwear', 'temp')
    ),
    answer:
      'Exactly one pair (headwear/item, top/footwear) matches in temperature.',
  },
  {
    id: 't3-shoes-match-hat-or-top-temp',
    tier: 3,
    rule: or(
      same('headwear', 'footwear', 'temp'),
      same('top', 'footwear', 'temp')
    ),
    answer: 'Footwear shares a temperature with the headwear OR the top.',
  },
];
