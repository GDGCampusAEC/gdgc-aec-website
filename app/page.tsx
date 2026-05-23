"use client";

import HeroSection from "@/app/components/HeroSection";
import AboutSection from "@/app/components/AboutSection";
import TeamTrainSection from "@/app/components/TeamTrainSection";

export default function Home() {
  return (
    <main className="relative w-full min-h-screen bg-[#FFFDF5] overflow-x-hidden font-sans">

      <section id="home">
        <HeroSection />
      </section>

      <section
        id="about"
        className="relative z-[80] bg-white"
      >
        <AboutSection />
      </section>

      <section id="teams">
        <TeamTrainSection compact homepageMode />
      </section>

  {/* View Full Team Button */}
  {/* <div className="absolute top-10 right-10 z-[100]">
    <a
      href="/teams"
      className="bg-black/80 backdrop-blur-md text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-black transition-all shadow-xl border border-white/10"
    >
      View Full Team →
    </a>
  </div> */}

    </main>
  );
}