export type Mood = 'idle' | 'squint' | 'admit' | 'reject';

const SKIN = '#b9784a';
const SKIN_D = '#8f5a34';
const INK = '#24160f';
const LENS = '#0b0809';

const Glasses = ({ dy }: { dy: number }) => (
  <g transform={`translate(0 ${dy})`}>
    <rect x="161" y="99" width="17" height="12" rx="4.5" fill={LENS} />
    <rect x="182" y="99" width="17" height="12" rx="4.5" fill={LENS} />
    <path d="M178 103Q180 101 182 103" stroke={LENS} strokeWidth="2.4" fill="none" />
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
          <path d="M171 129Q180 121 189 129" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      );
    case 'idle':
      return (
        <>
          <Glasses dy={0} />
          <path d="M163 96L177 95" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M183 95L197 96" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M171 125H189" stroke={INK} strokeWidth="3.4" strokeLinecap="round" />
        </>
      );
  }
};

const SL = '#262024';
const ED = '#5b4b51';

/** Reject pose: right arm up with an open palm, left arm hanging at his side. */
const StopHand = () => (
  <g className="guest-in">
    <path d="M138 154L137 186" stroke={ED} strokeWidth="14.5" strokeLinecap="round" />
    <path d="M138 154L137 186" stroke={SL} strokeWidth="12" strokeLinecap="round" />
    <circle cx="137" cy="191" r="6" fill={SKIN} />
    <path d="M224 152L240 168L240 146" stroke={ED} strokeWidth="14.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M224 152L240 168L240 146" stroke={SL} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <rect x="231" y="124" width="18" height="18" rx="7" fill={SKIN} />
    <rect x="231" y="111" width="4" height="17" rx="2" fill={SKIN} />
    <rect x="236" y="108" width="4" height="19" rx="2" fill={SKIN} />
    <rect x="241" y="109" width="4" height="18" rx="2" fill={SKIN} />
    <rect x="246" y="113" width="4" height="15" rx="2" fill={SKIN} />
    <rect x="226" y="128" width="4.5" height="11" rx="2.2" fill={SKIN} transform="rotate(-25 228 133)" />
  </g>
);

/** The bouncer, centered at x = 180. His head animates with the mood. */
export const Bouncer = ({ mood }: { mood: Mood }) => (
  <g>
    <rect x="158" y="184" width="19" height="30" rx="3" fill="#141012" />
    <rect x="183" y="184" width="19" height="30" rx="3" fill="#141012" />
    <ellipse cx="164" cy="213" rx="13" ry="3.5" fill="#0b0809" />
    <ellipse cx="196" cy="213" rx="13" ry="3.5" fill="#0b0809" />
    <path
      d="M134 170Q132 142 157 137H203Q228 142 226 170L219 192H141Z"
      fill="#1c1719"
      stroke={ED}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <polygon points="169,137 191,137 180,172" fill="#e9e0d0" />
    <polygon points="157,138 169,137 181,174 160,165" fill="#2a2226" stroke={ED} strokeWidth="1" />
    <polygon points="203,138 191,137 179,174 200,165" fill="#2a2226" stroke={ED} strokeWidth="1" />
    <polygon points="177.5,142 182.5,142 183.5,166 180,170 176.5,166" fill="#0f0b0d" />
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
    {mood !== 'reject' ? (
      <g>
        <path d="M143 156L198 168" stroke={ED} strokeWidth="14.5" strokeLinecap="round" />
        <path d="M143 156L198 168" stroke={SL} strokeWidth="12" strokeLinecap="round" />
        <path d="M217 156L162 168" stroke={ED} strokeWidth="14.5" strokeLinecap="round" />
        <path d="M217 156L162 168" stroke={SL} strokeWidth="12" strokeLinecap="round" />
        <circle cx="199" cy="169" r="6" fill={SKIN} />
        <circle cx="161" cy="169" r="6" fill={SKIN} />
      </g>
    ) : null}
    <circle cx="199.5" cy="112" r="2.6" fill="#0f0b0d" stroke="#cfc7b8" strokeWidth="0.8" />
    <path d="M198 115Q205 126 199 138" stroke="#cfc7b8" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    {mood === 'reject' ? <StopHand /> : null}
  </g>
);
