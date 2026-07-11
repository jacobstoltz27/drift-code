import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms for using the Drift website and joining the waitlist, written to be actually readable.",
};

const sections = [
  {
    h: "What you're agreeing to",
    p: [
      "These terms cover this website and the Drift waitlist. When the Drift app launches, it will come with its own terms; nothing here signs you up for anything beyond an email list you can leave at any time.",
    ],
  },
  {
    h: "The waitlist",
    p: [
      "Joining the waitlist reserves your place in line for early access. It doesn't create an account, cost anything, or obligate you to anything. Access rolls out in waves and timing may shift; we'll always communicate honestly about where things stand.",
    ],
  },
  {
    h: "What Drift is (and isn't)",
    p: [
      "Drift is a travel discovery and planning platform. It is not a travel agency or booking service: we don't sell flights, accommodation, or tours, and we don't process travel payments. Suggestions on Drift are inspiration and organization, not offers; how you get there and where you stay is between you and the wider world.",
      "Travel involves judgment calls only you can make. Itineraries shared by the community or drafted by Peregrine are starting points; check the practical details (openings, conditions, local guidance) before you rely on them.",
    ],
  },
  {
    h: "Content on this site",
    p: [
      "The Drift name, the Peregrine name and mark, and the writing and design of this site belong to us. You're welcome to share and quote it with attribution; you may not pass it off as your own or use it to impersonate Drift.",
    ],
  },
  {
    h: "Acceptable use",
    p: [
      "Don't abuse the waitlist (mass-submitting emails that aren't yours), attempt to breach the site's security, or scrape it in ways that degrade it for others. We may remove waitlist entries created abusively.",
    ],
  },
  {
    h: "Liability",
    p: [
      "This site is provided as-is. To the maximum extent the law allows, we're not liable for indirect damages arising from using it. Nothing in these terms limits liability that can't legally be limited.",
    ],
  },
  {
    h: "Changes and contact",
    p: [
      "If these terms change materially, the date above will change with them. Questions? Write to hello@driftapp.travel and a person will answer.",
    ],
  },
];

export default function TermsPage() {
  return (
    <PageShell>
      <PageHero
        align="left"
        kicker="Terms of Service"
        title="Readable terms."
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
