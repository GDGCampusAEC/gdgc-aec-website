"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Home, Info, Users, Image, Calendar, BookOpen, Trophy, Code2 } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { name: "Home", path: "/", icon: Home },
  { name: "About", path: "/#about", icon: Info },
  { name: "Projects", path: "/projects", icon: Code2 },
  { name: "Teams", path: "/teams", icon: Users },
  { name: "Gallery", path: "/gallery", icon: Image },
  { name: "Events", path: "/events", icon: Calendar },
  { name: "Courses", path: "/courses", icon: BookOpen },
  { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
];

export default function Navbar() {
  const pathname = usePathname();

  const [active, setActive] = useState("Home");
  const [hovered, setHovered] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleRouteSync = () => {
      const fullPath =
        window.location.pathname + window.location.hash;

      const matchingLink = navLinks.find(
        (link) => link.path === fullPath
      );

      if (matchingLink) {
        setActive(matchingLink.name);
      } else if (pathname !== "/") {
        const fallbackLink = navLinks.find(
          (link) =>
            !link.path.includes("#") &&
            pathname.startsWith(link.path) &&
            link.path !== "/"
        );

        if (fallbackLink) {
          setActive(fallbackLink.name);
        }
      } else {
        setActive("Home");
      }
    };

    handleRouteSync();

    window.addEventListener("hashchange", handleRouteSync);

    return () => {
      window.removeEventListener("hashchange", handleRouteSync);
    };
  }, [pathname]);

  // Scroll-spy: highlight nav pill for section currently in view (homepage only)
  useEffect(() => {
    if (pathname !== "/") return;

    const sectionIds = ["home", "about", "projects", "gallery", "teams"];
    const sectionToLink: Record<string, string> = {
      home: "Home",
      about: "About",
      projects: "Projects",
      gallery: "Gallery",
      teams: "Teams",
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const linkName = sectionToLink[entry.target.id];
            if (linkName) setActive(linkName);
          }
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [pathname]);

  return (
    <nav
      aria-label="Main Navigation"
      className="fixed left-1/2 top-3 z-[90] w-max max-w-[96%] -translate-x-1/2 px-1 transition-[top] duration-300 sm:top-5 sm:max-w-fit sm:px-2"
    >
      <div
        className={`relative flex items-center justify-between gap-1 sm:gap-1.5 rounded-full border p-1 sm:p-1.5 backdrop-blur-md transition-all duration-300 ${
          scrolled
            ? "scale-[1.01] border-gray-200/90 bg-white/95 shadow-md dark:border-gray-800 dark:bg-gray-900/95 dark:shadow-black/50"
            : "border-gray-200/60 bg-white/85 shadow-sm dark:border-gray-800/80 dark:bg-gray-900/85"
        }`}
        onMouseLeave={() => setHovered(null)}
      >
        <div className="flex items-center gap-0.5 sm:gap-1">
          {navLinks.map((link) => {
            const isActive = active === link.name;
            const isHovered = hovered === link.name;
            const Icon = link.icon;

            return (
              <Link
                key={link.name}
                href={link.path}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setActive(link.name)}
                onMouseEnter={() => setHovered(link.name)}
                className={`relative z-10 flex select-none shrink-0 items-center justify-center rounded-full px-2 py-1.5 text-xs font-medium transition-colors duration-300 sm:px-3 sm:py-1.5 sm:text-sm ${
                  isActive
                    ? "text-white dark:text-gray-900 font-semibold"
                    : isHovered
                      ? "text-gray-900 dark:text-gray-100"
                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon size={16} className="block sm:hidden" />
                  <span className="hidden sm:inline">{link.name}</span>
                </span>

                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-full bg-gray-900 dark:bg-gray-100"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}

                {!isActive && isHovered && (
                  <motion.div
                    layoutId="hover-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-gray-100 dark:bg-gray-800"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="shrink-0 flex items-center pl-1 sm:pl-1.5 pr-0.5 sm:pr-1 border-l border-gray-200/80 dark:border-gray-700/80">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
