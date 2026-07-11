import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Stats from "@/components/Stats";
import WaitlistForm from "@/components/WaitlistForm";

export const metadata: Metadata = {
  title: "Join the waitlist",
  description:
    "Drift is rolling out in waves. Join the waitlist for early access and founding-member perks. Where will you drift to next?",
};

const perks = [
  {
    title: "First through the door",
    text: "Access rolls out to the waitlist in waves, earliest members first. Your spot in line is set the moment you join.",
  },
  {
    title: "Founding member status",
    text: "A permanent mark on your profile that says you were here before it was obvious, plus perks we're saving as a surprise.",
  },
  {
    title: "Shape the product",
    text: "Early members talk directly with the team. The features on our roadmap are there because early travelers asked for them.",
  },
];

export default function WaitlistPage() {
  return (
    <PageShell>
      <PageHero
        kicker="Early access"
        title={
          <>
            Where will you
            <br />
            <span className="italic text-gradient-gold">drift to next?</span>
          </>
        }
        sub="We're letting travelers in wave by wave. Leave your email and you're in line, no credit card, no spam, just a heads-up when the door opens."
      >
        <WaitlistForm />
      </PageHero>

      {/* Perks */}
      <section className="bg-midnight pb-24 sm:pb-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {perks.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.1}>
                <div className="glass h-full rounded-3xl p-8">
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

      <Stats />

      <section className="bg-midnight py-24 sm:py-28">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <Reveal>
            <p className="font-display text-2xl font-bold italic leading-relaxed text-ivory/80 sm:text-3xl">
              &ldquo;I almost didn&apos;t go. Peregrine handed me a plan good
              enough that I stopped overthinking and just went.&rdquo;
            </p>
            <p className="mt-4 text-sm uppercase tracking-label text-ivory/40">
              Maya R. · Lisbon → Morocco
            </p>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
