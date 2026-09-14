"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Home, Info, Users, Image, Calendar, BookOpen, X, ArrowUpRight } from "lucide-react";
import { GeminiBorderButton } from "./GeminiButton";

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

  const [announcementDismissed, setAnnouncementDismissed] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 20);
      setIsAtTop(scrollY <= 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
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

  const showAnnouncement = isAtTop && !announcementDismissed;

  return (
    <>
      <motion.div
        initial={false}
        animate={{ y: showAnnouncement ? 0 : "-100%", opacity: showAnnouncement ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="fixed inset-x-0 top-0 z-[100] border-b border-slate-900/10 bg-white px-3 py-2 sm:px-6"
      >
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-3 pr-8 text-center text-xs sm:gap-4 sm:text-sm">
          <Link href="/recruitment">
            <GeminiBorderButton className="py-0! shadow-xs group">
              GDGC AEC Recruitment 2026-27 is Live <span className="ml-1 hidden sm:inline">Apply Now</span>
              <ArrowUpRight className="ml-2 transition-transform group-hover:scale-125!" size={16} />
            </GeminiBorderButton>
          </Link>
        </div>

        <button
          type="button"
          aria-label="Dismiss recruitment announcement"
          onClick={() => setAnnouncementDismissed(true)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-black/70 transition-colors hover:bg-black/5 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black sm:right-6"
        >
          <X size={16} />
        </button>
      </motion.div>


      <motion.nav
        initial={false}
        animate={{ top: showAnnouncement ? "3.5rem" : "1rem" }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="fixed left-1/2 z-[90] w-full max-w-[92%] -translate-x-1/2 px-2 sm:max-w-2xl sm:px-4"
      >
        <div
          className={`relative flex items-center justify-around overflow-hidden rounded-full border p-1.5 backdrop-blur-md transition-all duration-300 sm:justify-between ${scrolled ? "border-gray-200/80 bg-white/95 shadow-md scale-[1.01]" : "border-gray-100 bg-white/80 shadow-sm"}`}
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
                className={`relative z-10 flex select-none items-center justify-center px-2.5 py-2 text-xs font-medium transition-colors duration-300 sm:px-5 sm:text-sm ${isActive ? "text-white" : isHovered ? "text-gray-900" : "text-gray-600"}`}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon size={16} className="block sm:hidden" />
                  <span className="hidden sm:inline">{link.name}</span>
                </span>

                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-full bg-gray-900"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                {!isActive && isHovered && (
                  <motion.div
                    layoutId="hover-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-gray-100"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>
      </motion.nav>
    </>
  );
}