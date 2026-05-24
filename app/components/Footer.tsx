"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Globe } from "lucide-react";

const footerLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/#about" },
  { name: "Events", path: "/events" },
  { name: "Teams", path: "/teams" },
];

// Symmetrical arc spreading outwards to the right side, perfectly mirroring the Hero section
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
    x: 110,
    y: -85,
  },
  {
    id: "linkedin",
    href: "https://www.linkedin.com/company/gdgcampusaec/",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    bg: "bg-[#0A66C2]",
    text: "text-white",
    x: 165,
    y: -30,
  },
  {
    id: "community",
    href: "https://gdg.community.dev/gdg-on-campus-asansol-engineering-college-asansol-india/",
    icon: <Globe className="w-4 h-4" />,
    bg: "bg-[#34A853]",
    text: "text-white",
    x: 165,
    y: 30,
  },
  {
    id: "discord",
    href: "https://discord.gg/nVXEt2dQG",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.95-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
      </svg>
    ),
    bg: "bg-[#5865F2]",
    text: "text-white",
    x: 110,
    y: 85,
  },
];

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

export default function Footer() {
  const [showSocials, setShowSocials] = useState(false);

  return (
    <footer id="contact" className="relative bg-[#0b1329] text-white pt-20 pb-8 overflow-hidden border-t border-gray-800">
      {/* Subtle Background Radial Glow */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Upper Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-14 text-center md:text-left items-start">

          {/* Column 1: Brand details */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center gap-3.5 mb-5 group hover:opacity-95 transition-all duration-300">
              <img
                src="/gdsc-logo.png"
                alt="GDG On Campus Asansol Engineering College"
                className="h-12 w-auto object-contain"
              />
              <div className="flex flex-col text-left">
                <span className="font-bold text-lg leading-none tracking-tight text-white group-hover:text-[#4285F4] transition-colors duration-300">
                  Google Developer Groups
                </span>
                <span className="text-xs font-semibold text-[#4285F4] leading-none mt-1.5 group-hover:text-white transition-colors duration-300">
                  On Campus Asansol Engineering College
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Empowering student tech enthusiasts at Asansol Engineering College to connect, learn, and build scalable solutions through modern technologies.
            </p>
          </div>

          {/* Column 2: Navigation links */}
          <div className="flex flex-col items-center md:items-center gap-2">
            <div className="text-center md:text-left">
              <h3 className="font-bold text-base uppercase tracking-wider text-gray-300 mb-4">
                Explore Links
              </h3>
              <div className="flex flex-col gap-2.5 items-center md:items-start">
                {footerLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.path}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200 font-medium relative group w-fit"
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#4285F4] transition-all duration-300 group-hover:w-full" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
          {/* Membership Section */}
<div className="flex flex-col items-center md:items-end text-center md:text-right">

  <h3 className="font-bold text-base uppercase tracking-wider text-gray-300 mb-4">
    Join Community
  </h3>

  <div className="relative inline-flex items-center justify-center z-[90] pointer-events-auto">

    <motion.button
      type="button"
      onClick={() => setShowSocials(!showSocials)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white text-gray-900 px-7 py-3 rounded-full text-sm font-bold hover:bg-gray-100 transition-all duration-300 flex items-center gap-3 cursor-pointer shadow-md hover:shadow-xl relative z-20"
    >
      Become a Member

      <span className="bg-gray-900 text-white rounded-full p-0.5 transition-transform duration-300">
        <ArrowRight
          className={`w-3.5 h-3.5 transition-transform duration-300 ${
            showSocials ? "rotate-180" : "rotate-0"
          }`}
        />
      </span>
    </motion.button>

    <AnimatePresence>
      {showSocials && (
        <motion.div
          key="footer-social-menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center overflow-visible"        >
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
              exit={{
                opacity: 0,
                x: 0,
                y: 0,
                scale: 0.5,
              }}
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
</div>        </div>
        

        {/* Enhanced Call-to-Action Membership Banner Row */}
        {/* Membership Button Section */}
        {/* Legal Copyright Line */}
        <div className="border-t border-gray-800/60 mt-12 pt-8 text-center text-xs text-gray-500 font-medium tracking-wide">
          <p>© {new Date().getFullYear()} Google Developer Groups OnCampus AEC. All rights reserved.</p>
          <a
            href="https://gdg.community.dev/gdg-on-campus-asansol-engineering-college-asansol-india/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1.5 text-gray-600 hover:text-[#4285F4] transition-colors duration-300 inline-block"
          >
            Designed & Built with ❤️ by the GDGC AEC Core Team.
          </a>
        </div>
      </div>
    </footer>
  );
}