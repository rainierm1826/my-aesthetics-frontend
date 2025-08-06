import BookNowButton from "@/components/BookNowButton";
import SignUpButton from "@/components/SignUpButton";
import { Tinos } from "next/font/google";

const tinos = Tinos({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div className="h-[calc(100vh-60px-50px)]">
      <div className="grid grid-cols-2 place-content-center h-full px-4">
        {/*  main text*/}
        <div className="flex flex-col justify-center">
          <h3 className={`${tinos.className} text-5xl font-bold`}>
            Flawless Brows,
          </h3>
          <h3
            className={`${tinos.className} text-5xl font-bold text-[#BDA658]`}
          >
            Unmatched Confidence
          </h3>
          <p className="text-[#7C7C7C]">
            Enhance your natural beauty with expert brow styling <br /> and
            precision treatments.
          </p>
          <div className="flex gap-3 mt-5">
            <SignUpButton />
            <BookNowButton />
          </div>
        </div>

        {/* image */}
        <div></div>
      </div>
      {/* bottom design */}
      <div className="bg-[#BDA658] h-[50px] flex items-center">
        <p className={`${tinos.className} text-white font-bold py-3 px-4`}>
          A Personalized Beauty Experience, Crafted Around Your Perfect Brows
        </p>
      </div>
    </div>
  );
}
