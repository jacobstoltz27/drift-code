import Link from "next/link";
import PageShell from "@/components/PageShell";
import Compass from "@/components/Compass";

export default function NotFound() {
  return (
    <PageShell>
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-midnight px-6 pt-24">
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-forest/25 blur-[160px]" />
        <div className="relative text-center">
          <Compass className="mx-auto mb-8 h-16 w-16 animate-slow-spin text-golden/70" />
          <p className="label-kicker mb-4">404 · Uncharted</p>
          <h1 className="font-display text-5xl font-bold leading-[1.02] tracking-tight text-ivory sm:text-7xl">
            You&apos;ve drifted
            <br />
            <span className="italic text-gradient-gold">off the map.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-ivory/60">
            This page doesn&apos;t exist, which, honestly, is very on brand for
            an explorer. Here&apos;s the way back.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="magnetic rounded-full bg-golden px-7 py-3 font-semibold text-midnight transition hover:scale-105"
            >
              Back home
            </Link>
            <Link
              href="/search"
              className="rounded-full border border-ivory/20 px-7 py-3 font-semibold text-ivory/80 transition hover:border-ivory/40 hover:text-ivory"
            >
              Search the site
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
