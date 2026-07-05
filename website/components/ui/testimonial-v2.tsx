"use client";

import React from "react";
import { motion } from "framer-motion";
import { stories } from "@/lib/content";

type Testimonial = { quote: string; name: string; place: string };

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const firstColumn = stories.slice(0, 3);
const secondColumn = stories.slice(3, 6);
const thirdColumn = stories.slice(6, 9);

function TestimonialsColumn({
  className,
  items,
  duration = 18,
}: {
  className?: string;
  items: Testimonial[];
  duration?: number;
}) {
  return (
    <div className={className}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[...new Array(2)].map((_, index) => (
          <React.Fragment key={index}>
            {items.map(({ quote, name, place }, i) => (
              <div
                key={`${index}-${i}`}
                aria-hidden={index === 1}
                className="group w-full max-w-xs rounded-3xl border border-ivory/10 bg-charcoal/60 p-8 shadow-2xl shadow-black/20 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-ocean/40 hover:bg-charcoal"
              >
                <blockquote className="m-0">
                  <p className="leading-relaxed text-ivory/75">
                    &ldquo;{quote}&rdquo;
                  </p>
                  <footer className="mt-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-ocean to-forest text-sm font-semibold text-ivory ring-2 ring-ivory/10 transition group-hover:ring-ocean/40">
                      {initials(name)}
                    </div>
                    <div className="flex flex-col">
                      <cite className="font-display font-bold not-italic leading-5 text-ivory">
                        {name}
                      </cite>
                      <span className="mt-0.5 text-sm leading-5 text-golden/80">
                        {place}
                      </span>
                    </div>
                  </footer>
                </blockquote>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section
      aria-labelledby="testimonials-heading"
      className="relative overflow-hidden bg-midnight py-28 sm:py-32"
    >
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[520px] -translate-x-1/2 rounded-full bg-ocean/10 blur-[160px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-14 flex max-w-xl flex-col items-center text-center">
          <span className="label-kicker">Community first</span>
          <h2
            id="testimonials-heading"
            className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight text-ivory sm:text-6xl"
          >
            Collect stories,
            <span className="italic text-gradient-gold"> not souvenirs.</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ivory/60">
            Real trips from real explorers. Here&apos;s what drifting feels like
            once you start.
          </p>
        </div>

        <div
          className="flex max-h-[720px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]"
          role="region"
          aria-label="Scrolling testimonials"
        >
          <TestimonialsColumn items={firstColumn} duration={20} />
          <TestimonialsColumn
            items={secondColumn}
            className="hidden md:block"
            duration={26}
          />
          <TestimonialsColumn
            items={thirdColumn}
            className="hidden lg:block"
            duration={23}
          />
        </div>
      </div>
    </section>
  );
}
