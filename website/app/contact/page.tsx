import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to the Drift team: questions, press, creator partnerships, or just a place we absolutely have to know about.",
};

const channels = [
  {
    title: "Say hello",
    text: "Questions, ideas, or a place we absolutely need to know about. A human reads every message.",
    email: "hello@driftapp.travel",
  },
  {
    title: "Creators",
    text: "Building the founding creator program and want in early? Tell us how you travel.",
    email: "creators@driftapp.travel",
  },
  {
    title: "Press",
    text: "Writing about Drift or Peregrine? We're happy to talk, and quick about it.",
    email: "press@driftapp.travel",
  },
];

export default function ContactPage() {
  return (
    <PageShell>
      <PageHero
        kicker="Contact"
        title={
          <>
            Talk to a
            <br />
            <span className="italic text-gradient-gold">human.</span>
          </>
        }
        sub="No ticket numbers, no chatbots guarding the door. Pick a channel and we'll get back to you, usually within a day or two."
      />

      <section className="bg-midnight pb-24 sm:pb-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {channels.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.1}>
                <a
                  href={`mailto:${c.email}`}
                  className="glass group flex h-full flex-col rounded-3xl p-8 transition hover:border-golden/30"
                >
                  <p className="mb-3 font-display text-2xl font-bold text-ivory">
                    {c.title}
                  </p>
                  <p className="flex-1 leading-relaxed text-ivory/60">
                    {c.text}
                  </p>
                  <p className="mt-6 text-sm font-semibold text-golden">
                    {c.email} →
                  </p>
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-16 text-center">
            <p className="mx-auto max-w-xl text-ivory/50">
              Looking for quick answers? The{" "}
              <Link
                href="/faqs"
                className="text-golden underline-offset-4 hover:underline"
              >
                FAQ
              </Link>{" "}
              covers the common ones, and the{" "}
              <Link
                href="/waitlist"
                className="text-golden underline-offset-4 hover:underline"
              >
                waitlist
              </Link>{" "}
              is the fastest way to get inside.
            </p>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
