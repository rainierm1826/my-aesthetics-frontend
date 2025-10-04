"use client";

import { motion } from "framer-motion";
import { tinos } from "@/components/fonts/fonts";
import { Heart } from "lucide-react";

export function AboutUsTestimonial() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
    },
  };

  return (
    <section className="py-20 px-4 bg-[#BDA658]/5">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="max-w-4xl mx-auto text-center"
      >
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-[#BDA658]/10 rounded-full flex items-center justify-center">
            <Heart className="w-10 h-10 text-[#BDA658] fill-[#BDA658]" />
          </div>
          <blockquote
            className={`${tinos.className} text-2xl md:text-3xl text-[#BDA658] mb-4 italic`}
          >
            &quot;The best brow experience I&apos;ve ever had! My brows look
            effortlessly natural and I keep getting compliments. I&apos;ll never
            go anywhere else!&quot;
          </blockquote>
          <p className="text-[#7C7C7C] font-semibold">
            — Sarah M., Loyal Client
          </p>
        </div>
      </motion.div>
    </section>
  );
}
