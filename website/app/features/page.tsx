import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Features from "@/components/Features";
import StolenTrips from "@/components/StolenTrips";
import WaitlistCTA from "@/components/WaitlistCTA";

export const metadata: Metadata = {
  title: "Features",
  description:
    "The feed, Explore, Ask Peregrine, My Trips, the World Travel Map, and group planning. Every Drift feature, explained.",
};

const before = [
  "Screenshots buried in your camera roll",
  "Forty tabs and a dying spreadsheet",
  "Group chats where trips go to die",
  "Saved posts you'll never find again",
  "\"We should go\" (narrator: they didn't)",
];

const after = [
  "One feed of real trips worth copying",
  "A full itinerary drafted in seconds",
  "One shared plan everyone can shape",
  "Every saved place, on one map",
  "A world map that keeps lighting up",
];

export default function FeaturesPage() {
  return (
    <PageShell>
      <PageHero
        kicker="Features"
        title={
          <>
            Built for the way
            <br />
            <span className="italic text-gradient-gold">you actually travel.</span>
          </>
        }
        sub="Drift replaces the scattered mess of screenshots, tabs, and group chats with one place where inspiration turns into a real plan."
      />

      {/* Before / after */}
      <section className="bg-midnight pb-28 sm:pb-36">
        <div className="mx-auto grid max-w-5xl gap-6 px-6 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl border border-ivory/10 bg-charcoal/40 p-8">
              <p className="mb-6 text-xs font-semibold uppercase tracking-label text-ivory/40">
                Planning today
              </p>
              <ul className="space-y-4">
                {before.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-ivory/55">
                    <span className="mt-1 text-ivory/30">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="glow-gold h-full rounded-3xl border border-golden/25 bg-charcoal/60 p-8">
              <p className="mb-6 text-xs font-semibold uppercase tracking-label text-golden">
                Planning with Drift
              </p>
              <ul className="space-y-4">
                {after.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-ivory/85">
                    <span className="mt-1 text-golden">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* The six core features (shared with homepage) */}
      <Features />

      <StolenTrips />

      <WaitlistCTA />
    </PageShell>
  );
}
