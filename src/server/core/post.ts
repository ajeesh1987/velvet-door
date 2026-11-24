import { reddit } from '@devvit/web/server';
import { utcDayIndex } from '../../shared/streak';
import { doorForDay } from './schedule';

export const createPost = async () => {
  const { number } = doorForDay(utcDayIndex());
  return await reddit.submitCustomPost({
    title: `Velvet Rope - Door #${number}`,
  });
};
