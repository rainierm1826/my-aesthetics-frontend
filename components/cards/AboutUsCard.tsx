"use client";

import { motion } from "framer-motion";
import { tinos } from "@/components/fonts/fonts";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Heart, Award, Users } from "lucide-react";

const icons = { Sparkles, Heart, Award, Users };

interface Value {
  icon: keyof typeof icons; // "Sparkles" | "Heart" | "Award" | "Users"
  title: string;
  description: string;
}

export function AboutUsCard({ value, index }: { value: Value; index: number }) {
  const Icon = icons[value.icon]; // resolve string → actual component

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1] as const,
        delay: index * 0.1,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeInUp}
    >
      <Card className="border-[#BDA658]/20 hover:border-[#BDA658]/40 transition-colors h-full">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#BDA658]/10 rounded-full flex items-center justify-center">
            <Icon className="w-8 h-8 text-[#BDA658]" />
          </div>
          <h3
            className={`${tinos.className} text-xl font-bold text-[#BDA658] mb-2`}
          >
            {value.title}
          </h3>
          <p className="text-[#7C7C7C] text-sm">{value.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
