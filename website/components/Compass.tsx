// Custom compass icon — also the easter-egg glyph that rotates on scroll.
export default function Compass({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <circle cx="24" cy="24" r="2.4" fill="currentColor" />
      {/* North-south needle */}
      <path
        d="M24 8 L28 24 L24 40 L20 24 Z"
        fill="currentColor"
        opacity="0.95"
      />
      {/* tick marks */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * Math.PI) / 4;
        const x1 = 24 + Math.sin(a) * 18;
        const y1 = 24 - Math.cos(a) * 18;
        const x2 = 24 + Math.sin(a) * 20.5;
        const y2 = 24 - Math.cos(a) * 20.5;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.4"
          />
        );
      })}
    </svg>
  );
}
