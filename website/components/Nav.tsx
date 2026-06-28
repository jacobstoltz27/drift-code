"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Compass from "./Compass";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-ivory/5 bg-midnight/70 backdrop-blur-xl py-3"
          : "py-5"
      }`}
    >
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2">
          <Compass className="h-7 w-7 text-golden" />
          <span className="font-display text-2xl font-semibold tracking-tight text-ivory">
            Drift
          </span>
        </a>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-ivory/10 bg-charcoal/40 px-2 py-1.5 text-sm text-ivory/70 backdrop-blur-md md:flex">
          <a href="#features" className="rounded-full px-4 py-1.5 transition hover:bg-ivory/10 hover:text-ivory">Features</a>
          <a href="#vibe" className="rounded-full px-4 py-1.5 transition hover:bg-ivory/10 hover:text-ivory">Your Vibe</a>
          <a href="#pricing" className="rounded-full px-4 py-1.5 transition hover:bg-ivory/10 hover:text-ivory">Pricing</a>
        </div>

        <a
          href="#waitlist"
          className="magnetic rounded-full bg-golden px-5 py-2 text-sm font-semibold text-midnight transition hover:scale-105"
        >
          Get Early Access
        </a>
      </nav>
    </motion.header>
  );
}
