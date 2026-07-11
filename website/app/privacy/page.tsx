import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Drift handles your data, in plain language: what we collect, what we never do with it, and the choices you always have.",
};

const sections = [
  {
    h: "The short version",
    p: [
      "Your trips are yours. We collect the minimum we need to run Drift, we never sell your personal data, and your email only ever receives things you asked for. Everything below is the longer version of those three sentences.",
    ],
  },
  {
    h: "What we collect",
    p: [
      "Waitlist: when you join the waitlist we store your email address and, if you chose one, your travel vibe. That's the entire record.",
      "Site analytics: we measure aggregate page performance (what loads, what breaks, what's slow) without building advertising profiles of individual visitors.",
      "When the app launches, account holders will get a dedicated in-app privacy policy covering trips, saves, and profiles before any of that data exists.",
    ],
  },
  {
    h: "What we do with it",
    p: [
      "We use your waitlist email for exactly two things: telling you when your access wave opens, and the occasional piece of travel inspiration. Every email includes a working unsubscribe link, and unsubscribing never affects your place in line.",
    ],
  },
  {
    h: "What we never do",
    p: [
      "We don't sell or rent your personal data. We don't run third-party ad trackers on this site. We don't share your email with 'carefully selected partners.' There is no version of Drift's business that involves monetizing who you are; our only product is Drift Plus.",
    ],
  },
  {
    h: "Where your data lives",
    p: [
      "Waitlist entries are stored with our database provider (Supabase) with row-level security enabled, meaning the public website can add your email but cannot read anyone else's.",
    ],
  },
  {
    h: "Your choices",
    p: [
      "You can unsubscribe from emails at any time via the link in any message. You can ask us to delete your waitlist entry entirely by writing to hello@driftapp.travel from the address in question, and we'll confirm when it's done.",
    ],
  },
  {
    h: "Changes to this policy",
    p: [
      "If this policy changes in any meaningful way, we'll note it here with a new date, and if you're on the waitlist, we'll tell you directly rather than hoping you re-read this page.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <PageShell>
      <PageHero
        align="left"
        kicker="Privacy Policy"
        title="Plain-language privacy."
        sub="Last updated July 11, 2026"
      />
      <section className="bg-midnight pb-24 sm:pb-32">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <div className="space-y-12">
              {sections.map((s) => (
                <div key={s.h}>
                  <h2 className="mb-4 font-display text-2xl font-bold text-ivory">
                    {s.h}
                  </h2>
                  <div className="space-y-4">
                    {s.p.map((para, i) => (
                      <p key={i} className="leading-relaxed text-ivory/65">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
