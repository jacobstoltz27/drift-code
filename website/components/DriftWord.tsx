"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

// A small jet silhouette pointing to the right (direction of travel).
function Plane({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M21.5 12c0-.5-.4-1-1-1.1L14 9.6 9.8 3.2c-.2-.3-.5-.4-.8-.3l-.7.2c-.4.1-.6.5-.5.9L9.4 9 4.7 8.1l-1.2-1.4c-.1-.2-.4-.3-.6-.2l-.6.2c-.3.1-.4.4-.3.7L3.3 11c-.1.2-.1.5 0 .7l-.7 1.9c-.1.3 0 .6.3.7l.6.2c.2.1.5 0 .6-.2l1.2-1.4 4.7-.9-2.2 4.9c-.2.4 0 .8.4.9l.7.2c.3.1.7 0 .9-.3l4-6.4 6.5-1.3c.6-.1 1-.6 1-1.1z" />
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
        <Plane className="h-[0.34em] w-[0.34em] -rotate-6 text-sky-200 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
      </motion.span>
    </span>
  );
}
