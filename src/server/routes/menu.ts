import { Hono } from 'hono';
import type { UiResponse } from '@devvit/web/shared';
import { context, reddit } from '@devvit/web/server';
import { createPost } from '../core/post';

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

// ---- Day 2 spike: delete these two routes once we know the answers ----

menu.post('/spike-comment', async (c) => {
  const { postId } = context;
  if (!postId) {
    return c.json<UiResponse>({ showToast: 'No post in context' }, 400);
  }
  try {
    const comment = await reddit.submitComment({
      id: postId,
      text: 'Velvet Rope spike: test comment (safe to delete)',
      runAs: 'USER',
    });
    console.log(`spike-comment OK, author: ${comment.authorName}`);
    return c.json<UiResponse>(
      { showToast: `Commented as u/${comment.authorName}` },
      200
    );
  } catch (error) {
    console.error(`spike-comment FAILED: ${error}`);
    return c.json<UiResponse>(
      { showToast: 'Comment failed, check the terminal' },
      400
    );
  }
});

menu.post('/spike-flair', async (c) => {
  const { subredditName } = context;
  try {
    const username = await reddit.getCurrentUsername();
    if (!subredditName || !username) {
      return c.json<UiResponse>({ showToast: 'Missing sub or user' }, 400);
    }
    await reddit.setUserFlair({
      subredditName,
      username,
      text: 'Doorman - 3 day streak',
    });
    console.log(`spike-flair OK for u/${username}`);
    return c.json<UiResponse>({ showToast: `Flair set for u/${username}` }, 200);
  } catch (error) {
    console.error(`spike-flair FAILED: ${error}`);
    return c.json<UiResponse>(
      { showToast: 'Flair failed, check the terminal' },
      400
    );
  }
});
