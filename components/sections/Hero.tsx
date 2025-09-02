"use client";

import React from "react";
import SignUpButton from "../buttons/SignUpButton";
import BookNowButton from "../buttons/BookNowButton";
import { tinos } from "../fonts/fonts";
import { useAuthStore } from "@/provider/store/authStore";

const Hero = () => {
  const { isAuth } = useAuthStore();

  return (
    <section className="h-[calc(100vh-60px-50px)] bg-[#fffcf9]">
      <div className="grid grid-cols-1  md:grid-cols-2 place-content-center h-full px-4">
        {/*  main text*/}
        <div className="flex flex-col justify-center w-full">
          <h3
            className={`${tinos.className} text-3xl md:text-5xl font-bold text-center md:text-left`}
          >
            Flawless Brows,
          </h3>
          <h3
            className={`${tinos.className} text-3xl md:text-5xl font-bold text-[#BDA658] text-center md:text-left`}
          >
            Unmatched Confidence
          </h3>
          <p className="text-[#7C7C7C] text-center text-xs md:text-base md:text-left">
            Enhance your natural beauty with expert brow styling <br /> and
            precision treatments.
          </p>
          {!isAuth && (
            <div className="flex gap-3 mt-5 justify-center md:justify-start">
              <SignUpButton />
              <BookNowButton size="" />
            </div>
          )}
        </div>

        {/* image */}
        <div></div>
      </div>
      {/* bottom design */}
      <div className="bg-[#BDA658] h-[50px] flex items-center">
        <p
          className={`${tinos.className} text-white font-bold py-3 px-4 text-xs md:text-base`}
        >
          A Personalized Beauty Experience, Crafted Around Your Perfect Brows
        </p>
      </div>
    </section>
  );
};

export default Hero;
