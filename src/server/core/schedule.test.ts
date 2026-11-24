import { expect } from 'vitest';
import { test } from '../test';
import { BANK } from '../../shared/bank';
import { RULE_META } from '../../shared/bank.generated';
import { LAUNCH_DAY } from '../../shared/door';
import { alreadyTested, decide } from '../../shared/judge';
import { loadProbes, saveProbes } from './door';
import { SCHEDULE, doorForDay, startersFor } from './schedule';

test('Door 1 is an easy door and the schedule gets harder', () => {
  const first = doorForDay(LAUNCH_DAY);
  expect(first.number).toBe(1);
  expect(first.difficulty).toBe('easy');
  const probes = SCHEDULE.map((e) => RULE_META[e.id]?.botProbes ?? 99);
  expect(probes).toEqual([...probes].sort((a, b) => a - b));
});

test('The schedule wraps around the bank', () => {
  const again = doorForDay(LAUNCH_DAY + BANK.length);
  expect(again.entry.id).toBe(doorForDay(LAUNCH_DAY).entry.id);
  expect(again.number).toBe(BANK.length + 1);
});

test('Starter guests agree with the rule', () => {
  for (const entry of BANK) {
    const { admit, reject } = startersFor(entry.id);
    expect(decide(entry.rule, admit)).toBe(true);
    expect(decide(entry.rule, reject)).toBe(false);
  }
});

test('Probes round-trip through storage and dedupe', async () => {
  const entry = doorForDay(LAUNCH_DAY).entry;
  const { admit } = startersFor(entry.id);
  expect(await loadProbes(1, 'u1')).toEqual([]);
  await saveProbes(1, 'u1', [{ guest: admit, admit: true }]);
  const stored = await loadProbes(1, 'u1');
  expect(stored).toHaveLength(1);
  expect(alreadyTested(stored, admit)?.admit).toBe(true);
  expect(await loadProbes(1, 'someone-else')).toEqual([]);
});
