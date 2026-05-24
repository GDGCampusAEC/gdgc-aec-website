"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  ExternalLink,
  Search,
  Play,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import coursesStatic from "@/courses.json";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor?: string;
  category?: string;
  playlistId?: string;
  firstVideoId?: string;
  link: string;
  image?: string;
  createdAt?: string;
}

const GDGC_DOTS = [
  { color: "#4285f4" },
  { color: "#db4437" },
  { color: "#f4b400" },
  { color: "#0f9d58" },
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; accent: string }> = {
  "Machine Learning": { bg: "#e8f0fe", text: "#1a73e8", border: "#4285f4", accent: "#4285f4" },
  "Deep Learning":   { bg: "#e8f0fe", text: "#1a73e8", border: "#4285f4", accent: "#4285f4" },
  "Soft Computing":  { bg: "#fce8e6", text: "#c5221f", border: "#db4437", accent: "#db4437" },
  "Data Structures": { bg: "#e6f4ea", text: "#137333", border: "#0f9d58", accent: "#0f9d58" },
  "Algorithms":      { bg: "#fef7e0", text: "#b45309", border: "#f4b400", accent: "#f4b400" },
};
const DEFAULT_COLOR = { bg: "#e8f0fe", text: "#1a73e8", border: "#4285f4", accent: "#4285f4" };

function getThumbnail(course: Course): string {
  if (course.image && course.image.trim()) return course.image;
  if (course.firstVideoId) {
    return `https://i.ytimg.com/vi/${course.firstVideoId}/hqdefault.jpg`;
  }
  return "";
}

function CourseCard({ course, index }: { course: Course; index: number }) {
  const [imgError, setImgError] = useState(false);

  const thumb = getThumbnail(course);
  const colors = course.category ? (CATEGORY_COLORS[course.category] ?? DEFAULT_COLOR) : DEFAULT_COLOR;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
      className="group relative bg-white rounded-[1.75rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-400 flex flex-col"
    >
      {/* Accent stripe */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] z-10"
        style={{ background: colors.accent }}
      />

      {/* Thumbnail */}
      <div className="relative overflow-hidden h-48 flex-shrink-0 bg-gray-50">
        {thumb && !imgError ? (
          <>
            <img
              src={thumb}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgError(true)}
              loading={index < 3 ? "eager" : "lazy"}
              // @ts-ignore — fetchPriority is valid HTML but TS types lag behind
              fetchPriority={index < 3 ? "high" : "auto"}
            />
            {/* Play overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg scale-0 group-hover:scale-100 transition-transform duration-300">
                <Play size={22} className="text-gray-800 translate-x-0.5" fill="currentColor" />
              </div>
            </div>
          </>
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-2"
            style={{ background: colors.bg }}
          >
            <BookOpen size={40} style={{ color: colors.accent }} strokeWidth={1.5} />
            <span className="text-xs font-medium" style={{ color: colors.text }}>
              {course.category ?? "Course"}
            </span>
          </div>
        )}

        {/* Category badge */}
        {course.category && (
          <div
            className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
            style={{ background: colors.bg, color: colors.text }}
          >
            {course.category}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-grow p-5">
        <h2 className="text-base font-semibold text-gray-900 leading-snug mb-1 group-hover:text-[#4285f4] transition-colors line-clamp-2">
          {course.title}
        </h2>

        {course.instructor && (
          <p className="text-xs text-gray-400 font-medium mb-2.5 flex items-center gap-1">
            <GraduationCap size={12} />
            {course.instructor}
          </p>
        )}

        <p className="text-sm text-gray-500 leading-relaxed flex-grow line-clamp-3 mb-5">
          {course.description}
        </p>

        <a
          href={course.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg active:scale-95"
          style={{ background: colors.accent }}
        >
          <ExternalLink size={14} />
          Watch Playlist
        </a>
      </div>
    </motion.article>
  );
}

export default function CoursesPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const allCourses: Course[] = coursesStatic as Course[];

  const categories = ["All", ...Array.from(new Set(allCourses.map((c) => c.category).filter(Boolean))) as string[]];

  const filtered = allCourses.filter((c) => {
    const matchesQuery =
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase()) ||
      (c.instructor ?? "").toLowerCase().includes(query.toLowerCase());
    const matchesCategory = activeCategory === "All" || c.category === activeCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-slate-800 font-sans pb-28">

      {/* Preload thumbnails — hoisted to <head> by Next.js */}
      {allCourses.map((c) =>
        c.image ? (
          <link key={c.id} rel="preload" as="image" href={c.image} />
        ) : null
      )}

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-16 px-4 text-center overflow-hidden">
        {/* Background blobs */}
        <div aria-hidden className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-[0.07] blur-3xl" style={{ background: "#4285f4" }} />
        <div aria-hidden className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-[0.07] blur-3xl" style={{ background: "#f4b400" }} />
        <div aria-hidden className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full opacity-[0.06] blur-3xl" style={{ background: "#0f9d58" }} />

        {/* GDGC badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full bg-white border border-gray-100 shadow-sm"
        >
          {GDGC_DOTS.map((d, i) => (
            <span key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
          ))}
          <span className="ml-1 text-[11px] font-bold uppercase tracking-widest text-gray-400">
            GDGC AEC · Learning Hub
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl font-semibold tracking-tight text-gray-900 mb-4 leading-tight"
        >
          Explore{" "}
          <span className="relative inline-block" style={{ color: "#4285f4" }}>
            Courses
            <motion.span
              className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
              style={{ background: "linear-gradient(90deg,#4285f4,#0f9d58)" }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-gray-500 text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Curated playlists hand-picked by the GDGC AEC team to help you grow
          your technical skills.
        </motion.p>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative max-w-md mx-auto"
        >
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search courses, topics, instructors…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-5 py-3.5 rounded-full bg-white border border-gray-200 shadow-sm focus:outline-none focus:border-[#4285f4] focus:ring-2 focus:ring-[#4285f4]/20 transition-all text-gray-800 placeholder:text-gray-400 text-sm"
          />
        </motion.div>

        {/* Category pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2 mt-5"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                activeCategory === cat
                  ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>
      </section>

      {/* ── Course Grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-[#fce8b2] flex items-center justify-center">
              <BookOpen size={28} className="text-[#f4b400]" />
            </div>
            <p className="text-gray-600 font-semibold text-lg">
              {query ? "No courses match your search." : "No courses yet."}
            </p>
            {(query || activeCategory !== "All") && (
              <button
                onClick={() => { setQuery(""); setActiveCategory("All"); }}
                className="text-sm text-[#4285f4] font-medium hover:underline"
              >
                Clear filters
              </button>
            )}
          </motion.div>
        ) : (
          <>
            <div
              key={activeCategory + "||" + query}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
            >
              {filtered.map((course, i) => (
                <CourseCard key={course.id} course={course} index={i} />
              ))}
            </div>

            {/* Count */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center text-sm text-gray-400 font-medium mt-12 flex items-center justify-center gap-2"
            >
              <Sparkles size={14} className="text-[#f4b400]" />
              Showing {filtered.length} of {allCourses.length} course{allCourses.length !== 1 ? "s" : ""}
            </motion.p>
          </>
        )}
      </section>
    </main>
  );
}
