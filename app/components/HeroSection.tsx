"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";
import { useState } from "react";

const ConcentricSun = ({ className }: { className?: string }) => (
  <div className={`flex justify-center ${className}`}>
    <div className="w-full aspect-square bg-[#f26522] rounded-full flex items-center justify-center">
      <div className="w-[78%] aspect-square bg-[#f7931e] rounded-full flex items-center justify-center">
        <div className="w-[68%] aspect-square bg-[#fbb03b] rounded-full"></div>
      </div>
    </div>
  </div>
);

// Google themed party popper confetti
const GoogleConfetti = () => {
  const colors = ["#4285F4", "#EA4335", "#FBBC04", "#34A853"];
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 pointer-events-none z-0">
      {[...Array(16)].map((_, i) => {
        const angle = (i * 22.5) * (Math.PI / 180);
        const distance = 60 + Math.random() * 60;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{ x, y, scale: [0, 1, 0.5], opacity: [1, 1, 0] }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute w-1.5 h-4 rounded-full"
            style={{
              backgroundColor: colors[i % 4],
              rotate: `${i * 22.5 + 90}deg`,
              transformOrigin: "center",
            }}
          />
        );
      })}
    </div>
  );
};

const TopCloudsLeft = () => (
  <motion.div
    initial={{ x: -220, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 1.8, ease: "easeOut" }}
    className="absolute top-[-95px] left-[-110px] w-[340px] sm:w-[430px] md:w-[520px] z-30 drop-shadow-[0_12px_16px_rgba(0,0,0,0.08)] pointer-events-none"
  >
    <svg viewBox="0 0 500 360" fill="#a8c7fa" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <circle cx="20" cy="70" r="120" />
      <circle cx="135" cy="45" r="105" />
      <circle cx="250" cy="70" r="95" />
      <circle cx="80" cy="165" r="115" />
      <circle cx="210" cy="170" r="100" />
      <circle cx="340" cy="135" r="85" />
      <circle cx="430" cy="105" r="70" />
    </svg>
  </motion.div>
);

const TopCloudsRight = () => (
  <motion.div
    initial={{ x: 220, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 1.8, ease: "easeOut" }}
    className="absolute top-[-90px] right-[-120px] w-[340px] sm:w-[430px] md:w-[520px] z-30 drop-shadow-[0_12px_16px_rgba(0,0,0,0.08)] pointer-events-none"
  >
    <svg viewBox="0 0 500 360" fill="#a8c7fa" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <circle cx="480" cy="70" r="120" />
      <circle cx="365" cy="45" r="105" />
      <circle cx="250" cy="70" r="95" />
      <circle cx="420" cy="165" r="115" />
      <circle cx="290" cy="170" r="100" />
      <circle cx="160" cy="135" r="85" />
      <circle cx="70" cy="105" r="70" />
    </svg>
  </motion.div>
);

const MiddleBlueClouds = () => (
  <motion.div
    initial={{ y: 120, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 1.8, ease: "easeOut", delay: 0.2 }}
    className="absolute bottom-[5%] sm:bottom-[4%] md:bottom-[2%] left-0 w-full z-40 pointer-events-none drop-shadow-[0_-10px_14px_rgba(0,0,0,0.08)]"
  >
    <svg viewBox="0 0 1440 360" className="w-full h-auto text-[#6fa3f7]" preserveAspectRatio="none" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
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
      <path d="M0 255 C130 220 255 205 390 225 C505 242 580 292 655 318 C690 330 750 330 785 318 C860 292 935 242 1050 225 C1185 205 1310 220 1440 255 L1440 360 L0 360 Z" />
    </svg>
  </motion.div>
);

const BottomShadowClouds = () => (
  <motion.div
    initial={{ y: 120, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 2, ease: "easeOut", delay: 0.35 }}
    className="absolute bottom-[1%] left-0 w-full z-[45] pointer-events-none opacity-90 drop-shadow-[0_-8px_10px_rgba(0,0,0,0.08)]"
  >
    <svg viewBox="0 0 1440 290" className="w-full h-auto text-[#f4f4f4]" preserveAspectRatio="none" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
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
      <path d="M0 200 C130 168 260 152 390 175 C520 198 595 242 675 265 C710 275 760 275 795 265 C875 242 950 198 1080 175 C1210 152 1340 168 1440 200 L1440 290 L0 290 Z" />
      <rect x="0" y="250" width="1440" height="60" />
    </svg>
  </motion.div>
);

const BottomWhiteClouds = () => (
  <motion.div
    initial={{ y: 140, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 2.2, ease: "easeOut", delay: 0.5 }}
    className="absolute bottom-[-12px] left-0 w-full z-50 pointer-events-none drop-shadow-[0_-14px_18px_rgba(0,0,0,0.08)]"
  >
    <svg viewBox="0 0 1440 350" className="w-full h-auto text-white" preserveAspectRatio="none" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
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
      <path d="M0 230 C125 198 250 185 380 208 C505 230 585 280 660 302 C700 315 795 315 835 302 C910 280 990 230 1115 208 C1245 185 1365 198 1440 230 L1440 350 L0 350 Z" />
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
  </motion.div>
);

// Original spacious coordinates restored
const socialLinks = [
  {
    id: "x",
    href: "https://x.com/GDGCampusAEC",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    bg: "bg-black",
    text: "text-white",
    x: 100,
    y: -95,
  },
  {
    id: "linkedin",
    href: "https://www.linkedin.com/company/gdgcampusaec/",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    bg: "bg-[#0A66C2]",
    text: "text-white",
    x: 155,
    y: -35,
  },
  {
    id: "community",
    href: "https://gdg.community.dev/gdg-on-campus-asansol-engineering-college-asansol-india/",
    icon: <Globe className="w-5 h-5" />,
    bg: "bg-[#34A853]", // Google green
    text: "text-white",
    x: 155,
    y: 35,
  },
  {
    id: "discord",
    href: "https://discord.gg/nVXEt2dQG",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.95-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
      </svg>
    ),
    bg: "bg-[#5865F2]",
    text: "text-white",
    x: 100,
    y: 95,
  },
];

export default function HeroSection() {
  const { scrollY } = useScroll();
  const [showSocials, setShowSocials] = useState(false);

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
          Google Developers Group
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

        {/* Changed layout from flex-wrap row to flex-col to stack buttons vertically */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
          <Link
            href="/events"
            className="bg-white/40 backdrop-blur-sm border border-gray-900 text-gray-900 px-6 py-3 rounded-full text-sm font-semibold hover:bg-white/70 transition-all duration-300 hover:scale-105"
          >
            Upcoming Events
          </Link>

          <div className="relative inline-flex items-center justify-center z-[90] pointer-events-auto">
            <motion.button
              type="button"
              onClick={() => setShowSocials(!showSocials)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-3 hover:bg-gray-800 transition-all duration-300 relative z-20 cursor-pointer shadow-md hover:shadow-lg"
            >
              Join GDG
              <span className="bg-white text-gray-900 rounded-full p-0.5 transition-transform duration-300">
                <ArrowRight
                  className={`w-4 h-4 transition-transform duration-300 ${
                    showSocials ? "rotate-180" : "rotate-0"
                  }`}
                />
              </span>
            </motion.button>

            <AnimatePresence>
              {showSocials && (
                <motion.div
                  key="social-menu"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center"
                >
                  <GoogleConfetti />

                  {socialLinks.map((link, idx) => (
                    <motion.a
                      key={link.id}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                      animate={{
                        opacity: 1,
                        x: link.x,
                        y: link.y,
                        scale: 1,
                      }}
                      exit={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                      transition={{
                        duration: 0.35,
                        ease: [0.22, 1, 0.36, 1],
                        delay: idx * 0.04,
                      }}
                      className={`absolute -ml-5 -mt-5 flex items-center justify-center w-10 h-10 rounded-full shadow-lg hover:scale-110 transition-transform pointer-events-auto ${link.bg} ${link.text}`}
                    >
                      {link.icon}
                    </motion.a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
          className="absolute bottom-[-9%] sm:bottom-[-2%] md:bottom-[-5%] left-[50%] z-20 w-[280px] sm:w-[380px] md:w-[500px]"
        >
          <ConcentricSun className="w-full" />
        </motion.div>

        <motion.div style={{ y: cloudsY }} className="absolute inset-x-0 bottom-0 z-40">
          <MiddleBlueClouds />
        </motion.div>

        <motion.div style={{ y: cloudsY }} className="absolute inset-x-0 bottom-0 z-[45]">
          <BottomShadowClouds />
        </motion.div>

        <BottomWhiteClouds />
      </div>
    </section>
  );
}