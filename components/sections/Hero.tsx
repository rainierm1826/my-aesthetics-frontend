"use client";

import React from "react";
import { motion } from "framer-motion";
import SignUpButton from "../buttons/SignUpButton";
import BookNowButton from "../buttons/BookNowButton";
import { tinos } from "../fonts/fonts";
import { useAuthStore } from "@/provider/store/authStore";
import Image from "next/image";

const Hero = () => {
  const { isAuth } = useAuthStore();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9, x: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.6,
      },
    },
  };

  const bannerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.8,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  return (
    <section className="h-[calc(100vh-60px-50px)] bg-[#fffcf9]">
      <div className="relative grid grid-cols-1 md:grid-cols-2 place-content-center h-full px-4">
        {/* Main text */}
        <motion.div
          className="flex flex-col justify-center w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h3
            className={`${tinos.className} text-3xl md:text-5xl font-bold text-center md:text-left`}
            variants={textVariants}
          >
            Flawless Brows,
          </motion.h3>
          <motion.h3
            className={`${tinos.className} text-3xl md:text-5xl font-bold text-[#BDA658] text-center md:text-left`}
            variants={textVariants}
          >
            Unmatched Confidence
          </motion.h3>
          <motion.p
            className="text-[#7C7C7C] text-center text-xs md:text-base md:text-left"
            variants={textVariants}
          >
            Enhance your natural beauty with expert brow styling <br /> and
            precision treatments.
          </motion.p>
          {!isAuth && (
            <motion.div
              className="flex gap-3 mt-5 justify-center md:justify-start"
              variants={buttonVariants}
            >
              <SignUpButton />
              <BookNowButton size="" />
            </motion.div>
          )}
        </motion.div>

        {/* Image */}
        <motion.div
          className="hidden md:block absolute bottom-0 right-0 w-1/2 h-[calc(100vh-60px-50px)]"
          variants={imageVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Decorative background circle */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-[#BDA658]/10 to-[#BDA658]/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              ease: "easeInOut",
            }}
          />

          {/* Main image full size */}
          <Image
            src="/heroImage.png"
            alt="Professional brow styling service"
            fill
            className="object-bottom object-contain h-full"
            priority
          />
        </motion.div>
      </div>

      {/* Bottom banner */}
      <motion.div
        className="bg-[#BDA658] h-[50px] flex items-center"
        variants={bannerVariants}
        initial="hidden"
        animate="visible"
      >
        <p
          className={`${tinos.className} text-white font-bold py-3 px-4 text-xs md:text-base`}
        >
          A Personalized Beauty Experience, Crafted Around Your Perfect Brows
        </p>
      </motion.div>
    </section>
  );
};

export default Hero;
