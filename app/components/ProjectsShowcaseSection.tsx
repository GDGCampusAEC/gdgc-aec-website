"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  ExternalLink,
  Search,
  Sparkles,
  Trophy,
  Users,
  Layers,
} from "lucide-react";

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
import {
  StudentProject,
  ProjectCategory,
  SEED_PROJECTS,
} from "@/lib/types/project";

const CATEGORIES: ProjectCategory[] = [
  "All",
  "Web Development",
  "AI & Machine Learning",
  "Mobile Apps",
  "Cloud & DevOps",
  "Open Source",
];

const CATEGORY_COLORS: Record<string, string> = {
  "Web Development": "bg-blue-50 text-blue-700 border-blue-200",
  "AI & Machine Learning": "bg-purple-50 text-purple-700 border-purple-200",
  "Mobile Apps": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Cloud & DevOps": "bg-amber-50 text-amber-700 border-amber-200",
  "Open Source": "bg-rose-50 text-rose-700 border-rose-200",
};

interface ProjectsShowcaseProps {
  initialProjects?: StudentProject[];
  homepageMode?: boolean;
}

export default function ProjectsShowcaseSection({
  initialProjects = SEED_PROJECTS,
  homepageMode = false,
}: ProjectsShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = useMemo(() => {
    return initialProjects.filter((p) => {
      const matchesCategory =
        selectedCategory === "All" || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.techStack.some((t) => t.toLowerCase().includes(q)) ||
        p.contributors.some((c) => c.name.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [initialProjects, selectedCategory, searchQuery]);

  return (
    <section className="relative w-full py-16 px-4 sm:px-6 lg:px-8 bg-[#FFFDF5]">
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-blue-100 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-amber-100 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Campus Innovation Hub</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
            Student Projects & Achievements
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            Discover outstanding open-source contributions, hackathon-winning builds, and real-world software crafted by AEC student developers.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                    active
                      ? "bg-gray-900 text-white border-gray-900 shadow-md scale-105"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects or tech..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-800"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => {
              const categoryColor =
                CATEGORY_COLORS[project.category] || "bg-gray-50 text-gray-700 border-gray-200";

              return (
                <motion.article
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="group relative flex flex-col justify-between bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${categoryColor}`}
                      >
                        {project.category}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {project.featured && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            Featured
                          </span>
                        )}
                        <span className="text-xs font-medium text-gray-400">
                          {project.year}
                        </span>
                      </div>
                    </div>

                    {/* Title & Tagline */}
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs font-medium text-blue-600 mt-1 mb-2">
                      {project.tagline}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4">
                      {project.description}
                    </p>

                    {/* Achievements */}
                    {project.achievements && project.achievements.length > 0 && (
                      <div className="mb-4 space-y-1.5">
                        {project.achievements.map((ach) => (
                          <div
                            key={ach}
                            className="flex items-center gap-1.5 text-xs font-medium text-amber-800 bg-amber-50/70 border border-amber-200/60 px-2.5 py-1 rounded-lg"
                          >
                            <Trophy className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span className="truncate">{ach}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tech Stack Chips */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="text-[11px] font-medium bg-gray-100/80 text-gray-700 px-2.5 py-0.5 rounded-md border border-gray-200/50"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    {/* Contributors */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-medium text-gray-700 truncate max-w-[170px]">
                          {project.contributors.map((c) => c.name).join(", ")}
                        </span>
                      </div>
                    </div>

                    {/* Action Links */}
                    <div className="flex items-center gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                        >
                          <GithubIcon className="w-3.5 h-3.5" />
                          <span>Code</span>
                        </a>
                      )}
                      {project.liveDemoUrl && (
                        <a
                          href={project.liveDemoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
            <Layers className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-gray-800">
              No matching student projects found
            </h4>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search terms or filter by a different category.
            </p>
          </div>
        )}

        {/* Call to action for students */}
        {homepageMode && (
          <div className="mt-12 text-center">
            <a
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-300 hover:border-gray-400 text-sm font-bold text-gray-800 shadow-sm hover:shadow transition-all"
            >
              <Code2 className="w-4 h-4 text-blue-600" />
              <span>Explore All Student Projects</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
