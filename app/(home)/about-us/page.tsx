import { tinos, inter } from "@/components/fonts/fonts";
import Image from "next/image";
import { AboutUsCTA } from "@/components/sections/AboutUsCTA";
import { AboutUsTimeline } from "@/components/sections/AboutUsTimeline";
import { AboutUsTestimonial } from "@/components/sections/AboutUsTestimonial";
import { AboutUsCard } from "@/components/cards/AboutUsCard";
import { AboutUsHero } from "@/components/sections/AboutUsHero";
import { AnimatedAboutUs } from "@/components/sections/AnimatedAboutUs";

export default function AboutUsPage() {
  const values = [
    {
      icon: "Sparkles",
      title: "Precision",
      description:
        "Every stroke is carefully crafted to enhance your natural beauty",
    },
    {
      icon: "Heart",
      title: "Care",
      description: "Your comfort and satisfaction are our top priorities",
    },
    {
      icon: "Award",
      title: "Excellence",
      description: "Certified expertise with years of professional experience",
    },
    {
      icon: "Users",
      title: "Community",
      description: "Building lasting relationships with our valued clients",
    },
  ] as const;

  const timeline = [
    {
      year: "2020",
      description:
        "Founded with a vision to transform the brow beauty industry",
    },
    {
      year: "2022",
      description:
        "Expanded services and welcomed over 10,000 satisfied clients",
    },
    {
      year: "2025",
      description:
        "Continuing to innovate with the latest techniques and training",
    },
  ];

  return (
    <div className={`${inter.className} bg-[#fffcf9]`}>
      {/* Hero Section */}
      <AboutUsHero />

      {/* Mission Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <AnimatedAboutUs>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className={`${tinos.className} text-4xl md:text-5xl font-bold text-[#BDA658] mb-6`}
              >
                Our Mission
              </h2>
              <p className="text-[#7C7C7C] text-lg leading-relaxed mb-4">
                At MY Aesthetics Brow Studio, we believe that brows frame the face
                and boost confidence. Our mission is to bring out your natural
                beauty with precision and care, creating brows that enhance your
                unique features.
              </p>
              <p className="text-[#7C7C7C] text-lg leading-relaxed">
                Founded by a certified brow artist with over 6 years of
                experience, our studio is dedicated to providing personalized
                beauty experiences that leave you feeling confident and radiant.
              </p>
            </div>
            <div className="relative h-[400px] bg-gradient-to-br from-[#BDA658]/10 to-[#BDA658]/5 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-[#BDA658]/30 text-xl font-semibold">
                [Founder Photo Placeholder]
              </div>
            </div>
          </div>
        </AnimatedAboutUs>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#fffcf9] to-[#BDA658]/5">
        <AnimatedAboutUs>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className={`${tinos.className} text-4xl md:text-5xl font-bold text-[#BDA658] mb-6`}
              >
                Our Approach
              </h2>
              <p className="text-[#7C7C7C] text-lg max-w-3xl mx-auto">
                We specialize in creating brows that enhance your unique
                features, blending artistry with the latest beauty techniques.
                Every treatment is tailored to your individual needs and desired
                look.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <AboutUsCard key={index} value={value} index={index} />
              ))}
            </div>
          </div>
        </AnimatedAboutUs>
      </section>

      {/* Studio Environment */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <AnimatedAboutUs>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] bg-gradient-to-br from-[#BDA658]/10 to-[#BDA658]/5 rounded-2xl overflow-hidden order-2 md:order-1">
              <div className="absolute inset-0 flex items-center justify-center text-[#BDA658]/30 text-xl font-semibold">
                <Image
                  src="/studioImage.png"
                  alt="studio"
                  fill
                  className="object-fill"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2
                className={`${tinos.className} text-4xl md:text-5xl font-bold text-[#BDA658] mb-6`}
              >
                The Studio Experience
              </h2>
              <p className="text-[#7C7C7C] text-lg leading-relaxed mb-4">
                Our studio is designed to make you feel at ease the moment you
                walk in. From calming interiors and relaxing music to
                professional care and attention to detail, every element is
                curated for your comfort.
              </p>
              <p className="text-[#7C7C7C] text-lg leading-relaxed">
                We use only premium products and the latest techniques to ensure
                the best results while maintaining a warm, welcoming atmosphere
                that feels like a sanctuary.
              </p>
            </div>
          </div>
        </AnimatedAboutUs>
      </section>

      {/* Testimonial Section */}
      <AboutUsTestimonial />

      {/* Timeline */}
      <AboutUsTimeline timeline={timeline} />

      {/* CTA Section */}
      <AboutUsCTA />
    </div>
  );
}
