"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Reveal from "./Reveal";

const freeIncluded = [
  "Social feed and discovery",
  "Browse any community trip",
  "AI planner (2 trips)",
  "Basic profile page",
];

const freeUnlocks = [
  { label: "Steal itineraries", req: "1 friend" },
  { label: "Trip Score", req: "2 friends" },
  { label: "World Travel Map", req: "3 friends" },
  { label: "Group planning", req: "5 friends" },
];

const proFeatures = [
  "Unlimited AI trip generation",
  "Full Trip Score with AI insights",
  "World Travel Map (no invites needed)",
  "Group planning for any size",
  "Price alerts and best time to go",
  "Verified local Guides",
  "Offline itineraries",
  "Priority support",
];

export default function Pricing() {
  const [annual, setAnnual] = useState(true);
  const price = annual ? "7.19" : "8.99";
  const sub = annual
    ? "One payment of $86.28/year"
    : "Billed monthly";

  return (
    <section id="pricing" className="relative bg-midnight py-28 sm:py-36">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal className="text-center">
          <p className="label-kicker mb-5">Pricing</p>
          <h2 className="font-display text-5xl font-medium tracking-tight text-ivory sm:text-6xl">
            Start free.
          </h2>
          <h2 className="font-display text-5xl font-medium italic tracking-tight text-gradient-gold sm:text-6xl">
            Earn more. Unlock everything.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-ivory/60">
            Three ways to use Drift. Grow features for free by inviting friends,
            or go Pro for unlimited everything.
          </p>
        </Reveal>

        {/* Billing toggle */}
        <div className="mt-10 flex justify-center">
          <div className="flex items-center gap-1 rounded-full border border-ivory/10 bg-charcoal/60 p-1.5">
            <button
              onClick={() => setAnnual(false)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                !annual ? "bg-ivory/10 text-ivory" : "text-ivory/50"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition ${
                annual ? "bg-ocean text-ivory" : "text-ivory/50"
              }`}
            >
              Annual
              <span className="rounded-full bg-golden px-2 py-0.5 text-[10px] font-bold text-midnight">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Free */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-[24px] border border-ivory/10 bg-charcoal/50 p-8"
          >
            <h3 className="font-display text-2xl text-ivory">Free</h3>
            <div className="mt-4 flex items-end gap-1">
              <span className="font-display text-6xl font-semibold text-ivory">$0</span>
              <span className="mb-2 text-ivory/50">/mo</span>
            </div>
            <p className="text-sm text-ivory/45">Always free</p>

            <p className="mt-8 text-xs uppercase tracking-label text-ivory/40">
              Included
            </p>
            <ul className="mt-3 space-y-2.5">
              {freeIncluded.map((f) => (
                <li key={f} className="flex items-center gap-3 text-ivory/80">
                  <span className="text-forest">✓</span> {f}
                </li>
              ))}
            </ul>

            <p className="mt-8 text-xs uppercase tracking-label text-ivory/40">
              Unlock free by inviting
            </p>
            <ul className="mt-3 space-y-2.5">
              {freeUnlocks.map((u) => (
                <li
                  key={u.label}
                  className="flex items-center justify-between text-ivory/70"
                >
                  <span>{u.label}</span>
                  <span className="rounded-full border border-forest/40 px-2.5 py-0.5 text-xs text-forest">
                    {u.req}
                  </span>
                </li>
              ))}
            </ul>

            <a
              href="#waitlist"
              className="mt-8 block rounded-full border border-ivory/20 py-3 text-center font-medium text-ivory transition hover:bg-ivory/5"
            >
              Get Started Free
            </a>
          </motion.div>

          {/* Pro */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative rounded-[24px] border border-golden/30 bg-charcoal/70 p-8 glow-gold"
          >
            <span className="absolute right-6 top-6 rounded-full bg-ocean px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-ivory">
              Most Popular
            </span>
            <h3 className="font-display text-2xl text-ivory">Pro</h3>
            <div className="mt-4 flex items-end gap-1">
              <span className="font-display text-6xl font-semibold text-ivory">
                ${price}
              </span>
              <span className="mb-2 text-ivory/50">/mo</span>
              {annual && (
                <span className="mb-2 ml-2 text-ivory/35 line-through">$8.99</span>
              )}
            </div>
            <p className="text-sm text-ivory/45">{sub}</p>

            <p className="mt-8 text-xs uppercase tracking-label text-golden/70">
              Everything in Free, plus
            </p>
            <ul className="mt-3 space-y-2.5">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3 text-ivory/85">
                  <span className="text-golden">✦</span> {f}
                </li>
              ))}
            </ul>

            <a
              href="#waitlist"
              className="magnetic mt-8 block rounded-full bg-gradient-to-r from-ocean to-forest py-3.5 text-center font-semibold text-ivory transition hover:scale-[1.02]"
            >
              {annual ? "Start Free Trial — $86.28/yr" : "Start Free Trial"}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
