import { Hono } from 'hono';
import type { UiResponse } from '@devvit/web/shared';
import { context, reddit, redis } from '@devvit/web/server';
import { createPost } from '../core/post';
import { finishDay, resetStreak } from '../core/streak';
import { utcDayIndex } from '../../shared/streak';

export const menu = new Hono();

menu.post('/post-create', async (c) => {
  try {
    const post = await createPost();

    return c.json<UiResponse>(
      {
        navigateTo: `https://reddit.com/comments/${post.id}`,
      },
      200
    );
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    return c.json<UiResponse>(
      {
        showToast: 'Failed to create post',
      },
      400
    );
  }
});

// ---- Temporary streak test tools: remove before submission ----
// The "debug offset" fakes the passing of days so you can click through them.

const offsetKey = (userId: string) => `debug:offset:${userId}`;

menu.post('/spike-finish', async (c) => {
  const { userId, subredditName } = context;
  try {
    const username = await reddit.getCurrentUsername();
    if (!userId || !username || !subredditName) {
      return c.json<UiResponse>({ showToast: 'Missing user or sub' }, 400);
    }
    const offset = await redis.incrBy(offsetKey(userId), 1);
    const out = await finishDay({
      userId,
      username,
      subredditName,
      day: utcDayIndex() + offset,
    });
    const msg = out.flair ?? `No change (streak ${out.state.count})`;
    return c.json<UiResponse>({ showToast: msg }, 200);
  } catch (error) {
    console.error(`spike-finish FAILED: ${error}`);
    return c.json<UiResponse>({ showToast: 'Failed, see terminal' }, 400);
  }
});

menu.post('/spike-skip', async (c) => {
  const { userId } = context;
  if (!userId) {
    return c.json<UiResponse>({ showToast: 'No user' }, 400);
  }
  const offset = await redis.incrBy(offsetKey(userId), 1);
  return c.json<UiResponse>({ showToast: `Skipped a day (+${offset})` }, 200);
});

menu.post('/spike-reset', async (c) => {
  const { userId, subredditName } = context;
  try {
    const username = await reddit.getCurrentUsername();
    if (!userId || !username || !subredditName) {
      return c.json<UiResponse>({ showToast: 'Missing user or sub' }, 400);
    }
    await resetStreak(userId);
    await redis.del(offsetKey(userId));
    await reddit.removeUserFlair(subredditName, username);
    return c.json<UiResponse>({ showToast: 'Streak and flair cleared' }, 200);
  } catch (error) {
    console.error(`spike-reset FAILED: ${error}`);
    return c.json<UiResponse>({ showToast: 'Failed, see terminal' }, 400);
  }
});
