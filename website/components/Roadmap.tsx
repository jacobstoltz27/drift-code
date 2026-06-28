"use client";

import { motion } from "framer-motion";
import { roadmap } from "@/lib/content";
import Reveal from "./Reveal";

export default function Roadmap() {
  return (
    <section className="relative overflow-hidden bg-charcoal/30 py-28 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mb-14 max-w-2xl">
          <p className="label-kicker mb-4">The road ahead</p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-ivory sm:text-5xl">
            We&apos;re just
            <span className="italic text-gradient-gold"> getting started.</span>
          </h2>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {roadmap.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`rounded-[20px] border p-6 ${
                r.done
                  ? "border-golden/40 bg-golden/5"
                  : "border-ivory/10 bg-charcoal/40"
              }`}
            >
              <div className="mb-4 flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    r.done ? "bg-golden" : "bg-ivory/30"
                  }`}
                />
                <span className="text-xs uppercase tracking-label text-ivory/50">
                  {r.phase}
                </span>
              </div>
              <h3 className="font-display text-xl text-ivory">{r.title}</h3>
              <p className="mt-2 text-sm text-ivory/55">{r.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
