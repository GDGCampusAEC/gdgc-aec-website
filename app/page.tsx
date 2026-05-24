"use client";

import HeroSection from "@/app/components/HeroSection";
import AboutSection from "@/app/components/AboutSection";
import TeamTrainSection from "@/app/components/TeamTrainSection";
import GallerySection from "@/app/components/GallerySection";

export default function Home() {
  return (
    <main className="relative w-full min-h-screen bg-[#FFFDF5] overflow-x-clip font-sans">

      <section id="home">
        <HeroSection />
      </section>

      <section
        id="about"
        className="relative z-[80]"
      >
        <AboutSection />
      </section>

      <section id="gallery" className="relative">
        <GallerySection />
      </section>

      <section id="teams">
        <TeamTrainSection homepageMode />
      </section>
    </main>
  );
}