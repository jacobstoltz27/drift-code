"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { journey } from "@/lib/content";

const lines = [
  "The best places rarely make the guidebooks.",
  "The best trips are the ones you'd never plan alone.",
  "So we built a world for both —",
  "and a companion who already knows the way.",
];

export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.4, 0.1]);
  const lineScale = useTransform(scrollYProgress, [0.35, 0.85], [0, 1]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-midnight py-32 sm:py-44"
    >
      <motion.div
        style={{ opacity: glow }}
        className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ocean blur-[140px]"
      />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <p className="label-kicker mb-10">Why Drift exists</p>
        <div className="space-y-3">
          {lines.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, delay: i * 0.16 }}
              className={`font-display text-3xl font-bold leading-snug tracking-tight sm:text-5xl ${
                i === lines.length - 1
                  ? "text-gradient-gold italic"
                  : "text-ivory"
              }`}
            >
              {line}
            </motion.p>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mx-auto mt-12 max-w-xl text-lg text-ivory/55"
        >
          Discover where people are going, plan it with Peregrine, and share the
          trip that changes you. Travel changes people. We just make the leap
          easier to take.
        </motion.p>

        {/* The Drift loop — compact strip */}
        <div className="relative mx-auto mt-20 max-w-3xl">
          <p className="label-kicker mb-8">The Drift loop</p>
          <div className="relative flex items-start justify-between">
            {/* connecting line */}
            <div className="absolute left-0 right-0 top-[7px] h-px bg-ivory/10" />
            <motion.div
              style={{ scaleX: lineScale }}
              className="absolute left-0 right-0 top-[7px] h-px origin-left bg-gradient-to-r from-golden via-ocean to-forest"
            />
            {journey.map((j, i) => (
              <motion.div
                key={j.step}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative z-10 flex flex-1 flex-col items-center gap-3 px-1"
              >
                <span className="h-3.5 w-3.5 rounded-full border-2 border-golden/50 bg-midnight" />
                <span className="font-display text-base font-bold text-ivory sm:text-lg">
                  {j.step}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
