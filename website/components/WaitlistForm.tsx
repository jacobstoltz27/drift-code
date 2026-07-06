"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WaitlistForm({
  vibe,
  variant = "default",
}: {
  vibe?: string;
  variant?: "default" | "compact";
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, vibe }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
        return;
      }
      setStatus("done");
      setMessage(data.message || "You're on the list.");
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  return (
    <div className="w-full max-w-md">
      <AnimatePresence mode="wait">
        {status === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl px-6 py-5 text-center"
          >
            <p className="font-display text-xl text-golden">{message}</p>
            <p className="mt-1 text-sm text-ivory/60">
              Keep an eye on your inbox.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex w-full gap-2 ${
              variant === "compact" ? "flex-row" : "flex-col sm:flex-row"
            }`}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@drift.com"
              className="flex-1 rounded-full border border-ivory/15 bg-charcoal/70 px-5 py-3 text-ivory placeholder:text-ivory/35 outline-none transition focus:border-golden/60 focus:ring-2 focus:ring-golden/20"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="magnetic group relative overflow-hidden rounded-full bg-golden px-6 py-3 font-semibold text-midnight transition hover:scale-[1.03] disabled:opacity-60"
            >
              {status === "loading" ? "Joining…" : "Get Early Access"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
      {status === "error" && (
        <p className="mt-2 px-1 text-sm text-golden/90">{message}</p>
      )}
    </div>
  );
}
