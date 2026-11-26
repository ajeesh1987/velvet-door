import { afterEach, describe, expect, it, vi } from 'vitest';

let requestExpandedModeMock: ReturnType<typeof vi.fn>;

vi.mock('@devvit/web/client', () => {
  requestExpandedModeMock = vi.fn();
  return { requestExpandedMode: requestExpandedModeMock };
});

vi.mock('./trpc', () => ({
  trpc: {
    door: {
      today: {
        query: vi.fn().mockResolvedValue({
          number: 1,
          dateLabel: 'Tuesday, November 24',
          difficulty: 'easy',
          starters: [],
          probes: [],
          exam: null,
          result: null,
          streak: { count: 0, rank: null },
          subreddit: 'velvet_door_dev',
        }),
      },
    },
  },
}));

afterEach(() => {
  requestExpandedModeMock?.mockReset();
});

describe('Splash', () => {
  it('opens the game when the player taps "Open the door"', async () => {
    document.body.innerHTML = '<div id="root"></div>';
    await import('./splash');
    await new Promise((r) => setTimeout(r, 0));

    const button = Array.from(document.querySelectorAll('button')).find((b) =>
      /open the door/i.test(b.textContent ?? '')
    );
    expect(button).toBeTruthy();

    button!.click();

    expect(requestExpandedModeMock).toHaveBeenCalledTimes(1);
    expect(requestExpandedModeMock.mock.calls[0]?.[1]).toBe('game');
  });
});
