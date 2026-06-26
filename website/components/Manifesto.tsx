"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const lines = [
  "Some people travel to check a box.",
  "Others go to feel the size of the world.",
  "Drift is for the second kind —",
  "and for anyone ready to become one.",
];

export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const glow = useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.4, 0.1]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-midnight py-32 sm:py-44"
    >
      {/* Soft gradient glow that breathes as you pass */}
      <motion.div
        style={{ opacity: glow }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ocean blur-[140px]"
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
              transition={{ duration: 0.9, delay: i * 0.18 }}
              className={`font-display text-3xl font-light leading-snug tracking-tight sm:text-5xl ${
                i === lines.length - 1 ? "text-gradient-gold italic" : "text-ivory"
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
          className="mx-auto mt-12 max-w-lg text-lg text-ivory/55"
        >
          Travel changes people. Not the photos — the moments between them. We
          built Drift to make those moments easier to reach.
        </motion.p>
      </div>
    </section>
  );
}
