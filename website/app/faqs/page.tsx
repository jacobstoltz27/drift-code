import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import FAQ from "@/components/FAQ";
import WaitlistCTA from "@/components/WaitlistCTA";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Everything people ask before joining Drift: Peregrine, pricing, privacy, stealing itineraries, and when you can get in.",
};

export default function FAQsPage() {
  return (
    <PageShell>
      <PageHero
        kicker="FAQs"
        title={
          <>
            Asked and
            <br />
            <span className="italic text-gradient-gold">answered.</span>
          </>
        }
        sub="The questions every traveler asks before joining, answered straight. If yours isn't here, we're easy to reach."
      />

      {/* The FAQ component brings its own section wrapper */}
      <div className="-mt-24">
        <FAQ />
      </div>

      <section className="bg-midnight pb-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <Reveal>
            <p className="text-lg text-ivory/60">
              Still curious about something?{" "}
              <Link
                href="/contact"
                className="text-golden underline-offset-4 hover:underline"
              >
                Ask us directly
              </Link>{" "}
              — a human reads every message.
            </p>
          </Reveal>
        </div>
      </section>

      <WaitlistCTA />
    </PageShell>
  );
}
