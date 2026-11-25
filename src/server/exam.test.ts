import { expect } from 'vitest';
import { context } from '@devvit/web/server';
import { test } from './test';
import { appRouter } from './trpc';
import { MIN_PROBES } from '../shared/result';
import { ALL_GUESTS } from '../shared/engine';

const caller = () => appRouter.createCaller({} as never);

test('the exam stays locked until enough guests are sent', async () => {
  expect(context.userId).toBeTruthy();
  await expect(caller().door.examStart()).rejects.toThrow();
});

test('a full exam ends with a saved result, and cannot be replayed', async () => {
  const api = caller();
  for (const g of ALL_GUESTS.slice(0, 40)) {
    const today = await api.door.today();
    if (today.probes.length >= MIN_PROBES) break;
    await api.door.probe(g);
  }
  const view = await api.door.examStart();
  expect(view.guests.length).toBeGreaterThan(0);
  expect(view.calls).toEqual([]);

  let last: Awaited<ReturnType<typeof api.door.examAnswer>> | undefined;
  for (let i = 0; i < view.guests.length; i++) {
    last = await api.door.examAnswer({ call: true });
    if (last.status !== 'active') break;
  }
  expect(last?.result).toBeTruthy();
  expect(last?.result?.answer.length).toBeGreaterThan(0);

  const after = await api.door.today();
  expect(after.result).toEqual(last?.result);
  expect(after.exam).toBeNull();
  await expect(api.door.examAnswer({ call: true })).rejects.toThrow();

  const preview = await api.door.sharePreview();
  expect(preview.posted).toBe(false);
  expect(preview.text).toContain('Velvet Rope');
  expect(preview.text).not.toContain(last?.result?.answer ?? 'x');
});

test('sharing is refused before the day is finished', async () => {
  await expect(caller().door.sharePreview()).rejects.toThrow();
});
