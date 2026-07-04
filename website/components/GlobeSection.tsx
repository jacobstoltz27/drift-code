"use client";

import { motion } from "framer-motion";
import RotatingEarth from "./ui/wireframe-dotted-globe";
import Reveal from "./Reveal";

export default function GlobeSection() {
  return (
    <section className="relative overflow-hidden bg-midnight py-28 sm:py-36">
      {/* soft sky-blue glow behind the globe */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ocean/10 blur-[160px]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
        <Reveal>
          <p className="label-kicker mb-4">Your world, growing</p>
          <h2 className="font-display text-4xl font-bold leading-tight tracking-tight text-ivory sm:text-6xl">
            The whole world,
            <span className="italic text-gradient-gold"> one tap away.</span>
          </h2>
          <p className="mt-5 max-w-md text-lg text-ivory/60">
            180+ countries and counting. Spin the globe, find the corner that
            pulls at you, and watch your personal map light up with every trip
            you take.
          </p>
          <a
            href="#waitlist"
            className="magnetic mt-8 inline-block rounded-full bg-golden px-7 py-3.5 font-semibold text-midnight transition hover:scale-105 glow-gold"
          >
            Start your map
          </a>
        </Reveal>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
          className="flex justify-center"
        >
          <RotatingEarth width={560} height={560} />
        </motion.div>
      </div>
    </section>
  );
}
