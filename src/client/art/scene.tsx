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
    <ellipse cx={x} cy="214" rx="13" ry="4" fill="#7a5c12" />
    <rect x={x - 9} y="208" width="18" height="6" rx="2" fill="url(#vr-brass)" />
    <rect x={x - 4} y="160" width="8" height="50" fill="url(#vr-brass)" />
    <circle cx={x} cy="156" r="8" fill="url(#vr-ball)" />
    <circle cx={x - 3} cy="153" r="1.8" fill="#fff" opacity="0.9" />
    <path d={`M${x + 11} 150v6M${x + 8} 153h6`} stroke="#fff" strokeWidth="1" opacity="0.7" />
  </g>
);

export const DoorScene = ({
  phase,
  guest,
  cycle,
  framed,
  className,
}: {
  phase: Phase;
  guest: Guest | null;
  cycle: number;
  framed: boolean;
  className?: string;
}) => {
  const motion = guestMotion(phase);
  const moving = phase !== 'idle';
  const open = phase === 'admit';
  return (
    <svg
      viewBox="0 30 360 210"
      className={className}
      role="img"
      aria-label="A bouncer guarding a velvet rope"
    >
      <defs>
        <radialGradient id="vr-glow" cx="50%" cy="46%" r="52%">
          <stop offset="0%" stopColor="#e0553a" stopOpacity="0.85" />
          <stop offset="40%" stopColor="#9a2236" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#3a0f14" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="vr-door" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a2f36" />
          <stop offset="100%" stopColor="#3b1319" />
        </linearGradient>
        <linearGradient id="vr-brass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8a6a14" />
          <stop offset="45%" stopColor="#f3dc84" />
          <stop offset="100%" stopColor="#a8841f" />
        </linearGradient>
        <radialGradient id="vr-ball" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#fff3b8" />
          <stop offset="55%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#8a6a14" />
        </radialGradient>
      </defs>
      {framed ? (
        <rect x="0" y="30" width="360" height="210" rx="12" fill="#150d0f" />
      ) : null}
      <ellipse cx="180" cy="130" rx="230" ry="140" fill="url(#vr-glow)" />
      <path d="M96 214V122A84 84 0 0 1 264 122V214Z" fill="#6a1a2a" stroke="#d4af37" strokeWidth="1.5" />
      <path d="M106 214V124A74 74 0 0 1 254 124V214Z" fill="#541523" />
      <path d="M116 214V126A64 64 0 0 1 244 126V214Z" fill="#40101c" />
      <path d="M126 214V128A54 54 0 0 1 234 128V214Z" fill="url(#vr-door)" />
      <line x1="14" y1="214" x2="346" y2="214" stroke="#d4af37" strokeWidth="0.75" opacity="0.55" />
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
      <Post x={92} />
      <Post x={268} />
      <g style={{ opacity: open ? 0 : 1, transition: 'opacity 250ms' }}>
        <path d="M95 169Q180 214 265 169" stroke="#000" strokeOpacity="0.4" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M95 165Q180 210 265 165" stroke="#9c1530" strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M100 163Q180 207 260 163" stroke="#e0556f" strokeOpacity="0.75" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M97 168Q180 213 263 168" stroke="#5a0a1a" strokeOpacity="0.8" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M96 169V176M264 169V176" stroke="#d4af37" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="89" y="161" width="8" height="8" rx="2" fill="#d4af37" />
        <rect x="263" y="161" width="8" height="8" rx="2" fill="#d4af37" />
      </g>
      <g style={{ opacity: open ? 1 : 0, transition: 'opacity 250ms' }}>
        <path d="M265 165Q238 200 200 212" stroke="#9c1530" strokeWidth="7" fill="none" strokeLinecap="round" />
        <rect x="263" y="161" width="8" height="8" rx="2" fill="#d4af37" />
        <circle cx="94" cy="165" r="3.5" fill="#d4af37" />
      </g>
    </svg>
  );
};
