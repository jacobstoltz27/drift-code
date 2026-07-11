import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import WaitlistCTA from "@/components/WaitlistCTA";
import { peregrineAsks } from "@/lib/content";

export const metadata: Metadata = {
  title: "Peregrine, your AI travel companion",
  description:
    "Peregrine is the AI travel companion inside Drift. Ask it anything and get a real, personal itinerary back, planned with a local's instinct.",
};

const steps = [
  {
    n: "01",
    title: "You say the trip out loud",
    text: "\"Ten days in Japan, first time, we love food and quiet mornings.\" That's it. Vibe, budget, dates, whatever you have. Peregrine works with fragments.",
  },
  {
    n: "02",
    title: "It hands back a real plan",
    text: "Not a wall of text: a day-by-day itinerary with neighborhoods, timing, and the spots locals actually love, shaped to your taste and pace.",
  },
  {
    n: "03",
    title: "You steer, it reshapes",
    text: "\"Day three is too packed.\" \"Swap the museum for something outside.\" The plan bends around every note and keeps everything you liked.",
  },
];

const promises = [
  {
    title: "It never sells you anything",
    text: "Peregrine has no inventory, no checkout, and no commissions. Every suggestion is there because it fits your trip, never because someone paid.",
  },
  {
    title: "It knows the real place",
    text: "Built for travel and current on real local spots, from the bakery that opens at six to the trail that's better at sunset.",
  },
  {
    title: "It remembers your taste",
    text: "The more you travel with Drift, the more Peregrine plans like you: your pace, your budget, your definition of a perfect day.",
  },
  {
    title: "It's there mid-trip",
    text: "\"What's good near me right now?\" Standing on a corner with an hour to spare is exactly the moment Peregrine was built for.",
  },
];

export default function PeregrinePage() {
  return (
    <PageShell>
      <PageHero
        kicker="Ask Peregrine"
        title={
          <>
            Land like you already
            <br />
            <span className="italic text-gradient-gold">know the place.</span>
          </>
        }
        sub="Peregrine is the travel companion inside Drift: an AI that turns a sentence into a real itinerary, answers like a local, and quietly removes every reason not to go."
      >
        <div className="flex flex-wrap justify-center gap-3">
          {peregrineAsks.map((ask) => (
            <span
              key={ask}
              className="rounded-full border border-golden/30 bg-charcoal/50 px-5 py-2.5 text-sm text-ivory/80"
            >
              &ldquo;{ask}&rdquo;
            </span>
          ))}
        </div>
      </PageHero>

      {/* The mark + positioning */}
      <section className="bg-midnight pb-24 sm:pb-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/peregrine-mark.png"
              alt="The Peregrine mark"
              className="mx-auto mb-8 h-20 w-auto opacity-90"
            />
            <p className="text-lg leading-relaxed text-ivory/65">
              Named for the fastest traveler on Earth, Peregrine lives inside
              Drift the way a great local friend lives inside a city: quietly,
              until you need them. The hero of every trip is still you, and the
              world. Peregrine just clears the runway.
            </p>
          </Reveal>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-charcoal/40 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mb-16 text-center">
            <p className="label-kicker mb-4">How it works</p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-ivory sm:text-5xl">
              A conversation, not a form.
            </h2>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.1}>
                <div className="glass h-full rounded-3xl p-8">
                  <p className="mb-4 font-display text-4xl font-bold text-golden/60">
                    {s.n}
                  </p>
                  <p className="mb-3 font-display text-2xl font-bold text-ivory">
                    {s.title}
                  </p>
                  <p className="leading-relaxed text-ivory/60">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Promises */}
      <section className="bg-midnight py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mb-14 text-center">
            <p className="label-kicker mb-4">The fine print, in large type</p>
            <h2 className="mx-auto max-w-2xl font-display text-4xl font-bold tracking-tight text-ivory sm:text-5xl">
              A companion,{" "}
              <span className="italic text-gradient-gold">not a counter.</span>
            </h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2">
            {promises.map((p, i) => (
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
          <Reveal className="mt-14 text-center">
            <p className="text-ivory/60">
              Asking Peregrine is core to Drift, free from day one.{" "}
              <Link
                href="/pricing"
                className="text-golden underline-offset-4 hover:underline"
              >
                See what Drift Plus adds
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
