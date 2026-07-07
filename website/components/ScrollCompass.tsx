"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Compass from "./Compass";

// Easter egg: a compass fixed in the corner whose needle rotates as you
// travel down the page, like you're always finding your bearing.
export default function ScrollCompass() {
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 540]);
  const smooth = useSpring(rotate, { stiffness: 60, damping: 20 });
  const opacity = useTransform(scrollYProgress, [0, 0.06, 0.95, 1], [0, 0.6, 0.6, 0]);

  return (
    <motion.div
      style={{ opacity }}
      className="pointer-events-none fixed bottom-6 right-6 z-40 hidden md:block"
    >
      <motion.div style={{ rotate: smooth }}>
        <Compass className="h-10 w-10 text-golden/70" />
      </motion.div>
    </motion.div>
  );
}
