import Reveal from "./Reveal";

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m20 20-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <path d="M6 8a6 6 0 0 1 12 0c0 4 1.5 5.5 2 6.5H4c.5-1 2-2.5 2-6.5Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 18a2 2 0 0 0 4 0" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GroupIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M15.5 14c2.5.3 4.5 2.4 4.5 6" strokeLinecap="round" />
    </svg>
  );
}

function HeartIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 21s-7.5-4.6-10-9.3C.4 8.3 2 5 5.4 5c2 0 3.5 1.1 4.6 2.7C11.1 6.1 12.6 5 14.6 5 18 5 19.6 8.3 22 11.7 19.5 16.4 12 21 12 21Z" />
    </svg>
  );
}

function CommentIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <path d="M4 5h16v11H8l-4 3.5V5Z" strokeLinejoin="round" />
    </svg>
  );
}

function BookmarkIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <path d="M6 3h12v18l-6-4-6 4Z" strokeLinejoin="round" />
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

function CalendarIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 9h16M8 3v4M16 3v4" strokeLinecap="round" />
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

function PersonIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" strokeLinecap="round" />
    </svg>
  );
}

const posts = [
  {
    place: "SANTORINI, GREECE",
    title: "Chasing the Azure Horizon",
    author: "Elena Rossi",
    likes: "1.1k",
    comments: "56",
    img: "https://images.unsplash.com/photo-1583844056361-4418a8f2a985?auto=format&fit=crop&w=1200&q=80",
  },
  {
    place: "KYOTO, JAPAN",
    title: "The Silence of the Cedar",
    author: "Julien Vance",
    likes: "662",
    comments: "12",
    img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function FeedSection() {
  return (
    <section className="relative overflow-hidden bg-midnight py-28 sm:py-36">
      <div className="pointer-events-none absolute left-0 top-1/3 h-[420px] w-[480px] rounded-full bg-ocean/10 blur-[160px]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
        {/* Copy */}
        <Reveal>
          <p className="label-kicker mb-4">Part one: The Feed</p>
          <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-ivory sm:text-6xl">
            A feed that makes you
            <span className="italic text-gradient-gold"> want to go.</span>
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ivory/65">
            Open Drift and see where the world is actually going, real trips
            from real explorers, not ads. Save a place with one tap, or steal
            the whole itinerary behind it. Your upcoming trips ride right at
            the top, and inviting friends unlocks more of the app for free.
          </p>
        </Reveal>

        {/* Feed wireframe: exact recreation of the reference screenshot */}
        <Reveal delay={0.15}>
          <div className="font-dm-sans mx-auto w-full max-w-sm overflow-hidden rounded-3xl bg-[#fff8f3] shadow-2xl">
            {/* top bar */}
            <div className="flex items-center justify-between px-5 pt-5">
              <span className="font-caslon text-2xl text-[#040d1b]">
                Drift
              </span>
              <div className="flex items-center gap-4 text-[#040d1b]">
                <SearchIcon className="h-5 w-5" />
                <BellIcon className="h-5 w-5" />
              </div>
            </div>

            {/* tabs */}
            <div className="mt-4 flex gap-6 border-b border-[#eae1d7] px-5">
              <span className="border-b-2 border-[#040d1b] pb-3 text-sm font-semibold text-[#040d1b]">
                For You
              </span>
              <span className="pb-3 text-sm text-[#45474c]">Following</span>
            </div>

            {/* upcoming trips */}
            <div className="px-5 pt-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#75777d]">
                  Upcoming Trips
                </span>
                <span className="text-xs text-[#75777d]">See All</span>
              </div>
              <div className="flex gap-3">
                <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=400&q=80')",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-1.5 left-1.5 right-1.5">
                    <p className="text-[11px] font-semibold leading-tight text-white">
                      Copenhagen
                    </p>
                    <p className="text-[9px] text-white/70">OCT 15 - 18</p>
                  </div>
                </div>
                <div className="h-24 flex-1 rounded-xl bg-[#eae1d7]/60" />
              </div>
            </div>

            {/* invite card */}
            <div className="mx-5 mt-4 flex items-center justify-between gap-3 rounded-2xl bg-[#040d1b] p-4">
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">
                  Travel is better with friends
                </p>
                <p className="mt-1 text-xs text-white/60">
                  Invite 5 friends to unlock exclusive Pro features.
                </p>
                <span className="mt-3 inline-block rounded-full bg-[#fed65b] px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#040d1b]">
                  Invite Friends
                </span>
              </div>
              <GroupIcon className="h-9 w-9 flex-shrink-0 text-white/50" />
            </div>

            {/* posts */}
            <div className="space-y-4 p-5">
              {posts.map((post) => (
                <div
                  key={post.title}
                  className="relative h-72 overflow-hidden rounded-2xl"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${post.img}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute inset-x-4 bottom-4">
                    <p className="text-[11px] font-semibold tracking-wider text-white/80">
                      {post.place}
                    </p>
                    <p className="font-caslon mt-1 text-xl leading-tight text-white">
                      {post.title}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#fed65b] text-[10px] font-bold text-[#040d1b]">
                        {post.author.charAt(0)}
                      </div>
                      <span className="text-xs text-white/80">
                        {post.author}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-white/80">
                      <span className="flex items-center gap-1 text-xs">
                        <HeartIcon className="h-3.5 w-3.5" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1 text-xs">
                        <CommentIcon className="h-3.5 w-3.5" />
                        {post.comments}
                      </span>
                      <span className="ml-auto flex items-center gap-1 text-xs">
                        <BookmarkIcon className="h-3.5 w-3.5" />
                        Steal Itinerary
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* bottom nav */}
            <div className="flex items-center justify-around border-t border-[#eae1d7] px-2 pb-5 pt-3">
              <div className="flex flex-col items-center gap-1 rounded-2xl bg-[#fed65b] px-4 py-1.5 text-[#040d1b]">
                <HomeIcon className="h-5 w-5" />
                <span className="text-[10px] font-semibold">Home</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-[#45474c]">
                <ExploreIcon className="h-5 w-5" />
                <span className="text-[10px]">Explore</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-[#45474c]">
                <CalendarIcon className="h-5 w-5" />
                <span className="text-[10px]">Trips</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-[#45474c]">
                <SparkleIcon className="h-5 w-5" />
                <span className="text-[10px]">Peregrine</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-[#45474c]">
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
