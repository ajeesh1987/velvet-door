export const HelpModal = ({ onClose }: { onClose: () => void }) => (
  <div
    className="fixed inset-0 z-10 flex items-center justify-center bg-black/70 p-4"
    role="dialog"
    aria-modal="true"
    aria-label="How to play"
  >
    <div className="w-full max-w-[380px] rounded-2xl border border-gold bg-card p-5">
      <h2 className="font-display text-xl text-gold-soft">How to play</h2>
      <ol className="mt-3 flex list-decimal flex-col gap-2 pl-5 text-[15px] text-cream">
        <li>The bouncer has a secret door policy. Work out the rule.</li>
        <li>Build a guest, then send them to the rope.</li>
        <li>Compare who gets in and who doesn&rsquo;t. Two guests are already on the list.</li>
        <li>Fewer guests means a better score.</li>
      </ol>
      <button
        type="button"
        onClick={onClose}
        className="mt-5 h-11 w-full cursor-pointer rounded-full bg-gold font-medium text-[#2a0a12] transition-colors hover:bg-gold-soft"
      >
        Got it
      </button>
    </div>
  </div>
);
