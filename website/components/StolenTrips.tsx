"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "./Reveal";

export default function StolenTrips() {
  const [stolen, setStolen] = useState(false);
  return (
    <section className="relative overflow-hidden bg-charcoal/40 py-32 sm:py-44">
      {/* gradient glow */}
      <div className="pointer-events-none absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-forest/30 blur-[150px]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-6 md:grid-cols-2">
        <Reveal>
          <p className="label-kicker mb-5">The one that changes everything</p>
          <h2 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-ivory sm:text-7xl">
            Steal any
            <br />
            <span className="italic text-gradient-gold">itinerary.</span>
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ivory/65">
            See a trip you love, whether it&apos;s a friend&apos;s, a
            creator&apos;s, or a stranger&apos;s who clearly knows what
            they&apos;re doing? Take the whole thing in
            one tap. Every day, every spot, every detail worth keeping,
            copied into your own plans in seconds.
          </p>
          <p className="mt-4 font-display text-xl italic text-golden/90">
            Planning the perfect trip was never this easy.
          </p>
        </Reveal>

        {/* Animated "steal" card demo */}
        <Reveal delay={0.15}>
          <div className="relative mx-auto w-full max-w-sm">
            <motion.div
              initial={{ rotate: -3 }}
              whileInView={{ rotate: -3 }}
              className="glass rounded-3xl p-5 shadow-2xl"
            >
              <div
                className="h-48 w-full rounded-2xl bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80'), linear-gradient(135deg, #24356B 0%, #151A24 70%)",
                }}
              />
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-label text-golden/80">
                    7 days · Kyoto
                  </p>
                  <p className="font-display text-xl text-ivory">
                    Winter in Japan
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-golden/60 font-display text-sm font-semibold text-golden">
                  94
                </div>
              </div>
              <motion.button
                onClick={() => setStolen((v) => !v)}
                whileTap={{ scale: 0.96 }}
                animate={stolen ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                transition={{ duration: 0.35 }}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-golden py-3 text-center font-semibold text-midnight"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {stolen ? (
                    <motion.span
                      key="done"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5">
                        <motion.path
                          d="M4 12.5l5 5 11-11"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
                        />
                      </svg>
                      Stolen!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="steal"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Steal Itinerary
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
