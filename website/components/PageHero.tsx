import Reveal from "./Reveal";

// Shared editorial header for inner pages. Title accepts nodes so pages can
// use the italic gold-gradient emphasis treatment from the homepage.
export default function PageHero({
  kicker,
  title,
  sub,
  children,
  align = "center",
}: {
  kicker: string;
  title: React.ReactNode;
  sub?: string;
  children?: React.ReactNode;
  align?: "center" | "left";
}) {
  const centered = align === "center";
  return (
    <section className="relative overflow-hidden bg-midnight pb-16 pt-40 sm:pb-20 sm:pt-48">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-forest/25 blur-[160px]" />
      <div
        className={`relative mx-auto max-w-5xl px-6 ${
          centered ? "text-center" : ""
        }`}
      >
        <Reveal>
          <p className="label-kicker mb-5">{kicker}</p>
          <h1
            className={`font-display text-5xl font-bold leading-[1.02] tracking-tight text-ivory sm:text-7xl ${
              centered ? "mx-auto max-w-4xl" : "max-w-4xl"
            }`}
          >
            {title}
          </h1>
          {sub && (
            <p
              className={`mt-7 max-w-2xl text-lg leading-relaxed text-ivory/65 sm:text-xl ${
                centered ? "mx-auto" : ""
              }`}
            >
              {sub}
            </p>
          )}
        </Reveal>
        {children && (
          <Reveal
            delay={0.15}
            className={`mt-10 ${centered ? "flex justify-center" : ""}`}
          >
            {children}
          </Reveal>
        )}
      </div>
    </section>
  );
}
