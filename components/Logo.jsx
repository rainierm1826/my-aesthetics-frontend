import { Tinos } from "next/font/google";
import Link from "next/link";

const tinos = Tinos({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export default function Logo() {
  return (
    <Link href="/">
      <h1
        className={`${tinos.className} text-2xl font-bold text-[#BDA658] flex items-center`}
      >
        MY <span className="text-sm">Aesthetics</span>
      </h1>
    </Link>
  );
}
