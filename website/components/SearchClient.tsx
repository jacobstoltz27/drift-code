"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { searchIndex, type SearchItem } from "@/lib/searchIndex";

const kinds: Array<SearchItem["kind"] | "All"> = [
  "All",
  "Page",
  "Feature",
  "Destination",
  "Journal",
  "FAQ",
];

export default function SearchClient() {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<(typeof kinds)[number]>("All");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return searchIndex.filter((item) => {
      if (kind !== "All" && item.kind !== kind) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.text.toLowerCase().includes(q)
      );
    });
  }, [query, kind]);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <input
        type="search"
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Try “Peregrine”, “Japan”, “pricing”…"
        aria-label="Search the site"
        className="w-full rounded-full border border-ivory/15 bg-charcoal/70 px-6 py-4 text-lg text-ivory placeholder:text-ivory/35 outline-none transition focus:border-golden/60 focus:ring-2 focus:ring-golden/20"
      />

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {kinds.map((k) => (
          <button
            key={k}
            onClick={() => setKind(k)}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              kind === k
                ? "bg-golden font-semibold text-midnight"
                : "border border-ivory/15 text-ivory/60 hover:border-ivory/30 hover:text-ivory"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      <div className="mt-10 space-y-3 text-left">
        {results.length === 0 ? (
          <p className="py-12 text-center text-ivory/50">
            Nothing found for &ldquo;{query}&rdquo;. Uncharted territory, our
            favorite kind. Try another word, or{" "}
            <Link href="/contact" className="text-golden hover:underline">
              ask us directly
            </Link>
            .
          </p>
        ) : (
          results.map((item, i) => (
            <motion.div
              key={`${item.kind}-${item.title}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
            >
              <Link
                href={item.href}
                className="group flex items-start justify-between gap-4 rounded-2xl border border-ivory/5 bg-charcoal/40 p-5 transition hover:border-golden/30"
              >
                <div>
                  <p className="font-display text-lg font-bold text-ivory group-hover:text-golden">
                    {item.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ivory/55">
                    {item.text}
                  </p>
                </div>
                <span className="mt-1 flex-shrink-0 rounded-full border border-ivory/10 px-3 py-1 text-xs uppercase tracking-label text-ivory/40">
                  {item.kind}
                </span>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
