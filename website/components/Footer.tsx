import Link from "next/link";
import Compass from "./Compass";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/explore", label: "Explore" },
      { href: "/peregrine", label: "Peregrine" },
      { href: "/pricing", label: "Pricing" },
      { href: "/waitlist", label: "Early Access" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "/community", label: "Travelers" },
      { href: "/creators", label: "Creators" },
      { href: "/blog", label: "Journal" },
      { href: "/search", label: "Search" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/faqs", label: "FAQs" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

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

        <div className="mb-14 flex items-center justify-center gap-2.5 text-xs uppercase tracking-label text-ivory/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/peregrine-mark.png"
            alt="Peregrine"
            className="h-5 w-auto opacity-80"
          />
          Ask Peregrine, your AI travel companion
        </div>

        <div className="grid gap-12 border-t border-ivory/5 pt-12 sm:grid-cols-2 md:grid-cols-5">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Compass className="h-6 w-6 text-golden" />
              <span className="font-display text-xl font-semibold text-ivory">
                Drift
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/40">
              The social travel platform. Discover places through real
              travelers, plan with Peregrine, and watch your world map grow.
            </p>
            <p className="mt-4 text-sm text-ivory/40">
              Built by travelers, for travelers.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-label text-ivory/40">
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-ivory/60 transition hover:text-ivory"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-14 border-t border-ivory/5 pt-8 text-center text-xs text-ivory/25">
          © {new Date().getFullYear()} Drift. Collect stories, not souvenirs.
        </p>
      </div>
    </footer>
  );
}
