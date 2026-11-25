export type Mood = 'idle' | 'squint' | 'admit' | 'reject';

const SKIN = '#b9784a';
const SKIN_D = '#8f5a34';
const INK = '#24160f';
const LENS = '#0b0809';

const Glasses = ({ dy }: { dy: number }) => (
  <g transform={`translate(0 ${dy})`}>
    <rect x="160" y="99" width="18" height="12" rx="4.5" fill={LENS} />
    <rect x="182" y="99" width="18" height="12" rx="4.5" fill={LENS} />
    <path d="M178 103Q180 101 182 103" stroke={LENS} strokeWidth="2.4" fill="none" />
    <path d="M160 102L156 104M200 102L204 104" stroke={LENS} strokeWidth="2.4" strokeLinecap="round" />
    <path d="M164 102L169 102M186 102L191 102" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.6" strokeLinecap="round" />
  </g>
);

const Face = ({ mood }: { mood: Mood }) => {
  switch (mood) {
    case 'squint':
      return (
        <>
          <ellipse cx="169" cy="102" rx="5" ry="3.4" fill="#fff" />
          <ellipse cx="191" cy="102" rx="5" ry="3.4" fill="#fff" />
          <circle cx="171" cy="102.4" r="2.2" fill={INK} />
          <circle cx="193" cy="102.4" r="2.2" fill={INK} />
          <Glasses dy={5} />
          <path d="M162 94L176 97" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M184 89L198 92" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M172 126Q182 122 190 127" stroke={INK} strokeWidth="3.4" fill="none" strokeLinecap="round" />
        </>
      );
    case 'admit':
      return (
        <>
          <Glasses dy={0} />
          <path d="M162 94Q169 88 177 92" stroke={INK} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M183 92Q191 88 198 94" stroke={INK} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M166 119Q180 136 194 119Z" fill="#fff" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M172 121.5H188" stroke={INK} strokeWidth="1" opacity="0.5" />
        </>
      );
    case 'reject':
      return (
        <>
          <Glasses dy={0} />
          <path d="M161 92L178 98" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M199 92L182 98" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M169 130Q180 117 191 130" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      );
    case 'idle':
      return (
        <>
          <Glasses dy={0} />
          <path d="M162 94L177 93" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M183 93L198 94" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M171 125H189" stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
        </>
      );
  }
};

/** A raised palm that says stop. Only shown when he turns someone away. */
const StopHand = () => (
  <g className="guest-in">
    <rect x="216" y="150" width="9" height="32" rx="4.5" fill={SKIN} transform="rotate(14 220 166)" />
    <rect x="226" y="146" width="9" height="36" rx="4.5" fill={SKIN} transform="rotate(6 230 164)" />
    <rect x="236" y="148" width="9" height="34" rx="4.5" fill={SKIN} transform="rotate(-2 240 165)" />
    <rect x="246" y="153" width="8" height="28" rx="4" fill={SKIN} transform="rotate(-10 250 167)" />
    <rect x="218" y="168" width="38" height="26" rx="11" fill={SKIN} />
    <rect x="224" y="188" width="26" height="30" rx="6" fill="#24202a" />
  </g>
);

/** The bouncer, centered at x = 180. His head animates with the mood. */
export const Bouncer = ({ mood }: { mood: Mood }) => (
  <g>
    <path
      d="M128 214V166Q128 141 156 137H204Q232 141 232 166V214Z"
      fill="#1f1a1c"
      stroke="#5b4b51"
      strokeWidth="1.5"
    />
    <polygon points="166,137 194,137 180,180" fill="#efe3cf" />
    <polygon points="156,138 168,137 181,181 158,170" fill="#2e2629" stroke="#5b4b51" strokeWidth="1" />
    <polygon points="204,138 192,137 179,181 202,170" fill="#2e2629" stroke="#5b4b51" strokeWidth="1" />
    <polygon points="180,148 166,139 166,157" fill="#d4af37" />
    <polygon points="180,148 194,139 194,157" fill="#d4af37" />
    <circle cx="180" cy="148" r="3" fill="#a8841f" />
    <rect x="171" y="122" width="18" height="18" fill={SKIN_D} />
    <g className={mood === 'admit' ? 'nod' : mood === 'reject' ? 'shake' : ''}>
     <g transform="translate(180 120) scale(0.84) translate(-180 -120)">
      <circle cx="157" cy="111" r="5" fill={SKIN_D} />
      <circle cx="203" cy="111" r="5" fill={SKIN_D} />
      <ellipse cx="180" cy="108" rx="25" ry="25" fill={SKIN} />
      <ellipse cx="172" cy="90" rx="9" ry="4" fill="#fff" opacity="0.14" />
      <Face mood={mood} />
     </g>
    </g>
    {mood === 'reject' ? <StopHand /> : null}
  </g>
);
