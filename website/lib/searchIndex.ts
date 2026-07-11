// Static client-side search index for /search.
// Built from the same content objects the pages render, so it stays in sync.

import { destinations, features, faqs } from "./content";
import { posts } from "./blog";

export type SearchItem = {
  title: string;
  text: string;
  href: string;
  kind: "Page" | "Feature" | "Destination" | "Journal" | "FAQ";
};

const pages: SearchItem[] = [
  { title: "Home", text: "Where will you drift to next? The social travel platform.", href: "/", kind: "Page" },
  { title: "About", text: "The story and principles behind Drift. People over brochures, stories over checklists.", href: "/about", kind: "Page" },
  { title: "Explore", text: "The world, unfolded. Destinations and discovery by feeling, not filter.", href: "/explore", kind: "Page" },
  { title: "Features", text: "The feed, Explore, Ask Peregrine, My Trips, World Travel Map, group planning.", href: "/features", kind: "Page" },
  { title: "Peregrine", text: "Your AI travel companion. Land like you already know the place.", href: "/peregrine", kind: "Page" },
  { title: "Community", text: "Powered by people who just got back. Real trips, house rules, the Drift loop.", href: "/community", kind: "Page" },
  { title: "Creators", text: "Don't just inspire trips, cause them. Steals, the founding creator program.", href: "/creators", kind: "Page" },
  { title: "Pricing", text: "Free forever to start. Drift Plus for unlimited planning and the full map.", href: "/pricing", kind: "Page" },
  { title: "Join the waitlist", text: "Early access rolls out in waves. Founding member perks.", href: "/waitlist", kind: "Page" },
  { title: "The Drift Journal", text: "Field notes on travel, planning, and the art of going.", href: "/blog", kind: "Page" },
  { title: "FAQs", text: "Questions about Peregrine, pricing, privacy, and stealing itineraries.", href: "/faqs", kind: "Page" },
  { title: "Contact", text: "Talk to a human: hello, creators, and press channels.", href: "/contact", kind: "Page" },
  { title: "Privacy Policy", text: "Plain-language privacy. What we collect and what we never do.", href: "/privacy", kind: "Page" },
  { title: "Terms of Service", text: "Readable terms for the site and waitlist.", href: "/terms", kind: "Page" },
];

export const searchIndex: SearchItem[] = [
  ...pages,
  ...features.map((f) => ({
    title: f.name,
    text: `${f.kicker}. ${f.desc}`,
    href: "/features",
    kind: "Feature" as const,
  })),
  ...destinations.map((d) => ({
    title: d.name,
    text: `${d.tag} · ${d.coords}`,
    href: "/explore",
    kind: "Destination" as const,
  })),
  ...posts.map((p) => ({
    title: p.title,
    text: p.excerpt,
    href: `/blog/${p.slug}`,
    kind: "Journal" as const,
  })),
  ...faqs.map((f) => ({
    title: f.q,
    text: f.a,
    href: "/faqs",
    kind: "FAQ" as const,
  })),
];
