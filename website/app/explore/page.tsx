import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import VibeSelector from "@/components/VibeSelector";
import WaitlistCTA from "@/components/WaitlistCTA";
import { destinations } from "@/lib/content";

export const metadata: Metadata = {
  title: "Explore",
  description:
    "Search the planet by feeling, not just place. Browse destinations real travelers love and find where you'll drift to next.",
};

export default function ExplorePage() {
  return (
    <PageShell>
      <PageHero
        kicker="Explore"
        title={
          <>
            The world,
            <br />
            <span className="italic text-gradient-gold">unfolded.</span>
          </>
        }
        sub="Drift's Explore is discovery by feeling, not filter. These are a few of the places our early community keeps returning to, each one alive with trips you can steal."
      />

      {/* Destination grid */}
      <section className="bg-midnight pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((d, i) => (
              <Reveal key={d.name} delay={(i % 3) * 0.08}>
                <div className="group relative overflow-hidden rounded-[24px] border border-ivory/5">
                  <div
                    className="h-80 w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage: `url('${d.img}'), linear-gradient(135deg, #24356B 0%, #151A24 70%)`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="text-xs uppercase tracking-label text-golden/90">
                      {d.coords}
                    </p>
                    <p className="mt-1 font-display text-3xl font-bold text-ivory">
                      {d.name}
                    </p>
                    <p className="text-ivory/70">{d.tag}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-16 text-center">
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-ivory/60">
              Inside Drift, every destination is a living page: real trips from
              the community, seasonal timing, and hidden corners the guidebooks
              missed. Don&apos;t see yours?{" "}
              <Link
                href="/peregrine"
                className="text-golden underline-offset-4 hover:underline"
              >
                Ask Peregrine
              </Link>{" "}
              — it knows the way.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Vibe-based discovery */}
      <VibeSelector />

      <WaitlistCTA />
    </PageShell>
  );
}
