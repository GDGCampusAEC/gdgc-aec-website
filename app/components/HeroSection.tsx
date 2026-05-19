"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const ConcentricSun = ({ className }: { className?: string }) => (
  <div className={`flex justify-center ${className}`}>
    <div className="w-full aspect-square bg-[#f26522] rounded-full flex items-center justify-center">
      <div className="w-[78%] aspect-square bg-[#f7931e] rounded-full flex items-center justify-center">
        <div className="w-[68%] aspect-square bg-[#fbb03b] rounded-full"></div>
      </div>
    </div>
  </div>
);

const TopCloudsLeft = () => (
  <div className="absolute top-[-95px] left-[-110px] w-[340px] sm:w-[430px] md:w-[520px] z-30 drop-shadow-[0_12px_16px_rgba(0,0,0,0.08)] pointer-events-none">
    <svg
      viewBox="0 0 500 360"
      fill="#a8c7fa"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
    >
      <circle cx="20" cy="70" r="120" />
      <circle cx="135" cy="45" r="105" />
      <circle cx="250" cy="70" r="95" />
      <circle cx="80" cy="165" r="115" />
      <circle cx="210" cy="170" r="100" />
      <circle cx="340" cy="135" r="85" />
      <circle cx="430" cy="105" r="70" />
    </svg>
  </div>
);

const TopCloudsRight = () => (
  <div className="absolute top-[-90px] right-[-120px] w-[340px] sm:w-[430px] md:w-[520px] z-30 drop-shadow-[0_12px_16px_rgba(0,0,0,0.08)] pointer-events-none">
    <svg
      viewBox="0 0 500 360"
      fill="#a8c7fa"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
    >
      <circle cx="480" cy="70" r="120" />
      <circle cx="365" cy="45" r="105" />
      <circle cx="250" cy="70" r="95" />
      <circle cx="420" cy="165" r="115" />
      <circle cx="290" cy="170" r="100" />
      <circle cx="160" cy="135" r="85" />
      <circle cx="70" cy="105" r="70" />
    </svg>
  </div>
);

const MiddleBlueClouds = () => (
  <div className="absolute bottom-[5%] sm:bottom-[4%] md:bottom-[2%] left-0 w-full z-40 pointer-events-none drop-shadow-[0_-10px_14px_rgba(0,0,0,0.08)]">
    <svg
      viewBox="0 0 1440 360"
      className="w-full h-auto text-[#6fa3f7]"
      preserveAspectRatio="none"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="0" cy="245" r="210" />
      <circle cx="135" cy="225" r="155" />
      <circle cx="285" cy="210" r="140" />
      <circle cx="430" cy="235" r="120" />
      <circle cx="555" cy="270" r="95" />
      <circle cx="645" cy="315" r="58" />
      <circle cx="720" cy="325" r="55" />
      <circle cx="795" cy="315" r="58" />
      <circle cx="885" cy="270" r="95" />
      <circle cx="1010" cy="235" r="120" />
      <circle cx="1155" cy="210" r="140" />
      <circle cx="1305" cy="225" r="155" />
      <circle cx="1440" cy="245" r="210" />
      <path d="
        M0 255
        C130 220 255 205 390 225
        C505 242 580 292 655 318
        C690 330 750 330 785 318
        C860 292 935 242 1050 225
        C1185 205 1310 220 1440 255
        L1440 360
        L0 360
        Z
      " />
    </svg>
  </div>
);

const BottomShadowClouds = () => (
  <div className="absolute bottom-[1%] left-0 w-full z-[45] pointer-events-none opacity-90 drop-shadow-[0_-8px_10px_rgba(0,0,0,0.08)]">
    <svg
      viewBox="0 0 1440 290"
      className="w-full h-auto text-[#f4f4f4]"
      preserveAspectRatio="none"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="0" cy="190" r="110" />
      <circle cx="135" cy="170" r="100" />
      <circle cx="280" cy="160" r="92" />
      <circle cx="425" cy="185" r="88" />
      <circle cx="560" cy="220" r="75" />
      <circle cx="665" cy="255" r="58" />
      <circle cx="735" cy="262" r="55" />
      <circle cx="805" cy="255" r="58" />
      <circle cx="940" cy="220" r="75" />
      <circle cx="1075" cy="185" r="88" />
      <circle cx="1220" cy="160" r="92" />
      <circle cx="1360" cy="170" r="100" />
      <circle cx="1440" cy="190" r="110" />
      <path d="
        M0 200
        C130 168 260 152 390 175
        C520 198 595 242 675 265
        C710 275 760 275 795 265
        C875 242 950 198 1080 175
        C1210 152 1340 168 1440 200
        L1440 290
        L0 290
        Z
      " />
      <rect x="0" y="250" width="1440" height="60" />
    </svg>
  </div>
);

const BottomWhiteClouds = () => (
  <div className="absolute bottom-[-12px] left-0 w-full z-50 pointer-events-none drop-shadow-[0_-14px_18px_rgba(0,0,0,0.08)]">
    <svg
      viewBox="0 0 1440 350"
      className="w-full h-auto text-white"
      preserveAspectRatio="none"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="0" cy="220" r="125" />
      <circle cx="110" cy="205" r="110" />
      <circle cx="230" cy="195" r="100" />
      <circle cx="360" cy="215" r="100" />
      <circle cx="485" cy="245" r="85" />
      <circle cx="620" cy="292" r="68" />
      <circle cx="705" cy="305" r="62" />
      <circle cx="790" cy="305" r="62" />
      <circle cx="875" cy="292" r="68" />
      <circle cx="1005" cy="245" r="85" />
      <circle cx="1130" cy="215" r="100" />
      <circle cx="1260" cy="195" r="100" />
      <circle cx="1370" cy="205" r="110" />
      <circle cx="1440" cy="220" r="125" />
      <path d="
        M0 230
        C125 198 250 185 380 208
        C505 230 585 280 660 302
        C700 315 795 315 835 302
        C910 280 990 230 1115 208
        C1245 185 1365 198 1440 230
        L1440 350
        L0 350
        Z
      " />
      <circle cx="70" cy="295" r="92" />
      <circle cx="215" cy="280" r="98" />
      <circle cx="370" cy="300" r="108" />
      <circle cx="535" cy="322" r="88" />
      <circle cx="905" cy="322" r="88" />
      <circle cx="1070" cy="300" r="108" />
      <circle cx="1225" cy="280" r="98" />
      <circle cx="1370" cy="295" r="92" />
      <rect x="0" y="305" width="1440" height="70" />
    </svg>
  </div>
);

export default function HeroSection() {
  const { scrollY } = useScroll();

  const textY = useTransform(scrollY, [0, 500], [0, 160]);
  const sunY = useTransform(scrollY, [0, 500], [0, 260]);
  const cloudsY = useTransform(scrollY, [0, 500], [0, 90]);

  const birdX = useTransform(scrollY, [0, 500], [0, 550]);
  const birdY = useTransform(scrollY, [0, 500], [0, -160]);

  return (
    <section
      id="home"
      className="relative w-full h-[100svh] overflow-hidden flex flex-col items-center pt-24 sm:pt-28 md:pt-36 lg:pt-40"
    >
      <motion.div
        style={{ y: textY }}
        className="relative z-[70] flex flex-col items-center text-center px-6"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#1e8e3e] leading-tight">
          Developer&apos;s Group OnCampus
          <br />
          Asansol Engineering College
        </h1>

        <div className="flex items-center gap-3 mt-5 mb-4">
          <div className="w-24 h-1.5 bg-[#fbb03b] rounded-full" />
          <div className="w-2 h-2 bg-[#fbb03b] rounded-full" />
          <div className="w-24 h-1.5 bg-[#fbb03b] rounded-full" />
        </div>

        <p className="text-gray-700 max-w-xl text-sm sm:text-base md:text-lg font-medium leading-relaxed mb-8">
          Learn. Build. Collaborate. Join a community of passionate developers
          and create impact together.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="#join"
            className="bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-3 hover:bg-gray-800 transition-all duration-300 hover:scale-105"
          >
            Join GDG
            <span className="bg-white text-gray-900 rounded-full p-0.5">
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <Link
            href="#events"
            className="bg-white/40 backdrop-blur-sm border border-gray-900 text-gray-900 px-6 py-3 rounded-full text-sm font-semibold hover:bg-white/70 transition-all duration-300 hover:scale-105"
          >
            Upcoming Event
          </Link>
        </div>
      </motion.div>

      <div className="absolute inset-0 pointer-events-none flex justify-center overflow-hidden">
        <TopCloudsLeft />
        <TopCloudsRight />

        <motion.div
          style={{ x: birdX, y: birdY }}
          className="absolute top-[34%] left-[8%] sm:left-[10%] md:left-[14%] z-[60] w-24 sm:w-32 md:w-44"
        >
          <img
            src="/gallery-1.gif"
            alt="Flapping Bird"
            className="w-full h-auto drop-shadow-xl"
          />
        </motion.div>

        <motion.div
          style={{ y: sunY, x: "-50%" }}
          className="absolute bottom-[0%] sm:bottom-[-2%] md:bottom-[-5%] left-[50%] z-20 w-[280px] sm:w-[380px] md:w-[500px]"
        >
          <ConcentricSun className="w-full" />
        </motion.div>

        <motion.div
          style={{ y: cloudsY }}
          className="absolute inset-x-0 bottom-0 z-40"
        >
          <MiddleBlueClouds />
        </motion.div>

        <motion.div
          style={{ y: cloudsY }}
          className="absolute inset-x-0 bottom-0 z-[45]"
        >
          <BottomShadowClouds />
        </motion.div>

        <BottomWhiteClouds />
      </div>
    </section>
  );
}
