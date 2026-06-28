"use client";

import { motion } from "framer-motion";
import Reveal from "./Reveal";

export default function StolenTrips() {
  return (
    <section className="relative overflow-hidden bg-charcoal/40 py-32 sm:py-44">
      {/* gradient glow */}
      <div className="pointer-events-none absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-forest/30 blur-[150px]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-6 md:grid-cols-2">
        <Reveal>
          <p className="label-kicker mb-5">The one that changes everything</p>
          <h2 className="font-display text-5xl font-light leading-[1.05] tracking-tight text-ivory sm:text-7xl">
            Steal any
            <br />
            <span className="italic text-gradient-gold">itinerary.</span>
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ivory/65">
            See a trip you love, whether it&apos;s a friend&apos;s, a
            creator&apos;s, or a stranger&apos;s who clearly knows what
            they&apos;re doing? Take the whole thing in
            one tap. Every day, every spot, every reservation-worthy detail,
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
                initial={{ scale: 1 }}
                whileInView={{ scale: [1, 1.05, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.4, repeat: Infinity, repeatDelay: 2 }}
                className="mt-4 w-full rounded-full bg-golden py-3 text-center font-semibold text-midnight"
              >
                Steal Itinerary
              </motion.button>
            </motion.div>

            {/* floating "copied" chips */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-4 -left-4 rounded-full border border-forest/40 bg-midnight px-4 py-2 text-xs font-medium text-forest"
            >
              ✓ Copied to your trips
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
