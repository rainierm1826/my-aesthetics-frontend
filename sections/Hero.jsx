import { Tinos } from "next/font/google";

const tinos = Tinos({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export default function () {
  return (
    <section className="">
      <div className="grid grid-cols-2 h-[calc(100vh-60px)] place-items-center">
        <div
          className={`${tinos.className} flex flex-col justify-center items-start text-5xl font-bold`}
        >
          <h1 className="">Flawless Brows,</h1>
          <h1 className="text-[#BDA658]">Unmatched Confidence</h1>
        </div>

        {/* image */}
        <div></div>

        {/* bottom */}
        {/* <div className="h-[60px] bg-[#BDA658] w-full ">
          <h1>Personalized Beauty Experience</h1>
        </div> */}
      </div>
    </section>
  );
}
