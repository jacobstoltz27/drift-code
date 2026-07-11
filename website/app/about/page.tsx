import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import WaitlistCTA from "@/components/WaitlistCTA";
import { roadmap } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Drift is the social travel platform built on a simple belief: the best trips come from people, not brochures. Read the story and the principles behind it.",
};

const beliefs = [
  {
    title: "People over brochures",
    text: "The best travel advice has always come from someone who just got back. Drift is built so that person can hand you their whole trip, not just a recommendation.",
  },
  {
    title: "Stories over checklists",
    text: "We don't count countries or rank travelers. A weekend two towns over can matter more than a seventh continent. Collect stories, not souvenirs.",
  },
  {
    title: "Going over planning",
    text: "Planning should take an evening, not a season. Every feature we build exists to shrink the distance between \"we should go\" and being there.",
  },
  {
    title: "Companion, not counter",
    text: "Drift never sells you travel. No inventory, no checkout, no fine print. We inspire the trip and organize it; where you stay and how you fly is your business.",
  },
];

export default function AboutPage() {
  return (
    <PageShell>
      <PageHero
        kicker="About Drift"
        title={
          <>
            Built for the moment
            <br />
            <span className="italic text-gradient-gold">you say yes.</span>
          </>
        }
        sub="Drift is a social travel platform: part community, part planner, part map of your life in motion. It exists to get more people out the door."
      />

      {/* Story */}
      <section className="bg-midnight pb-24 sm:pb-32">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <div className="space-y-6 text-lg leading-relaxed text-ivory/70">
              <p>
                Drift started with a familiar scene: forty open tabs, three
                half-finished spreadsheets, and a trip that never happened. Not
                because the world wasn&apos;t calling, but because planning it
                felt like a second job.
              </p>
              <p>
                Meanwhile, the best trips we ever took came from a different
                place entirely: a friend sliding their itinerary across a
                table. <em className="text-ivory">&ldquo;Here. Take mine.&rdquo;</em>{" "}
                Someone else&apos;s finished trip beats your blank page every
                single time.
              </p>
              <p>
                So we built the place where that handoff happens at scale. A
                feed of real trips from real travelers. Itineraries you can
                steal in one tap. A companion, Peregrine, who turns
                &ldquo;somewhere warm, cheap, in March&rdquo; into a real plan
                while the kettle boils. And a world map that quietly lights up
                as your life gets bigger.
              </p>
              <p>
                We&apos;re not a booking site, and we never will be. Drift
                doesn&apos;t sell flights, rooms, or tours. That independence is
                the point: every suggestion exists because a traveler loved it,
                not because someone paid for the placement.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Beliefs */}
      <section className="bg-charcoal/40 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mb-14 text-center">
            <p className="label-kicker mb-4">What we believe</p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-ivory sm:text-5xl">
              Four things we won&apos;t bend on.
            </h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2">
            {beliefs.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.08}>
                <div className="glass h-full rounded-3xl p-8">
                  <p className="mb-3 font-display text-2xl font-bold text-ivory">
                    {b.title}
                  </p>
                  <p className="leading-relaxed text-ivory/60">{b.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="bg-midnight py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal className="mb-14 text-center">
            <p className="label-kicker mb-4">Where we&apos;re headed</p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-ivory sm:text-5xl">
              The road ahead.
            </h2>
          </Reveal>
          <div className="space-y-4">
            {roadmap.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.06}>
                <div className="flex items-start gap-5 rounded-2xl border border-ivory/5 bg-charcoal/40 p-6">
                  <span
                    className={`mt-0.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-label ${
                      r.done
                        ? "bg-golden text-midnight"
                        : "border border-golden/40 text-golden"
                    }`}
                  >
                    {r.phase}
                  </span>
                  <div>
                    <p className="font-display text-xl font-bold text-ivory">
                      {r.title}
                    </p>
                    <p className="mt-1 text-ivory/60">{r.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12 text-center">
            <p className="text-ivory/60">
              Curious how it all works?{" "}
              <Link href="/features" className="text-golden underline-offset-4 hover:underline">
                Tour the features
              </Link>{" "}
              or{" "}
              <Link href="/peregrine" className="text-golden underline-offset-4 hover:underline">
                meet Peregrine
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
