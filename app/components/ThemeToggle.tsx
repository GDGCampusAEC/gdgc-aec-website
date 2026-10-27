"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("gdgc-theme") as "light" | "dark" | null;
    if (saved) {
      setTheme(saved);
      if (saved === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("gdgc-theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-full border border-gray-200 opacity-0" />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className="relative z-20 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white/80 dark:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-200 shadow-sm transition-all hover:scale-105 active:scale-95"
    >
      {theme === "dark" ? (
        <Sun size={15} className="text-amber-400 transition-transform duration-300 rotate-0" />
      ) : (
        <Moon size={15} className="text-gray-700 transition-transform duration-300 rotate-0" />
      )}
    </button>
  );
}
