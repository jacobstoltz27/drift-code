"use client";

import WorldExploreMap from "./ui/world-explore-map";
import Reveal from "./Reveal";

export default function WorldMapSection() {
  return (
    <section className="relative overflow-hidden bg-midnight py-28 sm:py-36">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[600px] -translate-x-1/2 rounded-full bg-golden/10 blur-[160px]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="label-kicker mb-4">Your world travel map</p>
            <h2 className="font-display text-4xl font-bold leading-tight tracking-tight text-ivory sm:text-6xl">
              Every trip
              <span className="italic text-gradient-gold"> shades in a country.</span>
            </h2>
            <p className="mt-5 text-lg text-ivory/60">
              Click a country to see how your map fills in as you go. This is
              the exact map Drift Plus unlocks for your own account, country
              by country.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="glass mx-auto mt-14 max-w-4xl rounded-3xl p-4 shadow-2xl sm:p-6">
            <WorldExploreMap />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
