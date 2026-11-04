"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  ExternalLink,
  Search,
  Sparkles,
  Trophy,
  Users,
  Layers,
  ArrowRight,
  FolderGit2,
} from "lucide-react";
import Link from "next/link";
import {
  StudentProject,
  ProjectCategory,
  VALID_PROJECT_CATEGORIES,
} from "@/lib/types/project";

function GithubIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

const CATEGORIES: ProjectCategory[] = [
  "All",
  ...VALID_PROJECT_CATEGORIES,
];

const CATEGORY_COLORS: Record<string, { light: string; dark: string }> = {
  "Web Development": {
    light: "bg-blue-50 text-blue-700 border-blue-200",
    dark: "dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
  },
  "AI & Machine Learning": {
    light: "bg-purple-50 text-purple-700 border-purple-200",
    dark: "dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
  },
  "Mobile Apps": {
    light: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dark: "dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  },
  "Cloud & DevOps": {
    light: "bg-amber-50 text-amber-700 border-amber-200",
    dark: "dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
  },
  "Open Source": {
    light: "bg-rose-50 text-rose-700 border-rose-200",
    dark: "dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
  },
};

interface ProjectsShowcaseProps {
  homepageMode?: boolean;
}

export default function ProjectsShowcaseSection({
  homepageMode = false,
}: ProjectsShowcaseProps) {
  const [projects, setProjects] = useState<StudentProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function loadProjects() {
      try {
        const res = await fetch("/api/projects", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data)) {
            setProjects(data);
          }
        }
      } catch (err) {
        console.error("Failed to load projects:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProjects = useMemo(() => {
    let list = projects.filter((p) => {
      const matchesCategory =
        selectedCategory === "All" || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (Array.isArray(p.techStack) && p.techStack.some((t) => t.toLowerCase().includes(q))) ||
        (Array.isArray(p.contributors) && p.contributors.some((c) => c.name.toLowerCase().includes(q)));
      return matchesCategory && matchesSearch;
    });

    if (homepageMode) {
      // Prioritize featured projects on homepage
      list = [...list].sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      }).slice(0, 6);
    }

    return list;
  }, [projects, selectedCategory, searchQuery, homepageMode]);

  return (
    <section id="projects" className="relative w-full py-16 px-4 sm:px-6 lg:px-8 bg-[#FFFDF5] dark:bg-[#0b0f19] transition-colors duration-300">
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-blue-100 dark:bg-blue-900 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-amber-100 dark:bg-amber-900 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Campus Innovation Hub</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Student Projects & Achievements
          </h2>
          <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
            Discover cutting-edge applications, hackathon-winning solutions, and open-source contributions crafted by student builders at Asansol Engineering College.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto pb-1">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                    isSelected
                      ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, stack, builders..."
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white dark:bg-gray-800/60 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 animate-pulse space-y-4"
              >
                <div className="flex justify-between">
                  <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>
                <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-xl" />
                <div className="flex gap-2 pt-2">
                  <div className="h-8 flex-1 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                  <div className="h-8 flex-1 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Projects Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => {
                const colorConfig =
                  CATEGORY_COLORS[project.category] || CATEGORY_COLORS["Web Development"];

                return (
                  <motion.article
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    className="group relative flex flex-col justify-between bg-white dark:bg-gray-800/80 rounded-3xl p-6 border border-gray-150 dark:border-gray-700/80 shadow-sm hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${colorConfig.light} ${colorConfig.dark}`}
                        >
                          {project.category}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {project.featured && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full">
                              <Sparkles className="w-3 h-3 text-amber-500" />
                              <span>Featured</span>
                            </span>
                          )}
                          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                            {project.year}
                          </span>
                        </div>
                      </div>

                      {/* Title & Tagline */}
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 mb-1">
                        {project.title}
                      </h3>
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-300 line-clamp-1 mb-2.5">
                        {project.tagline}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed mb-4">
                        {project.description}
                      </p>

                      {/* Achievements */}
                      {project.achievements && project.achievements.length > 0 && (
                        <div className="mb-4 space-y-1.5">
                          {project.achievements.map((ach) => (
                            <div
                              key={ach}
                              className="flex items-center gap-1.5 text-xs font-medium text-amber-800 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 px-2.5 py-1 rounded-lg"
                            >
                              <Trophy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                              <span className="truncate">{ach}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tech Stack Chips */}
                      {project.techStack && project.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {project.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="text-[11px] font-medium bg-gray-100/90 dark:bg-gray-700/60 text-gray-700 dark:text-gray-200 px-2.5 py-0.5 rounded-md border border-gray-200/50 dark:border-gray-600/50"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      {/* Contributors */}
                      {project.contributors && project.contributors.length > 0 && (
                        <div className="pt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-gray-400" />
                            <span className="font-medium text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                              {project.contributors.map((c) => c.name).join(", ")}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Action Links */}
                      <div className="flex items-center gap-2">
                        {project.githubUrl ? (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
                          >
                            <GithubIcon className="w-3.5 h-3.5" />
                            <span>Code</span>
                          </a>
                        ) : null}
                        {project.liveDemoUrl ? (
                          <a
                            href={project.liveDemoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Live Demo</span>
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Empty state: No projects in database */}
        {!loading && projects.length === 0 && (
          <div className="text-center py-16 px-4 bg-white dark:bg-gray-800/60 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700 max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center mx-auto mb-4">
              <FolderGit2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">
              No Student Projects Published Yet
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto leading-relaxed">
              Have you built an innovative campus solution, hackathon project, or open-source tool? Contact the GDG team or submit your project through the campus lead to get featured!
            </p>
          </div>
        )}

        {/* Empty state: Filters produced no results */}
        {!loading && projects.length > 0 && filteredProjects.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-800/60 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700 max-w-md mx-auto">
            <Layers className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-gray-900 dark:text-white">
              No matching projects found
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Try adjusting your search terms or filter by another category.
            </p>
          </div>
        )}

        {/* Homepage call to action */}
        {homepageMode && projects.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 text-sm font-bold text-gray-800 dark:text-gray-100 shadow-sm hover:shadow transition-all"
            >
              <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Explore All Student Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
