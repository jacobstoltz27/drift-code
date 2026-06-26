"use client";

import { useMemo } from "react";

// Ambient night-sky star field. Deterministic positions so SSR matches client.
export default function Starfield({ count = 60 }: { count?: number }) {
  const stars = useMemo(() => {
    // simple seeded pseudo-random for hydration safety
    let seed = 7;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    return Array.from({ length: count }).map(() => ({
      top: rand() * 100,
      left: rand() * 100,
      size: rand() * 2 + 0.5,
      delay: rand() * 4,
      duration: rand() * 3 + 3,
    }));
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-ivory"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: 0.5,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
