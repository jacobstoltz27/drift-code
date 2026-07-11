import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Stats from "@/components/Stats";
import Testimonials from "@/components/ui/testimonial-v2";
import WaitlistCTA from "@/components/WaitlistCTA";
import { journey } from "@/lib/content";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Drift is powered by travelers, not brochures. Meet the community sharing real trips, stealing itineraries, and inspiring each other's journeys.",
};

const principles = [
  {
    title: "Real trips only",
    text: "The feed is journeys people actually took: the timing, the costs, the wrong turns. No ads dressed up as adventures.",
  },
  {
    title: "Stealing is a compliment",
    text: "When someone copies your itinerary, you get the credit and they get the trip. Being stolen from is Drift's highest honor.",
  },
  {
    title: "No scoreboards",
    text: "No country counts, no follower races, no badges for speed. A weekend two towns over counts as much as a month away.",
  },
  {
    title: "Generosity compounds",
    text: "Every published trip makes the next traveler braver. The community grows the way good travel advice always has: one handoff at a time.",
  },
];

export default function CommunityPage() {
  return (
    <PageShell>
      <PageHero
        kicker="Community"
        title={
          <>
            Powered by people
            <br />
            <span className="italic text-gradient-gold">who just got back.</span>
          </>
        }
        sub="Every trip on Drift was taken by a real person. Their itineraries, notes, and wrong turns become your head start."
      />

      {/* The loop */}
      <section className="bg-midnight pb-24 sm:pb-32">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal className="mb-14 text-center">
            <p className="label-kicker mb-4">The Drift loop</p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-ivory sm:text-5xl">
              One trip inspires the next.
            </h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {journey.map((j, i) => (
              <Reveal key={j.step} delay={i * 0.07}>
                <div className="glass h-full rounded-2xl p-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-label text-golden">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="mb-2 font-display text-xl font-bold text-ivory">
                    {j.step}
                  </p>
                  <p className="text-sm leading-relaxed text-ivory/60">
                    {j.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Stats />

      {/* Principles */}
      <section className="bg-midnight py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mb-14 text-center">
            <p className="label-kicker mb-4">House rules</p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-ivory sm:text-5xl">
              How this place stays good.
            </h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="h-full rounded-3xl border border-ivory/5 bg-charcoal/40 p-8">
                  <p className="mb-3 font-display text-2xl font-bold text-ivory">
                    {p.title}
                  </p>
                  <p className="leading-relaxed text-ivory/60">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      <WaitlistCTA />
    </PageShell>
  );
}
