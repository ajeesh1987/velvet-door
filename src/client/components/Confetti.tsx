const COLORS = ['#d4af37', '#f8e8ad', '#6bbf8f', '#d9605a', '#f1e6d0'];

/** Falling paper for a flawless exam. Hidden when motion is reduced. */
export const Confetti = () => (
  <div
    aria-hidden="true"
    className="vr-confetti pointer-events-none fixed inset-0 overflow-hidden"
  >
    {Array.from({ length: 36 }, (_, i) => (
      <i
        key={i}
        style={{
          left: `${(i * 37) % 100}%`,
          background: COLORS[i % COLORS.length],
          animationDelay: `${(i % 9) * 0.12}s`,
          animationDuration: `${2.2 + (i % 5) * 0.35}s`,
          width: 6 + (i % 3) * 2,
          height: 10 + (i % 4) * 2,
        }}
      />
    ))}
  </div>
);
