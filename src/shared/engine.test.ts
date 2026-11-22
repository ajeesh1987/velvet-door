import { describe, expect, it } from 'vitest';
import { BANK } from './bank';
import { ALL_GUESTS, evalRule } from './engine';
import { checkBank } from './validate';

describe('engine', () => {
  it('has 256 unique guests', () => {
    expect(ALL_GUESTS).toHaveLength(256);
  });

  it('evaluates trait and relational rules', () => {
    const g = {
      headwear: 'beret',
      top: 'puffer',
      item: 'kite',
      footwear: 'heels',
    };
    expect(evalRule({ op: 'trait', attr: 'headwear', trait: 'warm' }, g)).toBe(
      true,
    );
    expect(
      evalRule({ op: 'same', a: 'headwear', b: 'top', kind: 'temp' }, g),
    ).toBe(true);
    expect(
      evalRule({ op: 'same', a: 'item', b: 'footwear', kind: 'shape' }, g),
    ).toBe(true);
    expect(
      evalRule({ op: 'same', a: 'item', b: 'footwear', kind: 'temp' }, g),
    ).toBe(false);
  });
});

describe('bank', () => {
  it('passes validation', () => {
    expect(checkBank(BANK)).toEqual([]);
  });
});
