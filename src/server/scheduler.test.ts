import { expect } from 'vitest';
import { test } from './test';
import { scheduler } from './routes/scheduler';

test('the daily task makes one post per door', async () => {
  const first = await scheduler.request('/daily-door', { method: 'POST' });
  const body = (await first.json()) as { status: string; created?: boolean };
  expect(body.status).toBe('ok');
  expect(body.created).toBe(true);

  const again = await scheduler.request('/daily-door', { method: 'POST' });
  const second = (await again.json()) as { created?: boolean };
  expect(second.created).toBe(false);
});
