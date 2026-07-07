"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Starfield from "./Starfield";
import DriftWord from "./DriftWord";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Slow parallax: image drifts up and fades as you scroll past.
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "120%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex h-screen min-h-[700px] items-center justify-center overflow-hidden"
    >
      {/* Cinematic cliff-at-sunrise backdrop */}
      <motion.div
        style={{ y: imgY, scale: imgScale }}
        className="absolute inset-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://d8j0ntlcm91z4.cloudfront.net/user_3EBkRDT9DW01OCu9b0Wi6DO1TJo/hf_20260628_185419_f885bf22-cd28-4e7e-8e89-1085f7101abf.png'), linear-gradient(160deg, #24356B 0%, #151A24 55%, #0A0D12 100%)",
          }}
        />
        {/* Golden-hour to midnight gradient wash */}
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/30 via-midnight/40 to-midnight" />
        <div className="absolute inset-0 bg-gradient-to-r from-midnight/60 via-transparent to-midnight/40" />
      </motion.div>

      <Starfield count={40} />

      <motion.div
        style={{ y: textY, opacity: fade }}
        className="relative z-10 mx-auto max-w-4xl px-6 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="label-kicker mb-6"
        >
          The world feels bigger with Drift
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-ivory sm:text-7xl md:text-8xl"
        >
          Where will you
          <br />
          <DriftWord /> to next?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.9 }}
          className="mx-auto mt-7 max-w-xl text-lg text-ivory/75"
        >
          The world&apos;s first social travel community. Every journey has a
          story worth sharing, discover them, live them, and ask{" "}
          <span className="text-ivory">Peregrine</span>, your AI companion,
          to plan the next one.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.9 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a
            href="#waitlist"
            className="magnetic rounded-full bg-golden px-8 py-4 font-semibold text-midnight transition hover:scale-105 glow-gold"
          >
            Get Early Access
          </a>
          <a
            href="#features"
            className="rounded-full border border-ivory/20 px-8 py-4 font-medium text-ivory/90 transition hover:border-ivory/50 hover:bg-ivory/5"
          >
            See how it works
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity: fade }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-ivory/30 p-1.5">
          <motion.span
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="h-2 w-1 rounded-full bg-golden"
          />
        </div>
      </motion.div>
    </section>
  );
}
