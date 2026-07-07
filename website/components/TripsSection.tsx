import Reveal from "./Reveal";

function CalendarIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 9h16M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MoreIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </svg>
  );
}

function SparkleIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2 14 9 21 12 14 15 12 22 10 15 3 12 10 9Z" />
    </svg>
  );
}

function HomeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <path d="M4 11 12 4l8 7v9h-6v-6h-4v6H4Z" strokeLinejoin="round" />
    </svg>
  );
}

function ExploreIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15 9-2 6-4 2 2-6 4-2Z" strokeLinejoin="round" />
    </svg>
  );
}

function PersonIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" strokeLinecap="round" />
    </svg>
  );
}

const tabs = ["Planned", "Past", "Saved", "Stolen"];

const trips = [
  {
    place: "Barcelona, Spain",
    dates: "June 4 — June 10",
    length: "6 Days",
    badge: "In 27 days",
    friends: "+2 friends",
    avatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDD_dpOKPCSMMlwhiWFMhFJwiHjxQ2fUZfeKscWooea3gM4oSwrn8H2fPw9cVaYN0woDX-2bmTB6d7OoouK6Xa5kn2mWOvp8wLI7I_ws01dUTtLJfcrLMHpJZ0W3faP8rXnEKdzQWL381iPx6QMOYwunjmXlqLw-aAT96RZhywuLZiqJ13nvTJcQMo3Zi5ZUF5VhVLoooqutEDjSUWAu8G1f5-m9Nv7GSDjAqpupi9B0bI1Mc60UTD-P-XOHcgJx5KjT1UZVRBV1u4P",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAswyTyt0m3IzZuoEurQaa94uKf6EoZ2WN7EAOG8VZ8q5JFw3lp1NN30BxAhmhLY5WMAug_KXPMuEQJxDazsteCCyPimbGhUBXwAMPSFL2zH7bD0-5LCKHhlRBNhfMWoa9TyEcUkelGUM3GShsYDh3R5zbUvucco3gbwBY3eIzuMOghBtX2QFYMTUBG4PQhtK-yblyTHfTS2SO3LmzG2gfISKR8MC8qArQFDjokso9jLDgerJ1lyW6xtnnTb9Jsx8dpNNEsQCJziodR",
    ],
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBB1wSJ3GhfMY1QCGwLxgps3Yz2XJRwx88o8ZcLBBbgJmZW5sxJB-Ji8Fwv0_ydXHqtwHhYxhU8RFL1a34VlIET6e01n9TG7FUxQnSORPcVY9pv57STpV5zhXsC6mNw7UX1wguYXxIhfIIDwtj1RcPeO7sC1r-YlzJdIdaeK2Z9sP7qCOnP8qCFo-NCt0_gkT-qe7DI8a57cFsChN8sxTIEWWLJZ_OGySIRq7sPpN8bSHwAlZ2geZkqauxSeP_TNEQ-1r6DVbqGSluo",
  },
  {
    place: "New York City, USA",
    dates: "July 18 — July 24",
    length: "6 Days",
    badge: "Confirmed",
    friends: "Me & 1 friend",
    avatars: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDRfYbUL2RPcc_rACfnQQwlJU3CGwz6OC6zl-CAS9v_JxGLfLXh76ObP2Ktrb43PQARWT7IegnNGGwzojgCZTyQaCcUIG1F-b8NfbSaPIypXakuR4VcYChiNopQzqkAzCJQAx8PmxWmEonvLIVXsA2fr1D6ZzKi09abRJtSWcxvIFOaxN7GoOGKgxCs-zTEK5LlsHDFSzg5-FlubWVCNCWQ5CcuwaZd6SM8-nNNA1OTVy7KpgwOmtmlMLn6xq4LFc4KjdGA1VZwjWIe",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDg09geAQsLNBSuOjTuuWpMuFCOyw60_BQkwuODjqr9QmDe7GZheE-xrRC7Jvom9kSR5w6I6uWBKmlhYdqSxEkUlXK0k4qNca9AdAKc26Oj2nwsPHu-_UMIjvHBx7nXfqVM1vFHPtPbWbdoXuy_ijUIcYXabvcw-72avxjmnb48QtQCJlpHJiPeHylS0EzDTNCoGTnfzLgue9qtMLvHF61VMgl9KP-2mduzy_I9IsNZuM2TteQrnD34LRzU1EPdzyuXV2KXN8QkK57Z",
    ],
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwrTDwkriGt0-Y4jjIBO2id9qQALJP7-5gCtXBTvtvojxaTThe4JLFzFTi0SfVZz2GABmC7hVer9gT6r2MhFZb3MrFecrboue8JTccTBd8aPaI1ADVyTjlB3AQafoYtzWFEgJD3I-ZbnBGBDLzxR3LXd3IP4Q4P7SfYxtkKMyXAbq1jARwJcjvSZlKwfXepzxNz_2q5eT-FgM8_cjM8fQvjNBs3l0GHrdte8zM6Zp-cwnNrurMOf4juk7spIRPUEm6S6n77TBnRS7V",
  },
];

export default function TripsSection() {
  return (
    <section className="relative overflow-hidden bg-midnight py-28 sm:py-36">
      <div className="pointer-events-none absolute right-0 top-1/4 h-[420px] w-[480px] rounded-full bg-forest/20 blur-[160px]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
        {/* Copy */}
        <Reveal>
          <p className="label-kicker mb-4">Part two: My Trips</p>
          <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-ivory sm:text-6xl">
            Every trip,
            <span className="italic text-gradient-gold"> one place.</span>
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ivory/65">
            Planned, past, saved, or stolen, your whole travel life lives in
            one tab. See who&apos;s coming, how many days until you leave, and
            jump back into planning with a tap on the Peregrine button.
          </p>
        </Reveal>

        {/* Trips wireframe: exact recreation of the reference mockup */}
        <Reveal delay={0.15}>
          <div className="font-dm-sans relative mx-auto w-full max-w-md overflow-hidden rounded-3xl bg-[#fff8f3] shadow-2xl">
            {/* top bar */}
            <div className="flex items-center justify-between px-5 pt-5">
              <span className="text-[#040d1b]">☰</span>
              <span className="font-caslon text-lg uppercase tracking-widest text-[#040d1b]">
                Drift
              </span>
              <span className="text-[#040d1b]">🔔</span>
            </div>

            {/* hero */}
            <div className="px-5 pb-4 pt-5">
              <p className="font-caslon text-2xl text-[#040d1b]">My Trips</p>
              <p className="mt-1 text-sm text-[#45474c]">
                Manage your travels, all in one place.
              </p>
            </div>

            {/* tabs */}
            <div className="flex gap-2 px-5 pb-5">
              {tabs.map((tab, i) => (
                <span
                  key={tab}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium ${
                    i === 0
                      ? "bg-[#040d1b] text-white"
                      : "bg-[#f0e7dd] text-[#45474c]"
                  }`}
                >
                  {tab}
                </span>
              ))}
            </div>

            {/* trip cards */}
            <div className="flex flex-col gap-4 px-5 pb-5">
              {trips.map((trip) => (
                <div
                  key={trip.place}
                  className="relative aspect-[4/5] overflow-hidden rounded-3xl"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${trip.img}')` }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(4,13,27,0.9) 0%, rgba(4,13,27,0.3) 40%, transparent 100%)",
                    }}
                  />
                  <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-white/15 px-3 py-1 text-xs text-white backdrop-blur-sm">
                    {trip.badge}
                  </div>
                  <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/15 text-white backdrop-blur-sm">
                    <MoreIcon className="h-4 w-4" />
                  </div>
                  <div className="absolute inset-x-5 bottom-5">
                    <p className="font-caslon text-lg text-white">
                      {trip.place}
                    </p>
                    <div className="mt-1.5 mb-4 flex items-center gap-3 text-xs text-white/80">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        {trip.dates}
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="h-3.5 w-3.5" />
                        {trip.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {trip.avatars.map((avatar) => (
                          <div
                            key={avatar}
                            className="h-7 w-7 overflow-hidden rounded-full border-2 border-[#040d1b] bg-[#eae1d7]"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={avatar}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      <span className="text-xs text-white/60">
                        {trip.friends}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* FAB */}
            <div className="pointer-events-none absolute bottom-24 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#fed65b] text-[#040d1b] shadow-xl">
              <SparkleIcon className="h-6 w-6" />
            </div>

            {/* bottom nav */}
            <div className="flex items-center justify-around border-t border-[#eae1d7] px-2 pb-5 pt-3">
              <div className="flex flex-col items-center gap-1 text-[#45474c] opacity-60">
                <HomeIcon className="h-5 w-5" />
                <span className="text-[10px]">Home</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-[#45474c] opacity-60">
                <ExploreIcon className="h-5 w-5" />
                <span className="text-[10px]">Explore</span>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-full bg-[#fed65b] px-4 py-1.5 text-[#040d1b]">
                <CalendarIcon className="h-5 w-5" />
                <span className="text-[10px] font-semibold">Trips</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-[#45474c] opacity-60">
                <SparkleIcon className="h-5 w-5" />
                <span className="text-[10px]">Peregrine</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-[#45474c] opacity-60">
                <PersonIcon className="h-5 w-5" />
                <span className="text-[10px]">Profile</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
