"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef, type ElementType, type ReactNode, type RefObject } from "react";

// Reveals its children (using the supplied variants) once the shared
// `timelineRef` region scrolls into view. `animationNum` feeds `custom` so
// each item can stagger its own delay.
export function TimelineContent({
  children,
  animationNum,
  timelineRef,
  customVariants,
  as = "div",
  className,
  ...props
}: {
  children: ReactNode;
  animationNum: number;
  timelineRef: RefObject<HTMLElement>;
  customVariants: Variants;
  as?: ElementType;
  className?: string;
  [key: string]: unknown;
}) {
  const fallbackRef = useRef<HTMLElement>(null);
  const ref = timelineRef ?? fallbackRef;
  const inView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });

  const MotionComp = motion[as as keyof typeof motion] as ElementType;

  return (
    <MotionComp
      custom={animationNum}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={customVariants}
      className={className}
      {...props}
    >
      {children}
    </MotionComp>
  );
}
