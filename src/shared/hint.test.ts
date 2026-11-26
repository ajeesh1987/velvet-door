import { describe, expect, it } from 'vitest';
import { BANK } from './bank';
import { attrsOf, hintFor, hintText } from './hint';

describe('hints', () => {
  it('finds the attributes a rule looks at', () => {
    const byId = (id: string) => BANK.find((e) => e.id === id)!.rule;
    expect(attrsOf(byId('t1-warm-hats'))).toEqual(['headwear']);
    expect(attrsOf(byId('t2-warm-hat-round-top'))).toEqual(['headwear', 'top']);
    expect(attrsOf(byId('t3-hat-top-same-temp'))).toEqual(['headwear', 'top']);
    expect(attrsOf(byId('t3-all-same-temp'))).toEqual([
      'headwear',
      'top',
      'item',
    ]);
  });

  it('always names an attribute the rule really uses', () => {
    for (const e of BANK) {
      for (let n = 1; n <= 8; n++) {
        const { attr, total } = hintFor(e.rule, n);
        expect(attrsOf(e.rule)).toContain(attr);
        expect(total).toBe(attrsOf(e.rule).length);
      }
    }
  });

  it('words one and many', () => {
    expect(hintText('top', 1)).toContain('only looks at');
    expect(hintText('top', 2)).toContain('2 parts');
  });
});
