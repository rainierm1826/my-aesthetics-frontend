import Hero from "@/components/sections/Hero";
import Service from "@/components/sections/Service";
import Aesthetician from "@/components/sections/Aesthetician";
import Branch from "@/components/sections/Branch";

export default function Home() {
  return (
    <div className="container mx-auto">
      <Hero />
      <Service />
      <Aesthetician />
      <Branch />
    </div>
  );
}
