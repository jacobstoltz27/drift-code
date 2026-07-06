import Compass from "./Compass";

export default function Footer() {
  return (
    <footer className="border-t border-ivory/5 bg-midnight py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 text-center">
          <p className="mx-auto max-w-xl font-display text-2xl font-bold italic leading-relaxed text-ivory/80 sm:text-3xl">
            &ldquo;Travel isn&apos;t always pretty. It isn&apos;t always
            comfortable. But it leaves marks on your memory, your consciousness,
            your heart. And you take it with you.&rdquo;
          </p>
        </div>

        <div className="mb-12 flex items-center justify-center gap-2.5 text-xs uppercase tracking-label text-ivory/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/peregrine-mark.png"
            alt="Peregrine"
            className="h-5 w-auto opacity-80"
          />
          Ask Peregrine, your AI travel companion
        </div>

        <div className="flex flex-col items-center justify-between gap-8 border-t border-ivory/5 pt-10 md:flex-row">
          <div className="flex items-center gap-2">
            <Compass className="h-6 w-6 text-golden" />
            <span className="font-display text-xl font-semibold text-ivory">
              Drift
            </span>
          </div>

          <p className="text-sm text-ivory/40">
            Built by travelers, for travelers.
          </p>

          <div className="flex gap-6 text-sm text-ivory/50">
            <a href="#features" className="transition hover:text-ivory">Features</a>
            <a href="#pricing" className="transition hover:text-ivory">Pricing</a>
            <a href="#waitlist" className="transition hover:text-ivory">Early Access</a>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-ivory/25">
          © {new Date().getFullYear()} Drift. Collect stories, not souvenirs.
        </p>
      </div>
    </footer>
  );
}
