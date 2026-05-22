"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
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

const TopCloudsLeft = () => (
  <motion.div
    initial={{ x: -220, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{
      duration: 1.8,
      ease: "easeOut",
    }}
    className="absolute top-[-95px] left-[-110px] w-[340px] sm:w-[430px] md:w-[520px] z-30 drop-shadow-[0_12px_16px_rgba(0,0,0,0.08)] pointer-events-none"
  >
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
  </motion.div>
);

const TopCloudsRight = () => (
  <motion.div
    initial={{ x: 220, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{
      duration: 1.8,
      ease: "easeOut",
    }}
    className="absolute top-[-90px] right-[-120px] w-[340px] sm:w-[430px] md:w-[520px] z-30 drop-shadow-[0_12px_16px_rgba(0,0,0,0.08)] pointer-events-none"
  >
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
  </motion.div>
);

const MiddleBlueClouds = () => (
  <motion.div
    initial={{ y: 120, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{
      duration: 1.8,
      ease: "easeOut",
      delay: 0.2,
    }}
    className="absolute bottom-[5%] sm:bottom-[4%] md:bottom-[2%] left-0 w-full z-40 pointer-events-none drop-shadow-[0_-10px_14px_rgba(0,0,0,0.08)]"
  >
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
      <path
        d="
        M0 255
        C130 220 255 205 390 225
        C505 242 580 292 655 318
        C690 330 750 330 785 318
        C860 292 935 242 1050 225
        C1185 205 1310 220 1440 255
        L1440 360
        L0 360
        Z
      "
      />
    </svg>
  </motion.div>
);

const BottomShadowClouds = () => (
  <motion.div
    initial={{ y: 120, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{
      duration: 2,
      ease: "easeOut",
      delay: 0.35,
    }}
    className="absolute bottom-[1%] left-0 w-full z-[45] pointer-events-none opacity-90 drop-shadow-[0_-8px_10px_rgba(0,0,0,0.08)]"
  >
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
      <path
        d="
        M0 200
        C130 168 260 152 390 175
        C520 198 595 242 675 265
        C710 275 760 275 795 265
        C875 242 950 198 1080 175
        C1210 152 1340 168 1440 200
        L1440 290
        L0 290
        Z
      "
      />
      <rect x="0" y="250" width="1440" height="60" />
    </svg>
  </motion.div>
);

const BottomWhiteClouds = () => (
  <motion.div
    initial={{ y: 140, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{
      duration: 2.2,
      ease: "easeOut",
      delay: 0.5,
    }}
    className="absolute bottom-[-12px] left-0 w-full z-50 pointer-events-none drop-shadow-[0_-14px_18px_rgba(0,0,0,0.08)]"
  >
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
      <path
        d="
        M0 230
        C125 198 250 185 380 208
        C505 230 585 280 660 302
        C700 315 795 315 835 302
        C910 280 990 230 1115 208
        C1245 185 1365 198 1440 230
        L1440 350
        L0 350
        Z
      "
      />
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

export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-3 hover:bg-gray-800 transition-all duration-300 hover:scale-105"
          >
            Join GDG
            <span className="bg-white text-gray-900 rounded-full p-0.5">
              <ArrowRight className="w-4 h-4" />
            </span>
          </button>

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

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50, rotateX: 20 }}
              animate={{ scale: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.8, y: 50, opacity: 0, rotateX: -20 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              className="relative w-full max-w-md bg-gradient-to-br from-white to-gray-50 rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3),inset_0_2px_0_rgba(255,255,255,0.8)] border border-gray-100 transform-gpu"
              onClick={(e) => e.stopPropagation()}
              style={{ perspective: 1000 }}
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-8 relative z-10">
                <div className="w-20 h-20 mx-auto rounded-2xl shadow-lg mb-4 transform hover:scale-105 transition-transform overflow-hidden bg-white">
                  <img src="/android-chrome-512x512.png" alt="GDG Logo" className="w-full h-full object-contain" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Join Our Community</h2>
                <p className="text-gray-500 text-sm">Choose your preferred platform to connect with us and stay updated.</p>
              </div>

              <div className="flex flex-col gap-4 relative z-10">
                {/* LinkedIn */}
                <a 
                  href="https://www.linkedin.com/company/gdgcampusaec/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-[0_8px_30px_rgba(10,102,194,0.2)] hover:border-[#0a66c2]/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0a66c2]/0 to-[#0a66c2]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-12 h-12 rounded-xl bg-[#0a66c2] text-white flex items-center justify-center shrink-0 shadow-md transform group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-gray-900">LinkedIn</h3>
                    <p className="text-xs text-gray-500">Professional Network</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#0a66c2] transition-colors" />
                </a>

                {/* Discord */}
                <a 
                  href="https://discord.gg/nVXEt2dQG" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-[0_8px_30px_rgba(88,101,242,0.2)] hover:border-[#5865F2]/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#5865F2]/0 to-[#5865F2]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-12 h-12 rounded-xl bg-[#5865F2] text-white flex items-center justify-center shrink-0 shadow-md transform group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-gray-900">Discord</h3>
                    <p className="text-xs text-gray-500">Community Server</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#5865F2] transition-colors" />
                </a>

                {/* X / Twitter */}
                <a 
                  href="https://x.com/GDGCampusAEC" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:border-gray-900/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900/0 to-gray-900/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center shrink-0 shadow-md transform group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-gray-900">X (Twitter)</h3>
                    <p className="text-xs text-gray-500">Latest Updates</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-gray-900 transition-colors" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}