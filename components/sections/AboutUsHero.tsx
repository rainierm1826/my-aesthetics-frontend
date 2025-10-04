"use client"

import { motion } from "framer-motion";
import { tinos } from "@/components/fonts/fonts";

export function AboutUsHero() {
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
    },
  };

  return (
    <section className="relative h-[60vh] flex items-center justify-center bg-gradient-to-br from-[#BDA658]/20 to-[#fffcf9] overflow-hidden">
      <motion.div
        className="absolute inset-0 opacity-10"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.2 }}
      />
      <motion.div
        className="relative z-10 text-center px-4"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.h1
          className={`${tinos.className} text-5xl md:text-7xl font-bold text-[#BDA658] mb-4`}
          variants={fadeInUp}
        >
          Our Story
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-[#7C7C7C] max-w-2xl mx-auto"
          variants={fadeInUp}
        >
          Where artistry meets precision, and confidence is crafted one brow at
          a time
        </motion.p>
      </motion.div>
    </section>
  );
}