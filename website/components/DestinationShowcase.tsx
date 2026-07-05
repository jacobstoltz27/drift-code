"use client";

import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";
import { destinations } from "@/lib/content";

// Extra scroll (beyond one viewport) the section consumes. Kept large enough
// that the reveal (100vh of flow) + the parallax cards fit inside the section,
// so nothing bleeds into the next one.
const SECTION_HEIGHT = 1700;

// Amalfi is the full-bleed reveal; the rest fly over it as parallax cards.
// Japan/Kyoto is intentionally excluded.
const center =
  destinations.find((d) => d.name === "Amalfi Coast") ?? destinations[0];
const rest = destinations.filter((d) => d !== center && d.name !== "Japan");

// Scattered placement + bounded parallax offsets (so drift never overflows).
const layout = [
  { className: "w-2/3 md:w-2/5", start: -90, end: 40 },
  { className: "mx-auto w-4/5 md:w-3/5", start: 110, end: -90 },
  { className: "ml-auto w-2/3 md:w-2/5", start: -70, end: 90 },
  { className: "w-3/4 md:ml-24 md:w-1/2", start: 70, end: -110 },
];

function CenterReveal({ progress }: { progress: MotionValue<number> }) {
  // The framed photo expands to full-bleed as you scroll through the section.
  const clip1 = useTransform(progress, [0, 0.45], [15, 0]);
  const clip2 = useTransform(progress, [0, 0.45], [85, 100]);
  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;

  const backgroundSize = useTransform(progress, [0, 0.6], ["155%", "100%"]);
  const opacity = useTransform(progress, [0.9, 1], [1, 0]);
  const textOpacity = useTransform(progress, [0, 0.28, 0.5], [1, 1, 0]);

  return (
    <motion.div
      className="sticky top-0 flex h-screen w-full items-center justify-center"
      style={{
        clipPath,
        backgroundSize,
        opacity,
        backgroundImage: `linear-gradient(160deg, rgba(10,13,18,0.4), rgba(10,13,18,0.65)), url(${center.img}), linear-gradient(135deg, #24356B, #0A0D12)`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <motion.div style={{ opacity: textOpacity }} className="max-w-3xl px-6 text-center">
        <p className="label-kicker mb-4">A world worth getting lost in</p>
        <h2 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-ivory sm:text-7xl">
          From the well-known to the
          <span className="italic text-gradient-gold"> nowhere-on-the-map.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ivory/70">
          Iceland to a fishing village you can&apos;t pronounce yet. Drift
          shows you where you&apos;d go if you were braver.
        </p>
      </motion.div>
    </motion.div>
  );
}

function ParallaxCard({
  d,
  start,
  end,
  className,
}: {
  d: (typeof destinations)[number];
  start: number;
  end: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`${start}px end`, `end ${end * -1}px`],
  });

  const opacity = useTransform(scrollYProgress, [0.82, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.82, 1], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 1], [start, end]);
  const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`;

  return (
    <motion.div
      ref={ref}
      style={{ transform, opacity }}
      className={`group relative mb-12 overflow-hidden rounded-2xl border border-ivory/5 bg-charcoal shadow-2xl ${className}`}
    >
      <img
        src={d.img}
        alt={d.name}
        className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-105"
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
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section className="relative bg-midnight">
      <div
        ref={ref}
        style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }}
        className="relative w-full"
      >
        <CenterReveal progress={scrollYProgress} />

        <div className="mx-auto max-w-5xl px-4 pt-[180px]">
          {rest.map((d, i) => {
            const l = layout[i % layout.length];
            return (
              <ParallaxCard
                key={d.name}
                d={d}
                start={l.start}
                end={l.end}
                className={l.className}
              />
            );
          })}
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-b from-midnight/0 to-midnight" />
      </div>
    </section>
  );
}
