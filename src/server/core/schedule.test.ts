import { expect } from 'vitest';
import { test } from '../test';
import { BANK } from '../../shared/bank';
import { LAUNCH_DAY } from '../../shared/door';
import { alreadyTested, decide } from '../../shared/judge';
import { loadProbes, saveProbes } from './door';
import { WEEK, difficultyForDay, doorForDay, startersFor } from './schedule';

test('Door 1 is an easy door', () => {
  const first = doorForDay(LAUNCH_DAY);
  expect(first.number).toBe(1);
  expect(first.difficulty).toBe('easy');
});

test('Every day gets the difficulty its weekday calls for', () => {
  for (let d = LAUNCH_DAY; d < LAUNCH_DAY + 60; d++) {
    const door = doorForDay(d);
    expect(door.difficulty).toBe(difficultyForDay(d));
    const weekday = new Date(d * 86_400_000).getUTCDay();
    expect(door.difficulty).toBe(WEEK[weekday]);
  }
});

test('A week mixes easy, medium and hard doors', () => {
  const week = Array.from(
    { length: 7 },
    (_, i) => doorForDay(LAUNCH_DAY + i).difficulty
  );
  expect(new Set(week)).toEqual(new Set(['easy', 'medium', 'hard']));
});

test('No rule repeats within the first two weeks', () => {
  const ids = Array.from(
    { length: 14 },
    (_, i) => doorForDay(LAUNCH_DAY + i).entry.id
  );
  expect(new Set(ids).size).toBe(ids.length);
});

test('Doors are deterministic and the pools wrap without gaps', () => {
  for (let d = LAUNCH_DAY; d < LAUNCH_DAY + 400; d++) {
    expect(doorForDay(d).entry.id).toBe(doorForDay(d).entry.id);
  }
  expect(doorForDay(LAUNCH_DAY + 365).entry).toBeTruthy();
  expect(doorForDay(LAUNCH_DAY - 5).number).toBe(1);
});

test('Every rule in the bank gets used eventually', () => {
  const seen = new Set<string>();
  for (let d = LAUNCH_DAY; d < LAUNCH_DAY + 400; d++) {
    seen.add(doorForDay(d).entry.id);
  }
  expect(seen.size).toBe(BANK.length);
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
