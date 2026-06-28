"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { destinations } from "@/lib/content";
import Reveal from "./Reveal";

function Card({ d, index }: { d: (typeof destinations)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Each image parallaxes within its frame for that slow cinematic drift.
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay: (index % 3) * 0.1 }}
      className={`group relative overflow-hidden rounded-[24px] border border-ivory/5 ${
        index % 5 === 0 ? "md:col-span-2 md:row-span-2" : ""
      }`}
    >
      <div className="relative h-72 w-full overflow-hidden md:h-full md:min-h-[280px]">
        <motion.div
          style={{
            y,
            backgroundImage: `url('${d.img}'), linear-gradient(135deg, #4C7A5B 0%, #151515 70%)`,
          }}
          className="absolute inset-[-12%] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/20 to-transparent" />
      </div>

      {/* Coordinates appear on hover */}
      <div className="absolute left-5 top-5 font-mono text-[11px] tracking-wide text-ivory/0 transition group-hover:text-golden/90">
        {d.coords}
      </div>

      <div className="absolute bottom-0 left-0 p-6">
        <p className="text-xs uppercase tracking-label text-golden/90">{d.tag}</p>
        <h3 className="font-display text-3xl font-light text-ivory">{d.name}</h3>
      </div>
    </motion.div>
  );
}

export default function DestinationReel() {
  return (
    <section className="bg-midnight py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mb-14 max-w-2xl">
          <p className="label-kicker mb-4">A world worth getting lost in</p>
          <h2 className="font-display text-4xl font-light leading-tight tracking-tight text-ivory sm:text-6xl">
            From the well-known to the
            <span className="italic text-gradient-gold"> nowhere-on-the-map.</span>
          </h2>
          <p className="mt-5 text-lg text-ivory/60">
            Iceland to a fishing village you can&apos;t pronounce yet. Drift
            doesn&apos;t just show you where everyone goes — it shows you where
            you&apos;d go if you were braver.
          </p>
        </Reveal>

        <div className="grid auto-rows-[280px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {destinations.map((d, i) => (
            <Card key={d.name} d={d} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
