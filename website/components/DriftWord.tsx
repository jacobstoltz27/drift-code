"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

// Filled airplane silhouette matching the reference clipart: fuselage with a
// pointed nose and a thin tail spike, swept "V"-tail flukes, and the two main
// wings swept diagonally in opposite directions (the crossed look), each
// with an engine pod. Nose points right (direction of travel across "drift").
function Plane({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 100" className={className} fill="currentColor">
      {/* fuselage */}
      <path d="M116 50 C114 43 104 39 72 40 C50 40 34 42 26 45 C23 47 23 53 26 55 C34 58 50 60 72 60 C104 61 114 57 116 50 Z" />
      {/* tail spike */}
      <path d="M26 49 L3 50 L26 51 Z" />
      {/* V-tail flukes */}
      <path d="M28 44 L8 10 L15 12 L33 42 Z" />
      <path d="M28 56 L8 90 L15 88 L33 58 Z" />
      {/* main wings, swept in opposite diagonals */}
      <path d="M55 46 L98 6 L106 9 L75 40 L58 48 Z" />
      <path d="M65 54 L22 94 L14 91 L45 60 L62 52 Z" />
      {/* engine pods */}
      <ellipse cx="82" cy="22" rx="6" ry="3.5" transform="rotate(-40 82 22)" />
      <ellipse cx="38" cy="78" rx="6" ry="3.5" transform="rotate(-40 38 78)" />
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
        <Plane className="h-[0.3em] w-[0.36em] -rotate-6 text-golden drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
      </motion.span>
    </span>
  );
}
