"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

  return (
    <nav className="fixed left-1/2 top-4 z-[90] w-full max-w-[92%] -translate-x-1/2 px-2 transition-[top] duration-300 sm:top-6 sm:max-w-2xl sm:px-4">
      <div
        className={`relative flex items-center justify-around overflow-hidden rounded-full border p-1.5 backdrop-blur-md transition-all duration-300 sm:justify-between ${scrolled
            ? "scale-[1.01] border-gray-200/80 bg-white/95 shadow-md"
            : "border-gray-100 bg-white/80 shadow-sm"
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
              className={`relative z-10 flex select-none items-center justify-center px-2.5 py-2 text-xs font-medium transition-colors duration-300 sm:px-5 sm:text-sm ${isActive
                  ? "text-white"
                  : isHovered
                    ? "text-gray-900"
                    : "text-gray-600"
                }`}
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <Icon size={16} className="block sm:hidden" />

                <span className="hidden sm:inline">
                  {link.name}
                </span>
              </span>

              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-full bg-gray-900"
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
                  className="absolute inset-0 -z-10 rounded-full bg-gray-100"
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
    </nav>
  );
}