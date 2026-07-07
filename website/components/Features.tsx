import { features } from "@/lib/content";
import Reveal from "./Reveal";

export default function Features() {
  return (
    <section id="features" className="bg-midnight py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal className="mb-14 text-center">
          <p className="label-kicker mb-4">One complete platform</p>
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold leading-tight tracking-tight text-ivory sm:text-5xl">
            Everything you need.
            <span className="italic text-gradient-gold"> Nothing you don&apos;t.</span>
          </h2>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.1}>
              <div className="h-full rounded-2xl border border-ivory/10 bg-charcoal/50 p-6">
                <p className="label-kicker mb-3">{f.kicker}</p>
                <h3 className="font-display text-xl font-bold text-ivory">
                  {f.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ivory/60">
                  {f.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
