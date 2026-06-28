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
            backgroundImage: `url('${vibe.img}'), linear-gradient(160deg, ${vibe.color} 0%, #0A0D12 70%)`,
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
          <h2 className="font-display text-4xl font-bold tracking-tight text-ivory sm:text-6xl">
            Drift plans around
            <span className="italic text-gradient-gold"> how you want to feel.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ivory/70">
            Not just where you&apos;re going, but the kind of trip you&apos;re after.
            Pick a vibe and watch the world shift.
          </p>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
          {vibes.map((v, i) => (
            <button
              key={v.name}
              onClick={() => setActive(i)}
              className={`group relative overflow-hidden rounded-2xl border px-5 py-5 text-center transition-all duration-300 ${
                i === active
                  ? "border-golden/50 bg-golden text-midnight shadow-[0_10px_40px_-10px_rgba(56,189,248,0.7)]"
                  : "border-ivory/10 bg-ivory/[0.04] text-ivory/75 backdrop-blur-md hover:-translate-y-1 hover:border-ocean/50 hover:bg-ocean/10 hover:text-ivory"
              }`}
            >
              {/* sheen sweep on the active tile */}
              {i === active && (
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0" />
              )}
              <span className="font-display text-lg font-bold tracking-tight">
                {v.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
