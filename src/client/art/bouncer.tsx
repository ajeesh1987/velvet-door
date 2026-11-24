export type Mood = 'idle' | 'squint' | 'admit' | 'reject';

const SKIN = '#d9a77a';
const INK = '#2a1b17';

const Face = ({ mood }: { mood: Mood }) => {
  const eyes =
    mood === 'admit' ? (
      <>
        <path d="M168 113Q172 107 176 113" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path d="M184 113Q188 107 192 113" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      </>
    ) : mood === 'squint' ? (
      <>
        <path d="M168 111Q172 108 176 111" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path d="M184 111Q188 108 192 111" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      </>
    ) : (
      <>
        <ellipse cx="172" cy="111" rx="3.4" ry="3.8" fill="#fff" />
        <ellipse cx="188" cy="111" rx="3.4" ry="3.8" fill="#fff" />
        <circle cx="172" cy="111.5" r="1.9" fill={INK} />
        <circle cx="188" cy="111.5" r="1.9" fill={INK} />
      </>
    );
  const brows =
    mood === 'admit' ? (
      <>
        <path d="M166 101Q172 96 178 99" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <path d="M182 99Q188 96 194 101" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      </>
    ) : mood === 'reject' ? (
      <>
        <path d="M166 98L178 104" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        <path d="M194 98L182 104" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      </>
    ) : mood === 'squint' ? (
      <>
        <path d="M166 104L178 102" stroke={INK} strokeWidth="2.8" strokeLinecap="round" />
        <path d="M182 97L194 100" stroke={INK} strokeWidth="2.8" strokeLinecap="round" />
      </>
    ) : (
      <>
        <path d="M166 102L178 101" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
        <path d="M182 101L194 102" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
      </>
    );
  const mouth =
    mood === 'admit' ? (
      <path d="M171 119Q180 130 189 119Z" fill="#fff" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    ) : mood === 'reject' ? (
      <path d="M172 125Q180 117 188 125" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
    ) : mood === 'squint' ? (
      <path d="M174 122Q181 120 187 123" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
    ) : (
      <path d="M174 122H186" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
    );
  return (
    <>
      {eyes}
      {brows}
      {mouth}
    </>
  );
};

/** The bouncer, centered at x = 180. His head animates with the mood. */
export const Bouncer = ({ mood }: { mood: Mood }) => (
  <g>
    <path
      d="M140 214V160Q140 139 162 136H198Q220 139 220 160V214Z"
      fill="#2c2528"
      stroke="#56464b"
      strokeWidth="1.5"
    />
    <polygon points="164,136 196,136 180,172" fill="#efe3cf" />
    <polygon points="180,146 167,138 167,154" fill="#d4af37" />
    <polygon points="180,146 193,138 193,154" fill="#d4af37" />
    <circle cx="180" cy="146" r="2.6" fill="#a8841f" />
    <rect x="172" y="124" width="16" height="16" fill="#c28f63" />
    <g className={mood === 'admit' ? 'nod' : mood === 'reject' ? 'shake' : ''}>
      <circle cx="159" cy="111" r="4.5" fill={SKIN} />
      <circle cx="201" cy="111" r="4.5" fill={SKIN} />
      <circle cx="180" cy="108" r="22" fill={SKIN} />
      <path d="M158 104Q159 82 180 82Q201 82 202 104Q192 92 180 92Q168 92 158 104Z" fill="#2a1b17" />
      <Face mood={mood} />
    </g>
  </g>
);
