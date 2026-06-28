"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { vibes } from "@/lib/content";
import Reveal from "./Reveal";

export default function VibeSelector() {
  const [active, setActive] = useState(0);
  const vibe = vibes[active];

  return (
    <section id="vibe" className="relative overflow-hidden py-28 sm:py-36">
      {/* Background morphs to the selected vibe */}
      <AnimatePresence mode="wait">
        <motion.div
          key={vibe.name}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${vibe.img}'), linear-gradient(160deg, ${vibe.color} 0%, #101831 70%)`,
          }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-midnight/75" />
      <motion.div
        key={vibe.color}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${vibe.color}, transparent 60%)`,
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <p className="label-kicker mb-4">What&apos;s your travel vibe?</p>
          <h2 className="font-display text-4xl font-light tracking-tight text-ivory sm:text-6xl">
            Drift plans around
            <span className="italic text-gradient-gold"> how you want to feel.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ivory/70">
            Not just where you&apos;re going, but the kind of trip you&apos;re after.
            Pick a vibe and watch the world shift.
          </p>
        </Reveal>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {vibes.map((v, i) => (
            <button
              key={v.name}
              onClick={() => setActive(i)}
              className={`magnetic rounded-full border px-5 py-2.5 text-sm font-medium transition ${
                i === active
                  ? "border-golden bg-golden text-midnight"
                  : "border-ivory/20 bg-midnight/30 text-ivory/80 hover:border-ivory/50"
              }`}
            >
              {v.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
