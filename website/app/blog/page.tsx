import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import WaitlistCTA from "@/components/WaitlistCTA";
import { posts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "The Drift Journal",
  description:
    "Field notes on travel, planning, and the art of going: stories and ideas from the team building Drift.",
};

export default function BlogPage() {
  const [featured, ...rest] = posts;
  return (
    <PageShell>
      <PageHero
        kicker="The Drift Journal"
        title={
          <>
            Field notes on
            <br />
            <span className="italic text-gradient-gold">the art of going.</span>
          </>
        }
        sub="Ideas, stories, and the occasional strong opinion from the team building Drift."
      />

      <section className="bg-midnight pb-24 sm:pb-32">
        <div className="mx-auto max-w-6xl px-6">
          {/* Featured post */}
          <Reveal>
            <Link
              href={`/blog/${featured.slug}`}
              className="group mb-14 grid overflow-hidden rounded-[28px] border border-ivory/5 bg-charcoal/40 md:grid-cols-2"
            >
              <div
                className="h-64 w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105 md:h-full"
                style={{
                  backgroundImage: `url('${featured.img}'), linear-gradient(135deg, #24356B 0%, #151A24 70%)`,
                }}
              />
              <div className="flex flex-col justify-center p-8 sm:p-12">
                <p className="mb-3 text-xs font-semibold uppercase tracking-label text-golden">
                  {featured.tag} · {featured.displayDate}
                </p>
                <p className="font-display text-3xl font-bold leading-tight text-ivory sm:text-4xl">
                  {featured.title}
                </p>
                <p className="mt-4 leading-relaxed text-ivory/60">
                  {featured.excerpt}
                </p>
                <p className="mt-6 text-sm font-semibold text-golden">
                  Read the story →
                </p>
              </div>
            </Link>
          </Reveal>

          {/* Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 0.08}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-ivory/5 bg-charcoal/40 transition hover:border-ivory/15"
                >
                  <div
                    className="h-48 w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage: `url('${p.img}'), linear-gradient(135deg, #24356B 0%, #151A24 70%)`,
                    }}
                  />
                  <div className="flex flex-1 flex-col p-6">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-label text-golden">
                      {p.tag}
                    </p>
                    <p className="font-display text-xl font-bold leading-snug text-ivory">
                      {p.title}
                    </p>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ivory/55">
                      {p.excerpt}
                    </p>
                    <p className="mt-4 text-xs text-ivory/40">
                      {p.displayDate} · {p.readTime}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <WaitlistCTA />
    </PageShell>
  );
}
