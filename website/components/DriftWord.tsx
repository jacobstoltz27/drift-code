"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

// A clear (outline-only) top-down airliner silhouette, nose pointing right
// (direction of travel), stroked in the current text color.
function Plane({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 48"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* fuselage */}
      <path d="M4 24 L14 22.5 L34 21.5 L54 20.8 L78 21 L96 22 L108 23.5 L116 24 L108 24.5 L96 26 L78 27 L54 27.2 L34 26.5 L14 25.5 Z" />
      {/* main wings, swept back */}
      <path d="M50 21 L26 3 L34 2 L62 19" />
      <path d="M50 27 L26 45 L34 46 L62 29" />
      {/* tail stabilizers */}
      <path d="M18 22.5 L6 12 L11 11.5 L24 21.5" />
      <path d="M18 25.5 L6 36 L11 36.5 L24 26.5" />
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
        <Plane className="h-[0.24em] w-[0.6em] -rotate-6 text-sky-200 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
      </motion.span>
    </span>
  );
}
