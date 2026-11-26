import { context, reddit, redis } from '@devvit/web/server';
import { utcDayIndex } from '../../shared/streak';
import { recapText } from '../../shared/recap';
import { doorForDay } from './schedule';
import { loadStats } from './stats';

const FLAIR_TEXT = 'Daily Puzzle';
const dailyKey = (n: number) => `daily:post:${n}`;
const LAST_KEY = 'daily:last';

/** Finds the "Daily Puzzle" post flair, creating it the first time. */
const ensureFlairId = async (
  subredditName: string
): Promise<string | undefined> => {
  try {
    const all = await reddit.getPostFlairTemplates(subredditName);
    const hit = all.find((t) => t.text === FLAIR_TEXT);
    if (hit) return hit.id;
    const made = await reddit.createPostFlairTemplate({
      subredditName,
      text: FLAIR_TEXT,
      backgroundColor: '#7a1c2c',
      textColor: 'light',
      modOnly: true,
    });
    return made.id;
  } catch (error) {
    console.error(`flair setup failed: ${error}`);
    return undefined;
  }
};

/** Yesterday's answer and numbers, as a pinned comment under today's post. */
const postRecap = async (post: { id: `t3_${string}` }): Promise<void> => {
  const today = utcDayIndex();
  const { number } = doorForDay(today);
  if (number <= 1) return;
  try {
    const key = `daily:recap:${number}`;
    if (await redis.get(key)) return;
    const yesterday = doorForDay(today - 1);
    const text = recapText({
      doorNumber: yesterday.number,
      answer: yesterday.entry.answer,
      stats: await loadStats(yesterday.number),
    });
    if (!text) return;
    const comment = await reddit.submitComment({ id: post.id, text });
    await redis.set(key, comment.id);
    try {
      await comment.distinguish(true);
    } catch (error) {
      console.error(`recap pin failed: ${error}`);
    }
  } catch (error) {
    console.error(`recap failed: ${error}`);
  }
};

/** Creates today's numbered post with flair, and pins it. */
export const createPost = async () => {
  const { number } = doorForDay(utcDayIndex());
  const { subredditName } = context;
  const flairId = subredditName
    ? await ensureFlairId(subredditName)
    : undefined;
  const post = await reddit.submitCustomPost({
    title: `Velvet Rope - Door #${number}`,
    ...(flairId ? { flairId } : {}),
  });
  await redis.set(dailyKey(number), post.id);

  // Set the flair explicitly too: submitting with a flairId alone has not
  // always stuck on custom posts.
  if (flairId && subredditName) {
    try {
      await reddit.setPostFlair({
        subredditName,
        postId: post.id,
        flairTemplateId: flairId,
      });
      console.log(`daily flair set on ${post.id}`);
    } catch (error) {
      console.error(`setPostFlair failed: ${error}`);
    }
  } else {
    console.error('daily flair skipped: no flair id');
  }

  try {
    const last = await redis.get(LAST_KEY);
    if (last && last !== post.id) {
      const old = await reddit.getPostById(last as typeof post.id);
      await old.unsticky();
    }
    await post.sticky(1);
    await redis.set(LAST_KEY, post.id);
  } catch (error) {
    console.error(`pinning failed: ${error}`);
  }
  try {
    await post.approve();
  } catch (error) {
    console.error(`approve skipped: ${error}`);
  }
  await postRecap(post);
  return post;
};

/** For the scheduler: one post per door, even if a mod already made it. */
export const createDailyPostOnce = async (): Promise<{
  created: boolean;
  id: string;
}> => {
  const { number } = doorForDay(utcDayIndex());
  const existing = await redis.get(dailyKey(number));
  if (existing) return { created: false, id: existing };
  const post = await createPost();
  return { created: true, id: post.id };
};
