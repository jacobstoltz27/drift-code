"use client";

import { motion } from "framer-motion";
import { stories } from "@/lib/content";
import Reveal from "./Reveal";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Stories() {
  return (
    <section className="relative overflow-hidden bg-midnight py-28 sm:py-36">
      <div className="pointer-events-none absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-golden/10 blur-[150px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal className="mb-16 max-w-2xl">
          <p className="label-kicker mb-4">Community first</p>
          <h2 className="font-display text-4xl font-bold leading-tight tracking-tight text-ivory sm:text-6xl">
            Collect stories,
            <span className="italic text-gradient-gold"> not souvenirs.</span>
          </h2>
          <p className="mt-5 text-lg text-ivory/60">
            Drift isn&apos;t about the photos you take. It&apos;s about the
            moments between them, and the people you share them with.
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {stories.map((s, i) => (
            <motion.figure
              key={s.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="glass flex flex-col justify-between rounded-[24px] p-7"
            >
              <blockquote className="font-display text-xl font-bold italic leading-relaxed text-ivory/90">
                &ldquo;{s.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-ocean to-forest text-sm font-semibold text-ivory">
                  {initials(s.name)}
                </div>
                <div>
                  <p className="text-sm font-medium text-ivory">{s.name}</p>
                  <p className="text-xs text-golden/80">{s.place}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
