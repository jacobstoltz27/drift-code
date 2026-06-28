"use client";

import { motion } from "framer-motion";
import Starfield from "./Starfield";
import WaitlistForm from "./WaitlistForm";

export default function WaitlistCTA() {
  return (
    <section
      id="waitlist"
      className="relative flex min-h-[90vh] items-center justify-center overflow-hidden"
    >
      {/* Final inspiring destination image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=80'), linear-gradient(160deg, #24356B 0%, #151A24 60%, #0A0D12 100%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-midnight via-midnight/70 to-midnight" />
      <Starfield count={50} />

      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="label-kicker mb-6"
        >
          Join thousands of explorers
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="font-display text-5xl font-light leading-[1.05] tracking-tight text-ivory sm:text-7xl"
        >
          The world is waiting.
          <br />
          <span className="italic text-gradient-gold">Go meet it.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mx-auto mt-6 max-w-lg text-lg text-ivory/70"
        >
          Be among the first to drift. Get early access, founding-member perks,
          and a head start on your next story.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.45 }}
          className="mt-10 flex justify-center"
        >
          <WaitlistForm />
        </motion.div>

        <p className="mt-5 text-sm text-ivory/40">
          No spam. Just the occasional spark of wanderlust.
        </p>
      </div>
    </section>
  );
}
