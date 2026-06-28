"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { features } from "@/lib/content";
import Reveal from "./Reveal";

// Card that gently tilts toward the cursor.
function FeatureRow({
  f,
  index,
}: {
  f: (typeof features)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const flip = index % 2 === 1;

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: py * -6, y: px * 6 });
  }

  return (
    <div
      className={`flex flex-col items-center gap-10 md:gap-16 ${
        flip ? "md:flex-row-reverse" : "md:flex-row"
      }`}
    >
      {/* Image */}
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9 }}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
        className="group relative w-full overflow-hidden rounded-[24px] border border-ivory/5 transition-transform duration-200 md:w-1/2"
      >
        <div
          className="h-72 w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105 sm:h-96"
          style={{
            backgroundImage: `url('${f.img}'), linear-gradient(135deg, #24356B 0%, #151A24 70%)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-midnight/70 via-transparent to-transparent" />
      </motion.div>

      {/* Copy */}
      <Reveal className="w-full md:w-1/2" delay={0.1}>
        <p className="label-kicker mb-4">{f.kicker}</p>
        <h3 className="font-display text-3xl font-light tracking-tight text-ivory sm:text-5xl">
          {f.name}
        </h3>
        <p className="mt-5 text-lg leading-relaxed text-ivory/65">{f.desc}</p>
      </Reveal>
    </div>
  );
}

export default function Features() {
  return (
    <section id="features" className="bg-midnight py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mb-20 text-center">
          <p className="label-kicker mb-4">One complete platform</p>
          <h2 className="mx-auto max-w-3xl font-display text-4xl font-light leading-tight tracking-tight text-ivory sm:text-6xl">
            Everything you need.
            <span className="italic text-gradient-gold"> Nothing you don&apos;t.</span>
          </h2>
        </Reveal>

        <div className="space-y-28 sm:space-y-36">
          {features.map((f, i) => (
            <FeatureRow key={f.name} f={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
