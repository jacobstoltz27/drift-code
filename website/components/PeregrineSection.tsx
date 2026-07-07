import { peregrineAsks } from "@/lib/content";
import Reveal from "./Reveal";

function BellIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <path d="M6 8a6 6 0 0 1 12 0c0 4 1.5 5.5 2 6.5H4c.5-1 2-2.5 2-6.5Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 18a2 2 0 0 0 4 0" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m20 20-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}

function MicIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MapPinIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <path d="M12 21s7-6.3 7-11.5a7 7 0 1 0-14 0C5 14.7 12 21 12 21Z" strokeLinejoin="round" />
      <circle cx="12" cy="9.5" r="2.3" />
    </svg>
  );
}

function DraftIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <path d="M7 3h7l4 4v14H7Z" strokeLinejoin="round" />
      <path d="M14 3v4h4" strokeLinejoin="round" />
    </svg>
  );
}

function CompassIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15 9-2 6-4 2 2-6 4-2Z" strokeLinejoin="round" />
    </svg>
  );
}

function ForkKnifeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <path d="M7 3v7a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V3M8 12v9M16 3c-1.4 0-2.5 2-2.5 5s1.1 4 2.5 4v9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChatIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <path d="M4 5h16v11H8l-4 3.5V5Z" strokeLinejoin="round" />
    </svg>
  );
}

const activeTrips = [
  { name: "Barcelona", status: "18 days away · 73% planned", icon: MapPinIcon },
  { name: "Japan", status: "Saved draft", icon: DraftIcon },
];

const quickActions = [
  { label: "Create Itinerary", icon: CompassIcon, tone: "bg-golden/15 text-golden" },
  { label: "Find Restaurants", icon: ForkKnifeIcon, tone: "bg-forest/40 text-ivory" },
];

export default function PeregrineSection() {
  return (
    <section
      id="peregrine"
      className="relative overflow-hidden bg-midnight py-28 sm:py-36"
    >
      <div className="pointer-events-none absolute right-0 top-1/4 h-[420px] w-[480px] rounded-full bg-ocean/10 blur-[160px]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
        {/* Copy */}
        <Reveal>
          <div className="mb-5 flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/peregrine-mark.png"
              alt="Peregrine"
              className="h-7 w-auto"
            />
            <span className="label-kicker">Ask Peregrine</span>
          </div>
          <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-ivory sm:text-6xl">
            Land like you already
            <span className="italic text-gradient-gold"> know the place.</span>
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ivory/65">
            Peregrine is your AI travel companion inside Drift. Ask it anything
            and your whole trip is planned in one conversation, shaped to your
            taste, your budget, and your crew. A local&apos;s instinct for the
            places guidebooks miss.
          </p>

          <p className="mt-7 text-xs font-semibold uppercase tracking-label text-ivory/40">
            Ask anything
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {peregrineAsks.map((ask) => (
              <span
                key={ask}
                className="rounded-full border border-ivory/10 bg-charcoal/60 px-4 py-2 text-sm text-ivory/75 backdrop-blur-sm"
              >
                &ldquo;{ask}&rdquo;
              </span>
            ))}
          </div>

          <a
            href="#waitlist"
            className="magnetic mt-8 inline-block rounded-full bg-golden px-7 py-3.5 font-semibold text-midnight transition hover:scale-105 glow-gold"
          >
            Get Early Access
          </a>
        </Reveal>

        {/* App dashboard preview */}
        <Reveal delay={0.15}>
          <div className="glass mx-auto w-full max-w-md overflow-hidden rounded-3xl shadow-2xl">
            {/* top bar */}
            <div className="flex items-center justify-between border-b border-ivory/10 px-5 py-4">
              <div className="flex items-center gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/peregrine-mark.png"
                  alt=""
                  className="h-6 w-auto"
                />
                <span className="font-display text-base font-bold text-ivory">
                  Peregrine
                </span>
              </div>
              <BellIcon className="h-5 w-5 text-ivory/50" />
            </div>

            {/* hero */}
            <div className="relative m-4 h-36 overflow-hidden rounded-2xl">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1583779457094-ab6f77f7bf9d?auto=format&fit=crop&w=1200&q=80'), linear-gradient(160deg, #24356B 0%, #151A24 100%)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/40 to-transparent" />
              <div className="absolute inset-x-3 bottom-3">
                <p className="mb-2 font-display text-lg font-bold leading-tight text-ivory">
                  Where are we drifting next?
                </p>
                <div className="flex items-center gap-2 rounded-full border border-ivory/20 bg-midnight/50 px-3 py-2 backdrop-blur-sm">
                  <SearchIcon className="h-4 w-4 text-ivory/70" />
                  <span className="text-xs text-ivory/50">
                    Search destinations...
                  </span>
                </div>
              </div>
            </div>

            {/* active trips */}
            <div className="px-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-label text-ivory/40">
                Active Trips
              </p>
              <div className="space-y-2">
                {activeTrips.map((trip) => (
                  <div
                    key={trip.name}
                    className="flex items-center justify-between rounded-2xl border border-ivory/10 bg-charcoal/60 px-3 py-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ocean/10 text-golden">
                        <trip.icon className="h-[18px] w-[18px]" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ivory">
                          {trip.name}
                        </p>
                        <p className="text-xs text-ivory/50">{trip.status}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-ivory/10 px-3 py-1.5 text-xs font-medium text-ivory/80">
                      Continue
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* try asking */}
            <div className="mt-4 px-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-label text-ivory/40">
                Try Asking
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Plan a 5-day itinerary for Tokyo...",
                  "Find hidden gem restaurants in Rome...",
                  "Weekend getaways near me",
                ].map((ask) => (
                  <span
                    key={ask}
                    className="flex items-center gap-1.5 rounded-full border border-ivory/10 bg-charcoal/60 px-3 py-1.5 text-xs text-ivory/70"
                  >
                    <ChatIcon className="h-3.5 w-3.5 text-golden" />
                    {ask}
                  </span>
                ))}
              </div>
            </div>

            {/* quick actions */}
            <div className="mt-4 grid grid-cols-2 gap-3 px-4">
              {quickActions.map((action) => (
                <div
                  key={action.label}
                  className={`flex flex-col items-start gap-4 rounded-2xl p-4 ${action.tone}`}
                >
                  <action.icon className="h-6 w-6" />
                  <span className="text-sm font-semibold leading-tight">
                    {action.label}
                  </span>
                </div>
              ))}
            </div>

            {/* input bar */}
            <div className="m-4 mt-5 flex items-center gap-2 rounded-full border border-ivory/10 bg-midnight/60 px-4 py-2.5 text-sm text-ivory/40">
              Ask Peregrine anything...
              <MicIcon className="ml-auto h-4 w-4 text-golden" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
