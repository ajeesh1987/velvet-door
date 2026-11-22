export const ATTRS = ['headwear', 'top', 'item', 'footwear'] as const;
export type Attr = (typeof ATTRS)[number];

export type Temp = 'warm' | 'cool';
export type Shape = 'round' | 'pointy';
export type Trait = Temp | Shape;

/** One value id per attribute, e.g. { headwear: 'beret', top: 'puffer', ... } */
export type Guest = Record<Attr, string>;

export type Rule =
  | { op: 'is'; attr: Attr; val: string }
  | { op: 'in'; attr: Attr; vals: string[] }
  | { op: 'trait'; attr: Attr; trait: Trait }
  | { op: 'same'; a: Attr; b: Attr; kind: 'temp' | 'shape' }
  | { op: 'not'; r: Rule }
  | { op: 'and' | 'or' | 'xor'; l: Rule; r: Rule };

export interface BankEntry {
  id: string;
  tier: 1 | 2 | 3;
  rule: Rule;
  /** Plain-English answer shown on the result card */
  answer: string;
}
