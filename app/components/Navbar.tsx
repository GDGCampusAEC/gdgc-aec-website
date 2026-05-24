"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Info, Users, Image, Calendar, BookOpen } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/", icon: Home },
  { name: "About", path: "/#about", icon: Info },
  { name: "Teams", path: "/teams", icon: Users },
  { name: "Gallery", path: "/gallery", icon: Image },
  { name: "Events", path: "/events", icon: Calendar },
  { name: "Courses", path: "/courses", icon: BookOpen },
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
    /* Changed max-w constraints to scale beautifully on narrow mobile devices */
    <nav className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-[90] w-full max-w-[92%] sm:max-w-2xl px-2 sm:px-4">
      <div
        className={`backdrop-blur-md border transition-all duration-300 rounded-full p-1.5 flex items-center justify-around sm:justify-between relative overflow-hidden ${
          scrolled
            ? "bg-white/95 border-gray-200/80 shadow-md scale-[1.01]"
            : "bg-white/80 border-gray-100 shadow-sm"
        }`}
        onMouseLeave={() => setHovered(null)}
      >
        {navLinks.map((link) => {
          const isActive = active === link.name;
          const isHovered = hovered === link.name;
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setActive(link.name)}
              onMouseEnter={() => setHovered(link.name)}
              /* Responsive Adjustments:
                - Lowered padding from px-5 to px-2.5 on mobile, scales back up on sm screens.
                - text-xs on mobile to save real estate, text-sm on desktop.
              */
              className={`relative flex items-center justify-center px-2.5 py-2 sm:px-5 text-xs sm:text-sm font-medium transition-colors duration-300 z-10 select-none ${
                isActive
                  ? "text-white"
                  : isHovered
                  ? "text-gray-900"
                  : "text-gray-600"
              }`}
            >
              <span className="relative z-10 flex items-center gap-1.5">
                {/* Shows icon on mobile viewports (< 640px) */}
                <Icon size={16} className="block sm:hidden" />
                {/* Shows typography text label on tablets & desktops (>= 640px) */}
                <span className="hidden sm:inline">{link.name}</span>
              </span>

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