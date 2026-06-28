"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { journey } from "@/lib/content";

export default function JourneyTimeline() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });
  // The flight-path line draws itself as you scroll the section.
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={ref} className="relative bg-charcoal/30 py-28 sm:py-36">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-16 text-center">
          <p className="label-kicker mb-4">The Drift loop</p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-ivory sm:text-5xl">
            Dream. Plan. Experience.
            <br />
            <span className="italic text-gradient-gold">Remember. Share.</span>
          </h2>
        </div>

        <div className="relative">
          {/* Animated vertical flight path */}
          <div className="absolute left-[19px] top-2 h-full w-px bg-ivory/10 md:left-1/2" />
          <motion.div
            style={{ scaleY: lineScale }}
            className="absolute left-[19px] top-2 h-full w-px origin-top bg-gradient-to-b from-golden via-ocean to-forest md:left-1/2"
          />

          <div className="space-y-12">
            {journey.map((j, i) => (
              <motion.div
                key={j.step}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7 }}
                className={`relative flex items-start gap-6 md:w-1/2 ${
                  i % 2 === 0
                    ? "md:ml-0 md:pr-12 md:text-right"
                    : "md:ml-auto md:flex-row-reverse md:pl-12 md:text-left"
                }`}
              >
                <div className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-golden/40 bg-midnight">
                  <span className="h-2 w-2 rounded-full bg-golden" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-medium text-ivory">
                    {j.step}
                  </h3>
                  <p className="mt-1 text-ivory/60">{j.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
