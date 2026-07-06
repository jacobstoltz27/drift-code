"use client";

import { motion } from "framer-motion";
import { peregrineAsks } from "@/lib/content";
import Falcon from "./Falcon";
import Reveal from "./Reveal";

export default function PeregrineSection() {
  return (
    <section
      id="peregrine"
      className="relative overflow-hidden bg-midnight py-28 sm:py-36"
    >
      <div className="pointer-events-none absolute right-0 top-1/4 h-[420px] w-[480px] rounded-full bg-ocean/10 blur-[160px]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
        {/* Copy */}
        <Reveal>
          <div className="mb-5 flex items-center gap-2">
            <Falcon className="h-6 w-8 text-golden" />
            <span className="label-kicker">Ask Peregrine</span>
          </div>
          <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-ivory sm:text-6xl">
            Land like you already
            <span className="italic text-gradient-gold"> know the place.</span>
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ivory/65">
            Peregrine is your AI travel companion inside Drift. Ask it anything
            and your whole trip is planned in one conversation, shaped to your
            taste, your budget, and your crew. A local&apos;s instinct for the
            places guidebooks miss.
          </p>

          <p className="mt-7 text-xs font-semibold uppercase tracking-label text-ivory/40">
            Ask anything
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {peregrineAsks.map((ask) => (
              <span
                key={ask}
                className="rounded-full border border-ivory/10 bg-charcoal/60 px-4 py-2 text-sm text-ivory/75 backdrop-blur-sm"
              >
                &ldquo;{ask}&rdquo;
              </span>
            ))}
          </div>

          <a
            href="#waitlist"
            className="magnetic mt-8 inline-block rounded-full bg-golden px-7 py-3.5 font-semibold text-midnight transition hover:scale-105 glow-gold"
          >
            Get Early Access
          </a>
        </Reveal>

        {/* Chat demo */}
        <Reveal delay={0.15}>
          <div className="glass mx-auto w-full max-w-md rounded-3xl p-5 shadow-2xl">
            {/* user question */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-4 ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-ocean/15 px-4 py-3 text-right text-sm text-ivory"
            >
              Plan my Tokyo trip — 5 days, food-first, not too touristy.
            </motion.div>

            {/* peregrine answer */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex gap-3"
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-ocean to-forest">
                <Falcon className="h-4 w-5 text-ivory" />
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-ivory/10 bg-charcoal/70 px-4 py-3 text-sm text-ivory/85">
                <p className="mb-2 font-medium text-ivory">
                  Here&apos;s a first draft — say the word and I&apos;ll refine it.
                </p>
                <ul className="space-y-1.5 text-ivory/70">
                  <li>
                    <span className="text-golden">Day 1</span> · Shimokitazawa
                    — vintage lanes, natural wine at a tucked-away bar
                  </li>
                  <li>
                    <span className="text-golden">Day 2</span> · Dawn at the
                    outer market, then a counter kaiseki in Nishiazabu
                  </li>
                  <li>
                    <span className="text-golden">Day 3</span> · Onsen day trip
                    to Hakone, back for late ramen
                  </li>
                </ul>
                <p className="mt-2 text-ivory/50">+ 2 more days, mapped.</p>
              </div>
            </motion.div>

            {/* input hint */}
            <div className="mt-4 flex items-center gap-2 rounded-full border border-ivory/10 bg-midnight/60 px-4 py-2.5 text-sm text-ivory/40">
              Ask Peregrine anything…
              <span className="ml-auto text-golden">↑</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
