import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import Pricing from "@/components/ui/pricing-section-4";
import WaitlistCTA from "@/components/WaitlistCTA";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Drift is free to start, forever. Drift Plus unlocks unlimited planning, the full World Travel Map, and group trips of any size.",
};

const answers = [
  {
    q: "What stays free forever?",
    a: "The feed, discovery, browsing any community trip, and asking Peregrine to plan your first trips. Drift is useful from day one without paying anything.",
  },
  {
    q: "What does Drift Plus actually add?",
    a: "Unlimited AI trip generation, the full Trip Score, the World Travel Map with no invite requirements, group planning at any size, and offline itineraries.",
  },
  {
    q: "Can I earn features without paying?",
    a: "Yes. Inviting friends unlocks real features on the Free plan, because a travel platform is simply better with your people on it.",
  },
  {
    q: "Will you ever charge commissions?",
    a: "No. Drift doesn't sell travel, so there's nothing to take a cut of. Drift Plus is the only thing we ever charge for.",
  },
];

export default function PricingPage() {
  return (
    <PageShell>
      {/* Offset for the fixed nav; the pricing section brings its own header */}
      <div className="pt-24">
        <Pricing />
      </div>

      {/* Pricing philosophy */}
      <section className="bg-charcoal/40 py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <p className="label-kicker mb-4">Our promise</p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-ivory sm:text-5xl">
              We only make money
              <span className="italic text-gradient-gold"> one way.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ivory/65">
              Drift Plus is our entire business model. No ads in your feed, no
              commissions steering suggestions, no selling your data. When a
              place shows up in your plan, it&apos;s there because travelers
              love it, full stop.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Pricing FAQs */}
      <section className="bg-midnight py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal className="mb-12 text-center">
            <p className="label-kicker mb-4">Money questions</p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-ivory sm:text-5xl">
              Fair questions, straight answers.
            </h2>
          </Reveal>
          <div className="space-y-4">
            {answers.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.06}>
                <div className="rounded-2xl border border-ivory/5 bg-charcoal/40 p-6">
                  <p className="font-display text-xl font-bold text-ivory">
                    {f.q}
                  </p>
                  <p className="mt-2 leading-relaxed text-ivory/60">{f.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12 text-center">
            <p className="text-ivory/60">
              More questions?{" "}
              <Link
                href="/faqs"
                className="text-golden underline-offset-4 hover:underline"
              >
                Read the full FAQ
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      <WaitlistCTA />
    </PageShell>
  );
}
