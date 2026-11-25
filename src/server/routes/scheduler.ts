import { Hono } from 'hono';
import { createDailyPostOnce } from '../core/post';

export const scheduler = new Hono();

/** Runs at 00:00 UTC, when the next door opens. */
scheduler.post('/daily-door', async (c) => {
  try {
    const out = await createDailyPostOnce();
    return c.json({ status: 'ok', ...out }, 200);
  } catch (error) {
    console.error(`daily-door failed: ${error}`);
    return c.json({ status: 'error' }, 500);
  }
});
