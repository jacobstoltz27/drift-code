import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import WaitlistCTA from "@/components/WaitlistCTA";

export const metadata: Metadata = {
  title: "Creators",
  description:
    "On Drift, your trips become itineraries people can actually take. Publish once, get stolen forever, and watch your travels launch someone else's.",
};

const reasons = [
  {
    title: "Your content becomes usable",
    text: "A reel inspires for eight seconds. A Drift itinerary gets taken. Publish the actual trip, days, spots, timing, and your audience can live it, not just like it.",
  },
  {
    title: "Steals are the new saves",
    text: "Every time someone steals your itinerary, you get the credit, permanently attached. Your influence is measured in trips taken, not impressions.",
  },
  {
    title: "Your taste is the product",
    text: "Followers come to you for how you travel: slow mornings, hidden coasts, food-first. Drift packages that taste into something they can follow street by street.",
  },
  {
    title: "First movers own the map",
    text: "Early creators become the definitive voice for the places they know best. When someone searches Lisbon on Drift, your trip is the one they find.",
  },
];

const steps = [
  {
    n: "01",
    title: "Take the trip",
    text: "Travel the way you already do. Save places as you go, or rebuild the route when you're home.",
  },
  {
    n: "02",
    title: "Publish the itinerary",
    text: "Days, spots, notes, and the photos that made people ask \"where IS that?\" One tap and it's live.",
  },
  {
    n: "03",
    title: "Get stolen",
    text: "Your followers copy the whole trip into their plans, with your name on it. Every steal is a trip you caused.",
  },
];

export default function CreatorsPage() {
  return (
    <PageShell>
      <PageHero
        kicker="For creators"
        title={
          <>
            Don&apos;t just inspire trips.
            <br />
            <span className="italic text-gradient-gold">Cause them.</span>
          </>
        }
        sub="Drift turns your travels into itineraries people can steal in one tap, with your name attached to every trip you launch."
      >
        <Link
          href="/waitlist"
          className="magnetic rounded-full bg-golden px-8 py-3.5 font-semibold text-midnight transition hover:scale-105"
        >
          Join as a founding creator
        </Link>
      </PageHero>

      {/* Example creator card */}
      <section className="bg-midnight pb-24 sm:pb-32">
        <div className="mx-auto grid max-w-6xl items-center gap-16 px-6 md:grid-cols-2">
          <Reveal>
            <p className="label-kicker mb-5">The steal counter</p>
            <h2 className="font-display text-4xl font-bold leading-tight tracking-tight text-ivory sm:text-5xl">
              A number that means
              <span className="italic text-gradient-gold"> something.</span>
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ivory/65">
              Likes evaporate. Steals are journeys: flights taken, streets
              walked, stories collected, because of a trip you published. It&apos;s
              the most honest metric in travel, and it&apos;s yours to grow.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mx-auto w-full max-w-sm">
              <div className="glass rotate-2 rounded-3xl p-5 shadow-2xl">
                <div
                  className="h-44 w-full rounded-2xl bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1000&q=80'), linear-gradient(135deg, #24356B 0%, #151A24 70%)",
                  }}
                />
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-label text-golden/80">
                    9 days · Morocco
                  </p>
                  <p className="font-display text-xl text-ivory">
                    Color &amp; Dust: Marrakech to the Dunes
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t border-ivory/10 pt-3">
                    <p className="text-sm text-ivory/60">by @elena.wanders</p>
                    <p className="font-display text-lg font-bold text-golden">
                      1,284 steals
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why publish on Drift */}
      <section className="bg-charcoal/40 py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mb-14 text-center">
            <p className="label-kicker mb-4">Why Drift</p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-ivory sm:text-5xl">
              Made for travel taste.
            </h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2">
            {reasons.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.08}>
                <div className="glass h-full rounded-3xl p-8">
                  <p className="mb-3 font-display text-2xl font-bold text-ivory">
                    {r.title}
                  </p>
                  <p className="leading-relaxed text-ivory/60">{r.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-midnight py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="mb-16 text-center">
            <p className="label-kicker mb-4">How it works</p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-ivory sm:text-5xl">
              Publish once. Get stolen forever.
            </h2>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.1}>
                <div className="h-full rounded-3xl border border-ivory/5 bg-charcoal/40 p-8">
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
          <Reveal className="mt-14 text-center">
            <p className="text-ivory/60">
              Questions about the creator program?{" "}
              <Link
                href="/contact"
                className="text-golden underline-offset-4 hover:underline"
              >
                Talk to us
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
