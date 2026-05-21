
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/#about" },
  { name: "Teams", path: "/teams" },
  { name: "Gallery", path: "/gallery" },
  { name: "Explore", path: "/#explore" },
  { name: "Events", path: "/events" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [active, setActive] = useState("Home");
  const [hovered, setHovered] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleRouteSync = () => {
      const fullPath = window.location.pathname + window.location.hash;
      const matchingLink = navLinks.find((link) => link.path === fullPath);

      if (matchingLink) {
        setActive(matchingLink.name);
      } else if (pathname !== "/") {
        const fallbackLink = navLinks.find(
          (link) => !link.path.includes("#") && pathname.startsWith(link.path) && link.path !== "/"
        );
        if (fallbackLink) setActive(fallbackLink.name);
      } else {
        setActive("Home");
      }
    };

    handleRouteSync();

    window.addEventListener("hashchange", handleRouteSync);
    return () => window.removeEventListener("hashchange", handleRouteSync);
  }, [pathname]);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[90] w-full max-w-2xl px-4">
      <div
        className={`backdrop-blur-md border transition-all duration-300 rounded-full px-2 py-2 flex items-center justify-between relative overflow-hidden ${
          scrolled
            ? "bg-white/95 border-gray-200/80 shadow-md scale-[1.02]"
            : "bg-white/80 border-gray-100 shadow-sm"
        }`}
        onMouseLeave={() => setHovered(null)}
      >
        {navLinks.map((link) => {
          const isActive = active === link.name;
          const isHovered = hovered === link.name;

          return (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setActive(link.name)}
              onMouseEnter={() => setHovered(link.name)}
              className={`relative px-5 py-2 text-sm font-medium transition-colors duration-300 z-10 ${
                isActive
                  ? "text-white"
                  : isHovered
                  ? "text-gray-900"
                  : "text-gray-600"
              }`}
            >
              <span className="relative z-10">{link.name}</span>

              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-gray-900 rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              {!isActive && isHovered && (
                <motion.div
                  layoutId="hover-pill"
                  className="absolute inset-0 bg-gray-100 rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}