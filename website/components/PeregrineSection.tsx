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

function PaperclipIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <path d="M17 7.5 9 15.5a3 3 0 0 0 4.2 4.2l7.6-7.6a5 5 0 0 0-7.1-7.1L6.4 11.4a7 7 0 0 0 9.9 9.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const activeTrips = [
  {
    name: "Barcelona",
    status: "18 days away • 73% Planned",
    icon: MapPinIcon,
    badge: "bg-[#dae2fd]/30 text-black border border-[#bec6e0]/20",
  },
  {
    name: "Japan",
    status: "Saved Draft",
    icon: DraftIcon,
    badge: "bg-[#eceef0] text-[#45464d]",
  },
];

const quickActions = [
  {
    label: "Create\nItinerary",
    icon: CompassIcon,
    card: "bg-[#316bf3] text-[#fefcff]",
    badge: "bg-[#fefcff]/10 text-[#fefcff]",
  },
  {
    label: "Find\nRestaurants",
    icon: ForkKnifeIcon,
    card: "bg-[#ffdad6] text-[#93000a]",
    badge: "bg-[#93000a]/10 text-[#93000a]",
  },
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

        {/* App dashboard preview: an exact recreation of the Peregrine
            dashboard mockup, including its own light color scheme and
            Plus Jakarta Sans/Inter typography (not the site's dark theme). */}
        <Reveal delay={0.15}>
          <div className="font-jakarta mx-auto w-full max-w-sm overflow-hidden rounded-3xl bg-[#f7f9fb] shadow-2xl">
            {/* top bar */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-[#c6c6cd]/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/peregrine-mark.png"
                  alt=""
                  className="h-full w-full bg-[#0A0D12] object-contain p-1.5"
                />
              </div>
              <span className="text-lg font-bold tracking-tight text-black">
                Peregrine
              </span>
              <BellIcon className="h-5 w-5 text-black" />
            </div>

            {/* hero */}
            <div className="relative mx-4 h-[220px] overflow-hidden rounded-[2rem] shadow-xl">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1583844056361-4418a8f2a985?auto=format&fit=crop&w=1200&q=80'), linear-gradient(160deg, #24356B 0%, #151A24 100%)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-4">
                <p className="mb-3 text-2xl font-bold leading-tight text-white">
                  Where are we drifting next?
                </p>
                <div className="flex items-center overflow-hidden rounded-full border border-white/30 bg-white/20 backdrop-blur-md">
                  <SearchIcon className="ml-4 h-4 w-4 flex-shrink-0 text-white" />
                  <span className="py-2.5 pl-3 pr-4 text-sm text-white/70">
                    Search destinations...
                  </span>
                </div>
              </div>
            </div>

            {/* active trips */}
            <div className="space-y-3 p-4">
              <h3 className="px-1 text-lg font-bold text-black">
                Active Trips
              </h3>
              {activeTrips.map((trip) => (
                <div
                  key={trip.name}
                  className="flex items-center justify-between rounded-2xl border border-[#e0e3e5] bg-white p-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${trip.badge}`}
                    >
                      <trip.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#191c1e]">
                        {trip.name}
                      </h4>
                      <p className="mt-0.5 font-sans text-sm text-[#45464d]">
                        {trip.status}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#eceef0] px-4 py-2 text-xs font-medium text-black">
                    Continue
                  </span>
                </div>
              ))}
            </div>

            {/* try asking */}
            <div className="space-y-3 px-4 pb-1">
              <h3 className="px-1 text-xs font-semibold uppercase tracking-wider text-[#76777d]">
                Try Asking
              </h3>
              <div className="flex flex-col gap-2.5">
                {[
                  "Plan a 5-day itinerary for Tokyo...",
                  "Find hidden gem restaurants in Rome...",
                  "Weekend getaways near me",
                ].map((ask) => (
                  <span
                    key={ask}
                    className="flex items-center gap-2 rounded-full border border-[#c6c6cd]/30 bg-white px-4 py-2 font-sans text-sm text-[#191c1e] shadow-sm"
                  >
                    <ChatIcon className="h-4 w-4 flex-shrink-0 text-[#0051d5]" />
                    {ask}
                  </span>
                ))}
              </div>
            </div>

            {/* quick actions */}
            <div className="grid grid-cols-2 gap-4 p-4">
              {quickActions.map((action) => (
                <div
                  key={action.label}
                  className={`flex flex-col items-start gap-6 rounded-3xl p-5 shadow-sm ${action.card}`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${action.badge}`}
                  >
                    <action.icon className="h-6 w-6" />
                  </div>
                  <span className="whitespace-pre-line text-[20px] font-semibold leading-tight">
                    {action.label}
                  </span>
                </div>
              ))}
            </div>

            {/* input bar */}
            <div className="p-4 pt-1">
              <div className="flex items-center gap-3 rounded-full border border-[#c6c6cd]/30 bg-[#f2f4f6] p-2 pl-4 shadow-sm">
                <PaperclipIcon className="h-5 w-5 flex-shrink-0 text-[#76777d]" />
                <span className="flex-1 font-sans text-sm text-[#76777d]">
                  Ask Peregrine anything...
                </span>
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#0051d5] text-white shadow-sm">
                  <MicIcon className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
