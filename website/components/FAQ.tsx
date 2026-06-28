"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faqs } from "@/lib/content";
import Reveal from "./Reveal";

function Item({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: i * 0.06 }}
      className="border-b border-ivory/10"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-6 text-left"
      >
        <span className="font-display text-xl text-ivory">{q}</span>
        <span
          className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-golden/40 text-golden transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-6 pr-10 text-ivory/60">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <section className="bg-midnight py-28 sm:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="mb-12 text-center">
          <p className="label-kicker mb-4">Before you ask</p>
          <h2 className="font-display text-4xl font-light tracking-tight text-ivory sm:text-5xl">
            Questions, answered.
          </h2>
        </Reveal>
        <div>
          {faqs.map((f, i) => (
            <Item key={f.q} q={f.q} a={f.a} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
