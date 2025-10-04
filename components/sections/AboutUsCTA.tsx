"use client"

import { motion } from "framer-motion";
import { tinos } from "@/components/fonts/fonts";
import { Button } from "@/components/ui/button";

export function AboutUsCTA() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
    },
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-[#BDA658] to-[#d9c67a]">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="max-w-4xl mx-auto text-center"
      >
        <h2
          className={`${tinos.className} text-4xl md:text-5xl font-bold text-white mb-6`}
        >
          Ready to Transform Your Brows?
        </h2>
        <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
          Book your appointment today and let us bring out the best version of
          you. Experience the difference that professional care and artistry can
          make.
        </p>
        <Button
          size="lg"
          className="bg-white text-[#BDA658] hover:bg-white/90 font-semibold text-lg px-8 py-6"
        >
          Book Your Appointment
        </Button>
      </motion.div>
    </section>
  );
}
