"use client";

import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";

// People-traveling imagery (owned, on-brand). Swap these freely.
const CENTER_IMG = "https://d8j0ntlcm91z4.cloudfront.net/user_3EBkRDT9DW01OCu9b0Wi6DO1TJo/hf_20260704_041056_d7716e7c-01f0-4852-8401-b36100e84ab0.png";
const IMG_A = "https://d8j0ntlcm91z4.cloudfront.net/user_3EBkRDT9DW01OCu9b0Wi6DO1TJo/hf_20260704_041104_6c9fa2f7-bb03-48ee-b0d4-9b1d4f1c3cc7.png";
const IMG_B = "https://d8j0ntlcm91z4.cloudfront.net/user_3EBkRDT9DW01OCu9b0Wi6DO1TJo/hf_20260704_041107_6a192c7c-0273-405f-aff5-18b2f3b0f8d3.png";

const SECTION_HEIGHT = 1400;

function MapPin({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="10" r="2.4" fill="currentColor" />
    </svg>
  );
}

function CenterImage({ progress }: { progress: MotionValue<number> }) {
  // The framed photo expands to full-bleed as you scroll through the section.
  const clip1 = useTransform(progress, [0, 0.55], [16, 0]);
  const clip2 = useTransform(progress, [0, 0.55], [84, 100]);
  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;

  const backgroundSize = useTransform(progress, [0, 0.7], ["150%", "100%"]);
  const opacity = useTransform(progress, [0.85, 1], [1, 0]);
  const textOpacity = useTransform(progress, [0, 0.25, 0.5], [1, 1, 0]);

  return (
    <motion.div
      className="sticky top-0 flex h-screen w-full items-center justify-center"
      style={{
        clipPath,
        backgroundSize,
        opacity,
        backgroundImage: `linear-gradient(160deg, rgba(16,24,49,0.35), rgba(10,13,18,0.55)), url(${CENTER_IMG})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <motion.div
        style={{ opacity: textOpacity }}
        className="px-6 text-center"
      >
        <p className="label-kicker mb-4">Memories, not miles</p>
        <h2 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-ivory sm:text-7xl">
          Go with the
          <br />
          <span className="italic text-gradient-gold">people you love.</span>
        </h2>
      </motion.div>
    </motion.div>
  );
}

function ParallaxImg({
  className,
  alt,
  src,
  start,
  end,
}: {
  className?: string;
  alt: string;
  src: string;
  start: number;
  end: number;
}) {
  const ref = useRef<HTMLImageElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`${start}px end`, `end ${end * -1}px`],
  });

  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.85]);
  const y = useTransform(scrollYProgress, [0, 1], [start, end]);
  const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`;

  return (
    <motion.img
      src={src}
      alt={alt}
      className={`rounded-2xl border border-ivory/5 object-cover shadow-2xl ${className}`}
      ref={ref}
      style={{ transform, opacity }}
    />
  );
}

function ParallaxImages() {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-[200px]">
      <ParallaxImg
        src={IMG_A}
        alt="Friends laughing at a sunlit cafe while traveling"
        start={-200}
        end={200}
        className="w-1/3"
      />
      <ParallaxImg
        src={IMG_B}
        alt="A traveler exploring a market street"
        start={200}
        end={-250}
        className="mx-auto w-2/3"
      />
    </div>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <div
      ref={ref}
      style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }}
      className="relative w-full"
    >
      <CenterImage progress={scrollYProgress} />
      <ParallaxImages />
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-midnight/0 to-midnight" />
    </div>
  );
}

function Closing() {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-40 pt-8 text-center">
      <motion.h3
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ ease: "easeInOut", duration: 0.75 }}
        className="font-display text-4xl font-bold leading-tight tracking-tight text-ivory sm:text-5xl"
      >
        The best trips are the ones
        <span className="italic text-gradient-gold"> you share.</span>
      </motion.h3>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.75, delay: 0.2 }}
        className="mt-6 flex items-center justify-center gap-2 text-sm uppercase tracking-label text-ivory/50"
      >
        <MapPin className="h-4 w-4 text-golden" />
        Collect stories, not souvenirs
      </motion.div>
    </section>
  );
}

export function SmoothScrollHero() {
  return (
    <div className="relative bg-midnight">
      <Hero />
      <Closing />
    </div>
  );
}
