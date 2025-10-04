"use client";

import { motion } from "framer-motion";
import { tinos } from "@/components/fonts/fonts";

interface TimelineItem {
  year: string;
  description: string;
}

export function AboutUsTimeline({ timeline }: { timeline: TimelineItem[] }) {
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
    <section className="py-20 px-4 max-w-4xl mx-auto">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="text-center"
      >
        <motion.h2
          variants={fadeInUp}
          className={`${tinos.className} text-4xl md:text-5xl font-bold text-[#BDA658] mb-12`}
        >
          Our Journey
        </motion.h2>
        <motion.div variants={fadeInUp} className="space-y-8">
          {timeline.map((item, index) => (
            <div
              key={index}
              className="border-l-4 border-[#BDA658] pl-6 text-left"
            >
              <h3
                className={`${tinos.className} text-2xl font-bold text-[#BDA658] mb-2`}
              >
                {item.year}
              </h3>
              <p className="text-[#7C7C7C]">{item.description}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
