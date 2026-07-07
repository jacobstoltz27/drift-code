"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

// A filled, top-down airliner silhouette matching the reference photo's
// proportions (fuselage, swept main wings with engine pods, swept tail
// stabilizers), nose pointing right (direction of travel across "drift").
function Plane({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 130 100" className={className} fill="currentColor">
      {/* fuselage */}
      <path d="M4 50 C4 46 14 42 34 42 C60 42 90 44 108 46 C118 47 126 49 126 50 C126 51 118 53 108 54 C90 56 60 58 34 58 C14 58 4 54 4 50 Z" />
      {/* main wings, swept back toward the tail */}
      <path d="M95 45 L38 4 L48 3 L68 18 L100 43 Z" />
      <path d="M95 55 L38 96 L48 97 L68 82 L100 57 Z" />
      {/* engine nacelles */}
      <ellipse cx="79" cy="35" rx="6" ry="3" />
      <ellipse cx="79" cy="65" rx="6" ry="3" />
      {/* tail stabilizers */}
      <path d="M28 46 L8 25 L14 24 L24 40 L34 45 Z" />
      <path d="M28 54 L8 75 L14 76 L24 60 L34 55 Z" />
    </svg>
  );
}

export default function DriftWord({
  progress,
}: {
  // 0 → 1 as the user scrolls through the start of the hero
  progress: MotionValue<number>;
}) {
  // The plane crosses the word; it eases in, flies across, then eases out.
  const planeLeft = useTransform(progress, [0, 1], ["-18%", "118%"]);
  // Gentle vertical arc so the flight feels like flight, not a slide.
  const planeY = useTransform(progress, [0, 0.5, 1], [3, -4, 2]);
  const planeOpacity = useTransform(
    progress,
    [0, 0.06, 0.92, 1],
    [0, 1, 1, 0]
  );
  // The contrail draws in behind the plane.
  const trailScale = useTransform(progress, [0, 1], [0.04, 1]);
  const trailOpacity = useTransform(progress, [0, 0.08, 0.9, 1], [0, 0.9, 0.9, 0]);

  return (
    <span className="relative inline-block">
      <span className="italic text-gradient-gold">drift</span>

      {/* Flight path / contrail, sitting at the height of the i-dot. */}
      <motion.span
        aria-hidden
        style={{ scaleX: trailScale, opacity: trailOpacity, top: "0.2em" }}
        className="pointer-events-none absolute left-[-6%] right-[-6%] block h-[3px] origin-left rounded-full bg-gradient-to-r from-transparent via-sky-300 to-sky-200"
      />

      {/* The plane itself, riding along the i-dot line. */}
      <motion.span
        aria-hidden
        style={{ left: planeLeft, y: planeY, opacity: planeOpacity, top: "0.04em" }}
        className="pointer-events-none absolute -translate-y-1/2"
      >
        <Plane className="h-[0.26em] w-[0.34em] -rotate-6 text-golden drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
      </motion.span>
    </span>
  );
}
