"use client";

import AboutSection from "@/app/components/AboutSection";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import TeamTrainSection from "./TeamTrainSection";

export default function HomeHero() {
  const { scrollY } = useScroll();

  const sunY = useTransform(scrollY, [0, 500], [0, 150]);
  const backCloudsY = useTransform(scrollY, [0, 500], [0, -50]);
  const birdX = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <>
      <main className="relative w-full min-h-screen bg-[#FDFBF7] overflow-x-hidden">
        <section
          id="home"
          className="relative min-h-screen flex flex-col items-center justify-start pt-40 md:pt-48 px-4 text-center"
        >
          <div className="z-20 flex flex-col items-center relative">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              <span className="text-[#0f9d58] block mb-2">
                Developer's Group OnCampus
              </span>
              <span className="text-[#0f9d58] block">
                Asansol Engineering College
              </span>
            </h1>

            <p className="mt-4 text-gray-600 max-w-lg text-sm md:text-base font-medium">
              Learn. Build. Collaborate. Join a community of passionate developers and create impact together.
            </p>

            <div className="flex gap-4 mt-8">
              <Link
                href="#join"
                className="bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg"
              >
                Join GDG <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="#events"
                className="bg-transparent border-2 border-gray-900 text-gray-900 px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
              >
                Upcoming Event
              </Link>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-[60vh] md:h-[70vh] pointer-events-none z-10 flex justify-center overflow-hidden">
            <motion.div
              style={{ y: sunY }}
              className="absolute bottom-0 z-10 w-[300px] h-[150px] md:w-[600px] md:h-[300px]"
            >
              <div className="w-full h-full bg-gradient-to-t from-[#f4b400] to-[#ff6d00] rounded-t-full drop-shadow-xl" />
            </motion.div>

            <motion.div
              style={{ x: birdX }}
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-10 left-[15%] md:left-[25%] z-20 w-20 md:w-32"
            >
              <img
                src="/balloon.svg"
                alt="Yellow Bird"
                className="w-full h-auto object-contain"
              />
            </motion.div>

            <motion.div
              style={{ y: backCloudsY }}
              className="absolute -bottom-10 w-[120%] z-20 flex justify-center drop-shadow-xl"
            >
              <img
                src="/cloud-blue-1.svg"
                alt="Blue Clouds"
                className="w-full h-auto object-cover md:object-contain min-w-[1000px]"
              />
            </motion.div>

            <div className="absolute -bottom-5 w-[110%] z-30 flex justify-center drop-shadow-2xl">
              <img
                src="/cloud-white-1.svg"
                alt="White Clouds"
                className="w-full h-auto object-cover md:object-contain min-w-[1000px]"
              />
            </div>
          </div>
        </section>

        <AboutSection />
        <TeamTrainSection />
      </main>
    </>
  );
}