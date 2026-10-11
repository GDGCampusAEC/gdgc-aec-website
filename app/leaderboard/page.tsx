"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Search,
  Clock,
  ChevronRight,
  X,
  ShieldCheck,
  GitPullRequest,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";
import { ContributionRecord } from "@/lib/openOrbit/types";

interface LeaderboardData {
  enabled: boolean;
  mode?: "automatic" | "manual";
  name?: string;
  status?: "active" | "paused" | "completed";
  startAt?: string;
  endAt?: string;
  scoringRules?: { easy: number; medium: number; hard: number };
  entries?: any[];
  lastSuccessfulSyncAt?: string | null;
  message?: string;
}

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function SparkleStar({
  className,
  fill = "#54CE18",
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={fill}>
      <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
    </svg>
  );
}

function CrownBadge({ rank }: { rank: 1 | 2 | 3 }) {
  const configs = {
    1: {
      from: "#FFE156",
      to: "#E59B00",
      border: "#B27200",
      shadow: "rgba(245, 158, 11, 0.55)",
    },
    2: {
      from: "#E2E8F0",
      to: "#64748B",
      border: "#475569",
      shadow: "rgba(100, 116, 139, 0.35)",
    },
    3: {
      from: "#C67D48",
      to: "#7A3E1D",
      border: "#54240C",
      shadow: "rgba(122, 62, 29, 0.5)",
    },
  }[rank];

  return (
    <div className="relative -mt-15 mb-4 flex items-center justify-center z-10">
      <svg
        width="56"
        height="46"
        viewBox="0 0 54 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: `drop-shadow(0 4px 8px ${configs.shadow})` }}
      >
        <defs>
          <linearGradient id={`crownGrad-${rank}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={configs.from} />
            <stop offset="100%" stopColor={configs.to} />
          </linearGradient>
        </defs>
        <path
          d="M6 14L15 36H39L48 14L36 22L27 6L18 22L6 14Z"
          fill={`url(#crownGrad-${rank})`}
          stroke={configs.border}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="6" cy="14" r="2.5" fill={configs.from} />
        <circle cx="27" cy="6" r="3" fill={configs.from} />
        <circle cx="48" cy="14" r="2.5" fill={configs.from} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center pt-2 font-black text-sm text-white drop-shadow-sm select-none">
        {rank}
      </span>
    </div>
  );
}

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Contributor PRs drawer/modal
  const [selectedUser, setSelectedUser] = useState<{
    id: number;
    username: string;
    avatarUrl: string;
    points: number;
    contributionCount?: number;
  } | null>(null);
  const [userContributions, setUserContributions] = useState<ContributionRecord[]>([]);
  const [loadingContribs, setLoadingContribs] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedUser) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [selectedUser]);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true);
        const res = await fetch("/api/open-orbit/leaderboard", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to load leaderboard:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  const openContributorHistory = async (user: {
    id: number;
    username: string;
    avatarUrl: string;
    points: number;
    contributionCount?: number;
  }) => {
    if (data?.mode !== "automatic") return;
    setSelectedUser(user);
    setUserContributions([]);
    setLoadingContribs(true);
    try {
      const res = await fetch(`/api/open-orbit/contributions/${user.id}`);
      if (res.ok) {
        const contribs = await res.json();
        setUserContributions(contribs);
      }
    } catch {
      // Ignore
    } finally {
      setLoadingContribs(false);
    }
  };

  const entries = data?.entries || [];
  const filteredEntries = entries.filter((e) =>
    (e.githubUsername || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topThree = filteredEntries.slice(0, 3);
  const remainingEntries = filteredEntries.slice(3);

  const TARGET_REPO_URL = "https://github.com/GDGCampusAEC/gdgc-aec-website";

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-slate-800 font-sans pt-28 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-[#56CF16]/20">
      <div
        className="absolute inset-x-0 top-0 h-[650px] sm:h-[850px] lg:h-[950px] pointer-events-none select-none bg-top bg-no-repeat bg-contain sm:bg-cover opacity-85 z-0"
        style={{
          backgroundImage: "url('/open-orbit/bg.png')",
          maskImage: "linear-gradient(to bottom, black 65%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 65%, transparent 100%)",
        }}
      />

      <div className="max-w-5xl mx-auto space-y-12 sm:space-y-14 relative z-10">
        <div className="flex flex-col items-center justify-center text-center space-y-4 sm:space-y-5 pt-2">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xs z-10"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#4285F4]" />
              <span className="w-2 h-2 rounded-full bg-[#34A853]" />
              <span className="w-2 h-2 rounded-full bg-[#EA4335]" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
              GDGC AEC • OPEN SOURCE SPRINT
            </span>
          </motion.div>

          <div className="relative w-full flex items-center justify-center py-2">
            <div
              className="absolute inset-0 max-w-2xl mx-auto pointer-events-none select-none opacity-45 sm:opacity-55 bg-center bg-no-repeat bg-contain"
              style={{ backgroundImage: "url('/open-orbit/orbit.png')" }}
            />

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-[#0B150F] leading-none relative z-10 select-none"
            >
              OPEN{" "}
              <span
                style={{
                  backgroundImage: "linear-gradient(135deg, #5EE114 0%, #44BF0A 50%, #2F9206 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                className="inline-block drop-shadow-xs"
              >
                ORBIT
              </span>
            </motion.h1>
          </div>

          {/* Compact pill-shaped box with black border containing Contributing Repository link */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="relative z-10 px-2"
          >
            <a
              href={TARGET_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1 rounded-full bg-white hover:bg-slate-50 text-black border-[1.5px] border-black shadow-2xs transition-all group hover:scale-[1.02] cursor-pointer"
            >
              <span className="text-xs sm:text-[13px] font-semibold text-black tracking-tight select-none">
                Contributing Repository
              </span>
              <ArrowUpRight size={14} className="text-black stroke-[2.2] shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="max-w-2xl text-sm sm:text-base text-slate-600 font-medium leading-relaxed px-4"
          >
            Contribute to official GDGC AEC repository, submit  pull requests, and climb the live community leaderboard!
          </motion.p>
        </div>

        {data?.enabled && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="max-w-5xl mx-auto w-full relative"
          >
            <div
              className="relative bg-gradient-to-br from-[#0F361C] via-[#0A2413] to-[#05160A] p-[6px] sm:p-[7px] shadow-2xl overflow-hidden transition-all"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px))",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(94, 225, 20, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(94, 225, 20, 0.15) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />

              <div className="absolute top-0 right-0 w-3/5 sm:w-1/2 h-[3.5px] bg-gradient-to-l from-[#64EE18] via-[#48CF0C] to-transparent pointer-events-none shadow-[0_0_8px_rgba(94,225,20,0.6)]" />
              <div className="absolute top-0 right-0 w-[3.5px] h-20 bg-gradient-to-b from-[#64EE18] via-[#48CF0C] to-transparent pointer-events-none" />

              <div
                className="absolute bottom-0 right-0 w-6 h-6 bg-gradient-to-tl from-[#5EE114] to-[#2E9906] pointer-events-none opacity-90 shadow-sm"
                style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}
              />

              <div className="absolute bottom-0 left-0 w-3/5 sm:w-1/2 h-[3.5px] bg-gradient-to-r from-[#64EE18] via-[#48CF0C] to-transparent pointer-events-none shadow-[0_0_8px_rgba(94,225,20,0.6)]" />
              <div className="absolute bottom-0 left-0 w-[3.5px] h-20 bg-gradient-to-t from-[#64EE18] via-[#48CF0C] to-transparent pointer-events-none" />

              <div
                className="absolute bottom-0 left-0 w-6 h-6 bg-gradient-to-tr from-[#5EE114] to-[#2E9906] pointer-events-none opacity-85 shadow-sm"
                style={{ clipPath: "polygon(0 0, 0 100%, 100% 100%)" }}
              />

              <div
                className="bg-white px-4 pt-3.5 pb-3 sm:px-6 sm:pt-4 sm:pb-3.5 relative overflow-hidden shadow-inner"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px))",
                }}
              >
                <div
                  className="absolute inset-0 opacity-[0.035] pointer-events-none"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />

                <div className="relative z-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 lg:gap-6">
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-50 border border-slate-200/90 text-[10px] font-semibold text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <Calendar size={11} className="text-slate-500" />
                        <span className="font-bold text-[10px] text-slate-800">OPEN ORBIT 2026</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F8DE] text-[#24700C] border border-[#C6EDB0] capitalize">
                        {data.status === "active" ? "Active" : data.status || "Active"}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-[28px] font-black tracking-tight text-[#0B150F] leading-none mb-2">
                      SCHEDULE
                    </h2>

                    <div className="space-y-1.5 divide-y divide-slate-100">
                      <div className="pt-0.5 space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
                          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#EAFADC] text-[#24700C] text-[9px] sm:text-[10px] font-black uppercase tracking-wider border border-[#C6EDB0] shrink-0 text-center">
                              SUNDAY
                            </span>
                            <span className="font-black text-xs sm:text-sm text-[#0B150F] shrink-0">
                              SESSION 1
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 font-bold text-sm sm:text-[15px] text-slate-800 whitespace-nowrap shrink-0">
                            <Calendar size={15} className="text-slate-500 shrink-0" />
                            <span>11 Oct 2026</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-500 font-medium">
                          Kickoff session, problem explanation and rules.
                        </p>
                      </div>

                      <div className="pt-1.5 space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
                          <div className="flex items-center shrink-0">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#EAFADC] text-[#24700C] text-[9px] sm:text-[10px] font-black uppercase tracking-wider border border-[#C6EDB0] shrink-0 text-center">
                              OPEN SOURCE CONTRIBUTION EVENT
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 font-bold text-sm sm:text-[15px] text-slate-800 whitespace-nowrap shrink-0">
                            <Calendar size={15} className="text-slate-500 shrink-0" />
                            <span>
                              <span className="hidden sm:inline">12 October 2026 to 31st October 2026</span>
                              <span className="sm:hidden">12 Oct to 31 Oct 2026</span>
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-500 font-medium">
                          Contribute to repository, raise PRs and earn points!
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-44 lg:w-48 shrink-0 bg-[#FAFCF8] border border-[#DCF3D0] rounded-xl px-3.5 py-2.5 flex flex-col justify-center space-y-1 shadow-2xs self-stretch md:self-auto">
                    <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-600">
                      POINTS SYSTEM
                    </h3>
                    <div className="space-y-1 text-xs font-bold divide-y divide-slate-100">
                      <div className="flex items-center justify-between pt-0.5">
                        <span className="flex items-center gap-1.5 text-slate-700 text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                          Level 1
                        </span>
                        <span className="font-black text-[#0B150F] text-xs">
                          +{data.scoringRules?.easy ?? 10}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="flex items-center gap-1.5 text-slate-700 text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-[#EAB308]" />
                          Level 2
                        </span>
                        <span className="font-black text-[#0B150F] text-xs">
                          +{data.scoringRules?.medium ?? 20}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="flex items-center gap-1.5 text-slate-700 text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                          Level 3
                        </span>
                        <span className="font-black text-[#0B150F] text-xs">
                          +{data.scoringRules?.hard ?? 30}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {loading && (
          <div className="max-w-4xl mx-auto space-y-4 py-8">
            <div className="h-44 bg-slate-200/60 animate-pulse rounded-3xl" />
            <div className="h-72 bg-slate-200/60 animate-pulse rounded-3xl" />
          </div>
        )}

        {!loading && data && !data.enabled && (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-10 sm:p-14 text-center max-w-xl mx-auto space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 mx-auto flex items-center justify-center">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Leaderboard in Stealth Mode</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              {data.message ||
                "The leaderboard is currently hidden by organizers. Contributions are being tracked and will be published shortly!"}
            </p>
          </div>
        )}

        {!loading && data && data.enabled && (
          <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search contributor by @username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: "2.5rem" }}
                  className="w-full pr-10 py-2.5 rounded-2xl border border-slate-200 bg-white/95 text-xs font-semibold text-slate-800 focus:border-[#54CE18] focus:ring-2 focus:ring-[#54CE18]/20 outline-none shadow-xs transition-all placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {data.lastSuccessfulSyncAt && (
                <div className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-slate-200/80 text-[11px] text-slate-500 font-medium shadow-xs">
                  <Clock size={12} className="text-[#34A853]" />
                  <span>
                    Last synced:{" "}
                    <span className="font-bold text-slate-800">
                      {new Date(data.lastSuccessfulSyncAt).toLocaleTimeString()}
                    </span>
                  </span>
                </div>
              )}
            </div>

            {topThree.length > 0 && !searchQuery && (
              <div className="pt-8 sm:pt-11">
                {topThree.length >= 3 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="order-2 md:order-1 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col items-center text-center relative overflow-visible group hover:shadow-md transition-all"
                    >
                      <CrownBadge rank={2} />

                      <SparkleStar className="w-4 h-4 absolute top-10 left-6 opacity-35" fill="#64748B" />
                      <SparkleStar className="w-3.5 h-3.5 absolute top-20 right-6 opacity-40" fill="#64748B" />

                      <div className="relative mt-2 mb-3">
                        <img
                          src={topThree[1].avatarUrl || `https://github.com/${topThree[1].githubUsername}.png`}
                          alt={topThree[1].githubUsername}
                          className="w-20 h-20 rounded-full border-4 border-slate-200 ring-4 ring-slate-100 shadow-sm object-cover"
                        />
                      </div>

                      <a
                        href={topThree[1].githubUrl || `https://github.com/${topThree[1].githubUsername}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-extrabold text-[#0B150F] text-base hover:text-emerald-700 hover:underline transition-colors block"
                        title={`View @${topThree[1].githubUsername} on GitHub`}
                      >
                        @{topThree[1].githubUsername}
                      </a>
                      <p className="text-3xl font-black text-[#0B150F] mt-1">
                        {topThree[1].totalPoints}{" "}
                        <span className="text-base font-bold text-slate-400">pts</span>
                      </p>

                      {data.mode === "automatic" ? (
                        <button
                          type="button"
                          onClick={() =>
                            openContributorHistory({
                              id: topThree[1].githubUserId,
                              username: topThree[1].githubUsername,
                              avatarUrl: topThree[1].avatarUrl,
                              points: topThree[1].totalPoints,
                              contributionCount: topThree[1].contributionCount,
                            })
                          }
                          className="mt-3 text-xs font-bold text-slate-500 hover:text-emerald-700 flex items-center gap-1 transition-colors group/btn"
                        >
                          <span>{topThree[1].contributionCount} merged PRs</span>
                          <ChevronRight
                            size={13}
                            className="group-hover/btn:translate-x-0.5 transition-transform"
                          />
                        </button>
                      ) : (
                        <p className="mt-2 text-xs font-semibold text-slate-400">
                          {topThree[1].contributionCount || 0} merged PRs
                        </p>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                      className="order-1 md:order-2 bg-gradient-to-b from-[#F7FEF2] via-white to-white rounded-3xl p-7 sm:p-8 border-2 border-[#54CE18]/70 shadow-lg shadow-[#54CE18]/12 flex flex-col items-center text-center relative overflow-visible md:-translate-y-4 group hover:shadow-xl transition-all"
                    >
                      <CrownBadge rank={1} />

                      <SparkleStar className="w-5 h-5 absolute top-8 left-8 opacity-75" fill="#54CE18" />
                      <SparkleStar className="w-4 h-4 absolute top-24 right-6 opacity-60" fill="#0D2A18" />
                      <SparkleStar className="w-3.5 h-3.5 absolute bottom-14 left-7 opacity-50" fill="#54CE18" />

                      <div className="relative mt-2 mb-3">
                        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#54CE18]/30 to-[#FBBF24]/30 blur-xs" />
                        <img
                          src={topThree[0].avatarUrl || `https://github.com/${topThree[0].githubUsername}.png`}
                          alt={topThree[0].githubUsername}
                          className="relative w-24 h-24 rounded-full border-4 border-[#FBBF24] ring-4 ring-[#54CE18]/30 shadow-md object-cover"
                        />
                      </div>

                      <span className="text-[10px] font-black uppercase tracking-wider text-[#1E6B08] bg-[#D7F7C2] border border-[#BCECA0] px-3.5 py-0.5 rounded-full mb-1">
                        CURRENT LEADER
                      </span>
                      <a
                        href={topThree[0].githubUrl || `https://github.com/${topThree[0].githubUsername}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-extrabold text-[#0B150F] text-lg mt-0.5 hover:text-emerald-700 hover:underline transition-colors block"
                        title={`View @${topThree[0].githubUsername} on GitHub`}
                      >
                        @{topThree[0].githubUsername}
                      </a>
                      <p className="text-4xl font-black text-[#0B150F] mt-1">
                        {topThree[0].totalPoints}{" "}
                        <span className="text-lg font-bold text-[#54CE18]">pts</span>
                      </p>

                      {data.mode === "automatic" ? (
                        <button
                          type="button"
                          onClick={() =>
                            openContributorHistory({
                              id: topThree[0].githubUserId,
                              username: topThree[0].githubUsername,
                              avatarUrl: topThree[0].avatarUrl,
                              points: topThree[0].totalPoints,
                              contributionCount: topThree[0].contributionCount,
                            })
                          }
                          className="mt-3 text-xs font-bold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition-colors group/btn"
                        >
                          <span>{topThree[0].contributionCount} merged PRs</span>
                          <ChevronRight
                            size={13}
                            className="group-hover/btn:translate-x-0.5 transition-transform"
                          />
                        </button>
                      ) : (
                        <p className="mt-2 text-xs font-semibold text-slate-400">
                          {topThree[0].contributionCount || 0} merged PRs
                        </p>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="order-3 bg-[#FFFDF9] rounded-3xl p-6 sm:p-7 border border-[#C67D48]/40 shadow-sm flex flex-col items-center text-center relative overflow-visible group hover:shadow-md transition-all"
                    >
                      <CrownBadge rank={3} />

                      <SparkleStar className="w-4 h-4 absolute top-10 right-6 opacity-35" fill="#C67D48" />
                      <SparkleStar className="w-3.5 h-3.5 absolute top-20 left-6 opacity-35" fill="#7A3E1D" />

                      <div className="relative mt-2 mb-3">
                        <img
                          src={topThree[2].avatarUrl || `https://github.com/${topThree[2].githubUsername}.png`}
                          alt={topThree[2].githubUsername}
                          className="w-20 h-20 rounded-full border-4 border-[#C67D48] ring-4 ring-[#C67D48]/20 shadow-sm object-cover"
                        />
                      </div>

                      <a
                        href={topThree[2].githubUrl || `https://github.com/${topThree[2].githubUsername}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-extrabold text-[#0B150F] text-base hover:text-emerald-700 hover:underline transition-colors block"
                        title={`View @${topThree[2].githubUsername} on GitHub`}
                      >
                        @{topThree[2].githubUsername}
                      </a>
                      <p className="text-3xl font-black text-[#0B150F] mt-1">
                        {topThree[2].totalPoints}{" "}
                        <span className="text-base font-bold text-slate-400">pts</span>
                      </p>

                      {data.mode === "automatic" ? (
                        <button
                          type="button"
                          onClick={() =>
                            openContributorHistory({
                              id: topThree[2].githubUserId,
                              username: topThree[2].githubUsername,
                              avatarUrl: topThree[2].avatarUrl,
                              points: topThree[2].totalPoints,
                              contributionCount: topThree[2].contributionCount,
                            })
                          }
                          className="mt-3 text-xs font-bold text-slate-500 hover:text-emerald-700 flex items-center gap-1 transition-colors group/btn"
                        >
                          <span>{topThree[2].contributionCount} merged PRs</span>
                          <ChevronRight
                            size={13}
                            className="group-hover/btn:translate-x-0.5 transition-transform"
                          />
                        </button>
                      ) : (
                        <p className="mt-2 text-xs font-semibold text-slate-400">
                          {topThree[2].contributionCount || 0} merged PRs
                        </p>
                      )}
                    </motion.div>
                  </div>
                )}

                {topThree.length === 2 && (
                  <div className="flex flex-col sm:flex-row items-center sm:items-end justify-center gap-6 max-w-2xl mx-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="w-full sm:w-1/2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col items-center text-center relative overflow-visible group hover:shadow-md transition-all"
                    >
                      <CrownBadge rank={2} />
                      <div className="relative mt-2 mb-3">
                        <img
                          src={topThree[1].avatarUrl || `https://github.com/${topThree[1].githubUsername}.png`}
                          alt={topThree[1].githubUsername}
                          className="w-20 h-20 rounded-full border-4 border-slate-200 ring-4 ring-slate-100 shadow-sm object-cover"
                        />
                      </div>
                      <a
                        href={topThree[1].githubUrl || `https://github.com/${topThree[1].githubUsername}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-extrabold text-[#0B150F] text-base hover:text-emerald-700 hover:underline transition-colors block"
                        title={`View @${topThree[1].githubUsername} on GitHub`}
                      >
                        @{topThree[1].githubUsername}
                      </a>
                      <p className="text-3xl font-black text-[#0B150F] mt-1">
                        {topThree[1].totalPoints}{" "}
                        <span className="text-base font-bold text-slate-400">pts</span>
                      </p>
                      {data.mode === "automatic" && (
                        <button
                          type="button"
                          onClick={() =>
                            openContributorHistory({
                              id: topThree[1].githubUserId,
                              username: topThree[1].githubUsername,
                              avatarUrl: topThree[1].avatarUrl,
                              points: topThree[1].totalPoints,
                              contributionCount: topThree[1].contributionCount,
                            })
                          }
                          className="mt-3 text-xs font-bold text-slate-500 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                        >
                          <span>{topThree[1].contributionCount} merged PRs</span>
                          <ChevronRight size={13} />
                        </button>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                      className="w-full sm:w-1/2 bg-gradient-to-b from-[#F7FEF2] via-white to-white rounded-3xl p-7 sm:p-8 border-2 border-[#54CE18]/70 shadow-lg shadow-[#54CE18]/12 flex flex-col items-center text-center relative overflow-visible sm:-translate-y-2 group hover:shadow-xl transition-all"
                    >
                      <CrownBadge rank={1} />
                      <div className="relative mt-2 mb-3">
                        <img
                          src={topThree[0].avatarUrl || `https://github.com/${topThree[0].githubUsername}.png`}
                          alt={topThree[0].githubUsername}
                          className="w-24 h-24 rounded-full border-4 border-[#FBBF24] ring-4 ring-[#54CE18]/30 shadow-md object-cover"
                        />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#1E6B08] bg-[#D7F7C2] border border-[#BCECA0] px-3.5 py-0.5 rounded-full mb-1">
                        CURRENT LEADER
                      </span>
                      <a
                        href={topThree[0].githubUrl || `https://github.com/${topThree[0].githubUsername}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-extrabold text-[#0B150F] text-lg mt-0.5 hover:text-emerald-700 hover:underline transition-colors block"
                        title={`View @${topThree[0].githubUsername} on GitHub`}
                      >
                        @{topThree[0].githubUsername}
                      </a>
                      <p className="text-4xl font-black text-[#0B150F] mt-1">
                        {topThree[0].totalPoints}{" "}
                        <span className="text-lg font-bold text-[#54CE18]">pts</span>
                      </p>
                      {data.mode === "automatic" && (
                        <button
                          type="button"
                          onClick={() =>
                            openContributorHistory({
                              id: topThree[0].githubUserId,
                              username: topThree[0].githubUsername,
                              avatarUrl: topThree[0].avatarUrl,
                              points: topThree[0].totalPoints,
                              contributionCount: topThree[0].contributionCount,
                            })
                          }
                          className="mt-3 text-xs font-bold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                        >
                          <span>{topThree[0].contributionCount} merged PRs</span>
                          <ChevronRight size={13} />
                        </button>
                      )}
                    </motion.div>
                  </div>
                )}

                {topThree.length === 1 && (
                  <div className="max-w-sm mx-auto">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-b from-[#F7FEF2] via-white to-white rounded-3xl p-8 border-2 border-[#54CE18]/70 shadow-lg shadow-[#54CE18]/12 flex flex-col items-center text-center relative overflow-visible"
                    >
                      <CrownBadge rank={1} />
                      <div className="relative mt-2 mb-3">
                        <img
                          src={topThree[0].avatarUrl || `https://github.com/${topThree[0].githubUsername}.png`}
                          alt={topThree[0].githubUsername}
                          className="w-24 h-24 rounded-full border-4 border-[#FBBF24] ring-4 ring-[#54CE18]/30 shadow-md object-cover"
                        />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#1E6B08] bg-[#D7F7C2] border border-[#BCECA0] px-3.5 py-0.5 rounded-full mb-1">
                        CURRENT LEADER
                      </span>
                      <a
                        href={topThree[0].githubUrl || `https://github.com/${topThree[0].githubUsername}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-extrabold text-[#0B150F] text-lg mt-0.5 hover:text-emerald-700 hover:underline transition-colors block"
                        title={`View @${topThree[0].githubUsername} on GitHub`}
                      >
                        @{topThree[0].githubUsername}
                      </a>
                      <p className="text-4xl font-black text-[#0B150F] mt-1">
                        {topThree[0].totalPoints}{" "}
                        <span className="text-lg font-bold text-[#54CE18]">pts</span>
                      </p>
                      {data.mode === "automatic" && (
                        <button
                          type="button"
                          onClick={() =>
                            openContributorHistory({
                              id: topThree[0].githubUserId,
                              username: topThree[0].githubUsername,
                              avatarUrl: topThree[0].avatarUrl,
                              points: topThree[0].totalPoints,
                              contributionCount: topThree[0].contributionCount,
                            })
                          }
                          className="mt-3 text-xs font-bold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                        >
                          <span>{topThree[0].contributionCount} merged PRs</span>
                          <ChevronRight size={13} />
                        </button>
                      )}
                    </motion.div>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2.5 sm:space-y-3 pt-2">
              {filteredEntries.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center text-slate-400 text-sm">
                  No participants matching your search query.
                </div>
              ) : (
                /* When searching, show all matching entries; otherwise show ranks 4+ */
                (searchQuery ? filteredEntries : remainingEntries).map((item, idx) => {
                  const rank = item.rank || (searchQuery ? idx + 1 : idx + 4);
                  return (
                    <motion.div
                      key={item.id || item.githubUserId || item.githubUsername}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.02 * idx }}
                      onClick={() =>
                        data.mode === "automatic" &&
                        openContributorHistory({
                          id: item.githubUserId,
                          username: item.githubUsername,
                          avatarUrl: item.avatarUrl,
                          points: item.totalPoints,
                          contributionCount: item.contributionCount,
                        })
                      }
                      className={`bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300/80 transition-all flex items-center justify-between overflow-hidden group ${
                        data.mode === "automatic" ? "cursor-pointer" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2.5 sm:gap-4 pl-3.5 sm:pl-6 py-2.5 sm:py-3.5 min-w-0 flex-1">
                        <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#131F17] text-white font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-xs">
                          {rank}
                        </div>

                        <img
                          src={item.avatarUrl || `https://github.com/${item.githubUsername}.png`}
                          alt={item.githubUsername}
                          className="w-8 h-8 sm:w-11 sm:h-11 rounded-full border border-slate-200 object-cover shrink-0"
                        />

                        <div className="min-w-0 flex-1 pr-1 sm:pr-2">
                          <a
                            href={item.githubUrl || `https://github.com/${item.githubUsername}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="font-extrabold text-xs sm:text-base text-[#0B150F] hover:text-emerald-700 hover:underline transition-colors block truncate"
                            title={`View @${item.githubUsername} on GitHub`}
                          >
                            @{item.githubUsername}
                          </a>

                          <p className="text-[10px] sm:text-xs text-slate-400 font-medium truncate">
                            {item.contributionCount || 0}{" "}
                            {item.contributionCount === 1
                              ? "merged contribution"
                              : "merged contributions"}
                          </p>
                        </div>
                      </div>

                      <div
                        className="self-stretch bg-gradient-to-r from-[#173F23] to-[#0A1B10] text-white flex items-center justify-end pl-5 sm:pl-10 pr-3 sm:pr-6 w-24 sm:w-44 md:w-56 shrink-0 transition-all group-hover:from-[#1E522E] group-hover:to-[#0D2416]"
                        style={{
                          clipPath: "polygon(18px 0, 100% 0, 100% 100%, 0% 100%)",
                        }}
                      >
                        <div className="flex items-center gap-1 sm:gap-2">
                          <span className="text-sm sm:text-xl md:text-2xl font-black text-white">
                            {item.totalPoints}
                          </span>
                          <span className="text-[10px] sm:text-xs font-bold text-emerald-300">
                            pts
                          </span>
                          <ChevronRight
                            size={15}
                            className="text-emerald-300/80 group-hover:translate-x-0.5 transition-transform ml-0.5 hidden sm:block"
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {mounted &&
          typeof document !== "undefined" &&
          createPortal(
            <AnimatePresence>
              {selectedUser && (
                <motion.div
                  key="contributor-modal-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  onClick={() => setSelectedUser(null)}
                  className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
                >
                  <motion.div
                    key="contributor-modal-dialog"
                    initial={{ scale: 0.95, opacity: 0, y: 12 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 12 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden max-h-[85vh] flex flex-col border border-slate-200 relative opacity-100"
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#0D2A18] via-[#091F11] to-[#06140A] text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={selectedUser.avatarUrl || `https://github.com/${selectedUser.username}.png`}
                          alt={selectedUser.username}
                          className="w-12 h-12 rounded-full border-2 border-[#54CE18] object-cover shadow-sm bg-slate-900"
                        />
                        <div>
                          <h3 className="font-extrabold text-white text-base">
                            @{selectedUser.username}
                          </h3>
                          <p className="text-xs font-bold text-emerald-400">
                            {selectedUser.points} Total Points Earned
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedUser(null)}
                        aria-label="Close dialog"
                        className="p-1.5 text-slate-300 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {/* Modal Content with solid white opaque background */}
                    <div
                      className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-3 bg-white opacity-100"
                      style={{ backgroundColor: "#ffffff" }}
                    >
                      {loadingContribs ? (
                        <div className="py-12 text-center text-xs text-slate-400">
                          Loading contribution records...
                        </div>
                      ) : userContributions.length === 0 ? (
                        <div className="py-12 text-center text-xs text-slate-400">
                          No individual PR records found.
                        </div>
                      ) : (
                        userContributions.map((contrib) => (
                          <a
                            key={contrib.githubPRId}
                            href={contrib.prUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="block p-3.5 rounded-2xl border border-slate-200 bg-[#FAFCF8] hover:bg-[#F0F9ED] hover:border-[#BDEAA6] transition-all group shadow-2xs"
                            style={{ backgroundColor: "#fafcf8" }}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 flex items-center gap-1.5 truncate">
                                <GitPullRequest size={14} className="text-[#34A853] shrink-0" />
                                #{contrib.prNumber} {contrib.prTitle}
                              </span>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                                  contrib.difficulty === "easy"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : contrib.difficulty === "medium"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {contrib.difficulty === "easy"
                                  ? "Level 1"
                                  : contrib.difficulty === "medium"
                                  ? "Level 2"
                                  : "Level 3"}{" "}
                                (+{contrib.points})
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 font-medium">
                              Merged on {new Date(contrib.mergedAt).toLocaleDateString()}
                            </p>
                          </a>
                        ))
                      )}
                    </div>

                    {/* Modal Footer with solid background */}
                    <div
                      className="p-4 border-t border-slate-200 flex justify-end bg-slate-50 shrink-0"
                      style={{ backgroundColor: "#f8fafc" }}
                    >
                      <button
                        onClick={() => setSelectedUser(null)}
                        className="px-5 py-2 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>,
            document.body
          )}
      </div>
    </main>
  );
}
