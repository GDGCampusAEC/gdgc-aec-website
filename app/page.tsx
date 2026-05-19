"use client";

import HeroSection from "@/app/components/HeroSection";
import AboutSection from "@/app/components/AboutSection";

export default function Home() {
  return (
    <main className="relative w-full min-h-screen bg-[#FFFDF5] overflow-x-hidden font-sans">
      <HeroSection />
      <div className="relative z-[80] bg-white">
        <AboutSection />
      </div>
    </main>
  );
}