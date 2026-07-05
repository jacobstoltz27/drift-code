"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { destinations } from "@/lib/content";
import Reveal from "./Reveal";

// Amalfi headlines the section; the rest drift past below. Japan/Kyoto excluded.
const center =
  destinations.find((d) => d.name === "Amalfi Coast") ?? destinations[0];
const rest = destinations.filter((d) => d !== center && d.name !== "Japan");

// Scattered placement for the drifting cards (Iceland, Bali, Patagonia, Morocco).
const layouts = [
  "md:mr-auto md:w-3/5",
  "md:ml-auto md:w-1/2",
  "md:mr-auto md:ml-10 md:w-3/5",
  "md:ml-auto md:w-1/2",
];

function Banner() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <div
      ref={ref}
      className="relative mx-auto mb-14 h-[62vh] min-h-[420px] max-w-6xl overflow-hidden rounded-[28px] border border-ivory/5"
    >
      <motion.div
        style={{
          y,
          backgroundImage: `url(${center.img}), linear-gradient(135deg, #24356B, #0A0D12)`,
        }}
        className="absolute inset-[-12%] bg-cover bg-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/45 to-midnight/20" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <Reveal>
          <p className="label-kicker mb-4">A world worth getting lost in</p>
          <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-ivory sm:text-6xl">
            From the well-known to the
            <span className="italic text-gradient-gold">
              {" "}
              nowhere-on-the-map.
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ivory/75">
            Iceland to a fishing village you can&apos;t pronounce yet. Drift
            shows you where you&apos;d go if you were braver.
          </p>
        </Reveal>
      </div>
    </div>
  );
}

function Card({
  d,
  className,
}: {
  d: (typeof destinations)[number];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Gentle drift as the card passes through the viewport — stays in its lane.
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={`group relative mb-8 overflow-hidden rounded-2xl border border-ivory/5 bg-charcoal shadow-2xl ${className}`}
    >
      <img
        src={d.img}
        alt={d.name}
        className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-80"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/10 to-transparent" />
      <div className="absolute left-0 top-4 px-5 font-mono text-[11px] tracking-wide text-golden/0 transition group-hover:text-golden/90">
        {d.coords}
      </div>
      <div className="absolute bottom-0 left-0 p-5">
        <p className="text-xs uppercase tracking-label text-golden/90">{d.tag}</p>
        <h3 className="font-display text-2xl font-bold text-ivory">{d.name}</h3>
      </div>
    </motion.div>
  );
}

export default function DestinationShowcase() {
  return (
    <section className="overflow-hidden bg-midnight py-24 sm:py-28">
      <div className="px-6">
        <Banner />
      </div>
      <div className="mx-auto max-w-5xl px-6">
        {rest.map((d, i) => (
          <Card key={d.name} d={d} className={layouts[i % layouts.length]} />
        ))}
      </div>
    </section>
  );
}
