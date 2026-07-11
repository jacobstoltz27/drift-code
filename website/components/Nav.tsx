"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Compass from "./Compass";

const links = [
  { href: "/features", label: "Features" },
  { href: "/explore", label: "Explore" },
  { href: "/peregrine", label: "Peregrine" },
  { href: "/pricing", label: "Pricing" },
];

const menuLinks = [
  ...links,
  { href: "/community", label: "Community" },
  { href: "/creators", label: "Creators" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Journal" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? "border-b border-ivory/5 bg-midnight/70 backdrop-blur-xl py-3"
          : "py-5"
      }`}
    >
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Compass className="h-7 w-7 text-golden" />
          <span className="font-display text-2xl font-semibold tracking-tight text-ivory">
            Drift
          </span>
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-ivory/10 bg-charcoal/40 px-2 py-1.5 font-display text-sm font-medium text-ivory/70 backdrop-blur-md md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-1.5 transition hover:bg-ivory/10 hover:text-ivory"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/waitlist"
            className="magnetic hidden rounded-full bg-golden px-5 py-2 text-sm font-semibold text-midnight transition hover:scale-105 sm:block"
          >
            Get Early Access
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/15 text-ivory md:hidden"
          >
            <span className="relative block h-3.5 w-[18px]">
              <span
                className={`absolute left-0 top-0 block h-0.5 w-[18px] rounded bg-current transition-transform duration-300 ${
                  open ? "translate-y-[6px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[6px] block h-0.5 w-[18px] rounded bg-current transition-opacity duration-300 ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[12px] block h-0.5 w-[18px] rounded bg-current transition-transform duration-300 ${
                  open ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            className="overflow-hidden border-t border-ivory/5 bg-midnight/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-6">
              {menuLinks.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.3 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-3 font-display text-2xl font-semibold text-ivory/85 transition hover:bg-ivory/5 hover:text-ivory"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/waitlist"
                onClick={() => setOpen(false)}
                className="mt-4 rounded-full bg-golden px-6 py-3.5 text-center font-semibold text-midnight"
              >
                Get Early Access
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
