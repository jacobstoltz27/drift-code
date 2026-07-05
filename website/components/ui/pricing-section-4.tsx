"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sparkles } from "@/components/ui/sparkles";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

const plans = [
  {
    name: "Free",
    description:
      "Everything you need to start exploring. Unlock more by inviting friends.",
    price: 0,
    yearlyPrice: 0,
    buttonText: "Get started free",
    buttonVariant: "outline" as const,
    includes: [
      "Free includes:",
      "Social feed & discovery",
      "Browse any community trip",
      "AI planner (2 trips)",
      "Steal itineraries — invite 1 friend",
      "World Travel Map — invite 3 friends",
      "Group planning — invite 5 friends",
    ],
  },
  {
    name: "Pro",
    description:
      "Unlimited planning and every feature, no invites required.",
    price: 8.99,
    yearlyPrice: 71.88, // 33% off vs paying monthly ($5.99/mo)
    buttonText: "Start free trial",
    buttonVariant: "default" as const,
    popular: true,
    includes: [
      "Everything in Free, plus:",
      "Unlimited AI trip generation",
      "Full Trip Score with AI insights",
      "World Travel Map (no invites)",
      "Group planning for any size",
      "Price alerts & best time to go",
      "Verified local Guides",
      "Offline itineraries & priority support",
    ],
  },
];

const PricingSwitch = ({ onSwitch }: { onSwitch: (value: string) => void }) => {
  const [selected, setSelected] = useState("0");

  const handleSwitch = (value: string) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div className="flex justify-center">
      <div className="relative z-10 mx-auto flex w-fit rounded-full border border-ivory/15 bg-charcoal/70 p-1">
        <button
          onClick={() => handleSwitch("0")}
          className={cn(
            "relative z-10 h-10 w-fit rounded-full px-6 py-2 font-medium transition-colors",
            selected === "0" ? "text-midnight" : "text-ivory/70"
          )}
        >
          {selected === "0" && (
            <motion.span
              layoutId="switch"
              className="absolute left-0 top-0 h-10 w-full rounded-full bg-golden shadow-sm shadow-golden/40"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative">Monthly</span>
        </button>

        <button
          onClick={() => handleSwitch("1")}
          className={cn(
            "relative z-10 flex h-10 w-fit flex-shrink-0 items-center gap-2 rounded-full px-6 py-2 font-medium transition-colors",
            selected === "1" ? "text-midnight" : "text-ivory/70"
          )}
        >
          {selected === "1" && (
            <motion.span
              layoutId="switch"
              className="absolute left-0 top-0 h-10 w-full rounded-full bg-golden shadow-sm shadow-golden/40"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative flex items-center gap-2">
            Yearly
            <span className="relative rounded-full bg-forest px-2 py-0.5 text-[10px] font-bold text-ivory">
              -33%
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { delay: i * 0.25, duration: 0.5 },
    }),
    hidden: { filter: "blur(10px)", y: -20, opacity: 0 },
  };

  const togglePricingPeriod = (value: string) =>
    setIsYearly(Number.parseInt(value) === 1);

  return (
    <section
      id="pricing"
      className="relative mx-auto overflow-x-hidden bg-midnight pb-24"
      ref={pricingRef}
    >
      <TimelineContent
        animationNum={4}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="absolute top-0 h-96 w-full overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff18_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:70px_80px]" />
        <Sparkles
          density={500}
          direction="bottom"
          speed={1}
          color="#AFD2FA"
          className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
        />
      </TimelineContent>

      <TimelineContent
        animationNum={5}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="pointer-events-none absolute left-0 top-[-140px] z-0 flex h-[70vh] w-full flex-col items-start justify-start overflow-hidden p-0"
      >
        <div className="relative w-full">
          <div
            className="absolute left-[-568px] right-[-568px] top-0 h-[1400px] flex-none rounded-full"
            style={{
              border: "200px solid #24356B",
              filter: "blur(92px)",
              WebkitFilter: "blur(92px)",
            }}
          />
        </div>
      </TimelineContent>

      <article className="relative z-50 mx-auto mb-6 max-w-3xl space-y-3 pt-28 text-center">
        <h2 className="font-display text-4xl font-bold text-ivory sm:text-5xl">
          <VerticalCutReveal
            splitBy="words"
            staggerDuration={0.12}
            staggerFrom="first"
            reverse
            containerClassName="justify-center"
            transition={{ type: "spring", stiffness: 250, damping: 40, delay: 0 }}
          >
            Choose your journey.
          </VerticalCutReveal>
        </h2>

        <TimelineContent
          as="p"
          animationNum={0}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="mx-auto max-w-md text-ivory/60"
        >
          Grow features for free by inviting friends, or go Pro for unlimited
          everything. Yearly saves you 33%.
        </TimelineContent>

        <TimelineContent
          as="div"
          animationNum={1}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="pt-2"
        >
          <PricingSwitch onSwitch={togglePricingPeriod} />
        </TimelineContent>
      </article>

      <div
        className="absolute left-[10%] right-[10%] top-0 z-0 h-full w-[80%]"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, #2F5E8E 0%, transparent 70%)",
          opacity: 0.35,
        }}
      />

      <div className="relative z-10 mx-auto grid max-w-4xl gap-5 py-6 md:grid-cols-2">
        {plans.map((plan, index) => (
          <TimelineContent
            key={plan.name}
            as="div"
            animationNum={2 + index}
            timelineRef={pricingRef}
            customVariants={revealVariants}
          >
            <Card
              className={cn(
                "relative h-full border-ivory/10 bg-gradient-to-b from-charcoal to-midnight text-ivory",
                plan.popular
                  ? "z-20 border-golden/30 shadow-[0px_-13px_200px_0px_#2F5E8E]"
                  : "z-10"
              )}
            >
              <CardHeader className="text-left">
                <div className="flex items-center justify-between">
                  <h3 className="mb-2 font-display text-3xl font-bold">
                    {plan.name}
                  </h3>
                  {plan.popular && (
                    <span className="rounded-full bg-ocean px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-midnight">
                      Most popular
                    </span>
                  )}
                </div>
                <div className="flex items-baseline">
                  <span className="font-display text-4xl font-bold">$</span>
                  <NumberFlow
                    format={{ maximumFractionDigits: 2 }}
                    value={isYearly ? plan.yearlyPrice : plan.price}
                    className="font-display text-4xl font-bold"
                  />
                  <span className="ml-1 text-ivory/50">
                    /{isYearly ? "year" : "month"}
                  </span>
                </div>
                {plan.popular && (
                  <p className="text-sm text-forest">
                    {isYearly
                      ? "Just $5.99/mo, billed yearly"
                      : "Or $71.88/year — save 33%"}
                  </p>
                )}
                <p className="mb-4 mt-1 text-sm text-ivory/60">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="pt-0">
                <a
                  href="#waitlist"
                  className={cn(
                    "magnetic mb-6 block rounded-xl p-4 text-center text-lg font-semibold transition hover:scale-[1.02]",
                    plan.popular
                      ? "bg-golden text-midnight shadow-lg shadow-golden/20"
                      : "border border-ivory/15 bg-charcoal text-ivory"
                  )}
                >
                  {plan.buttonText}
                </a>

                <div className="space-y-3 border-t border-ivory/10 pt-4">
                  <h4 className="mb-3 text-xs font-bold uppercase tracking-label text-golden/80">
                    {plan.includes[0]}
                  </h4>
                  <ul className="space-y-2.5">
                    {plan.includes.slice(1).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2.5">
                        <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-ocean" />
                        <span className="text-sm text-ivory/75">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TimelineContent>
        ))}
      </div>
    </section>
  );
}
