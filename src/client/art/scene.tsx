import type { Guest } from '../../shared/types';
import { Bouncer, type Mood } from './bouncer';
import { GuestFigure } from './guest';

export type Phase = 'idle' | 'arriving' | 'admit' | 'reject';

const moodOf = (phase: Phase): Mood =>
  phase === 'arriving' ? 'squint' : phase === 'idle' ? 'idle' : phase;

/** Guest offsets in the guest group's own units (the group is scaled 0.68). */
const guestMotion = (phase: Phase) => {
  switch (phase) {
    case 'arriving':
      return { transform: 'translate(46px, 0px) scale(1)', opacity: 1 };
    case 'admit':
      return { transform: 'translate(196px, -22px) scale(0.55)', opacity: 0 };
    case 'reject':
      return { transform: 'translate(-190px, 0px) scale(1)', opacity: 0 };
    case 'idle':
      return { transform: 'translate(0px, 0px) scale(1)', opacity: 1 };
  }
};

const Post = ({ x }: { x: number }) => (
  <g>
    <ellipse cx={x} cy="214" rx="12" ry="3.5" fill="#a8841f" />
    <rect x={x - 4} y="160" width="8" height="54" fill="#c9a02f" />
    <rect x={x - 2} y="160" width="2" height="54" fill="#f1d77a" opacity="0.8" />
    <circle cx={x} cy="156" r="7" fill="#d4af37" />
    <circle cx={x - 2} cy="154" r="2" fill="#fff1b8" />
  </g>
);

export const DoorScene = ({
  phase,
  guest,
  cycle,
  className,
}: {
  phase: Phase;
  guest: Guest | null;
  cycle: number;
  className?: string;
}) => {
  const motion = guestMotion(phase);
  const moving = phase !== 'idle';
  return (
    <svg
      viewBox="0 0 360 240"
      className={className}
      role="img"
      aria-label="A bouncer guarding a velvet rope"
    >
      <defs>
        <radialGradient id="vr-spot" cx="50%" cy="48%" r="55%">
          <stop offset="0%" stopColor="#ffd98c" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#ffd98c" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="vr-door" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a2a33" />
          <stop offset="100%" stopColor="#3b1319" />
        </linearGradient>
      </defs>
      <rect width="360" height="240" rx="12" fill="#2a191b" />
      <rect x="0" y="214" width="360" height="26" fill="#1d1213" />
      <line x1="0" y1="214" x2="360" y2="214" stroke="#d4af37" strokeWidth="0.75" opacity="0.6" />
      <ellipse cx="180" cy="130" rx="170" ry="120" fill="url(#vr-spot)" />
      <path d="M105 214V120A75 75 0 0 1 255 120V214Z" fill="#4a1a22" stroke="#d4af37" strokeWidth="2" />
      <path d="M120 214V122A60 60 0 0 1 240 122V214Z" fill="url(#vr-door)" />
      <Bouncer mood={moodOf(phase)} />
      {guest ? (
        <g transform="translate(6 85) scale(0.68)">
          <g
            key={cycle}
            className={phase === 'idle' ? 'guest-in' : undefined}
            style={{
              ...motion,
              transition: moving
                ? 'transform 650ms ease-in-out, opacity 650ms ease-in'
                : 'none',
            }}
          >
            <GuestFigure guest={guest} />
          </g>
        </g>
      ) : null}
      <Post x={98} />
      <Post x={262} />
      <g style={{ opacity: phase === 'admit' ? 0 : 1, transition: 'opacity 250ms' }}>
        <path d="M98 167Q180 207 262 167" stroke="#000" strokeOpacity="0.35" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M98 164Q180 204 262 164" stroke="#b3193a" strokeWidth="5" fill="none" strokeLinecap="round" />
      </g>
      <g style={{ opacity: phase === 'admit' ? 1 : 0, transition: 'opacity 250ms' }}>
        <path d="M262 164Q236 198 200 212" stroke="#b3193a" strokeWidth="5" fill="none" strokeLinecap="round" />
        <circle cx="98" cy="164" r="3" fill="#d4af37" />
      </g>
    </svg>
  );
};
