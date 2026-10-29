"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  ArrowUpRight,
  AlertCircle,
  Search,
  Download,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { generateGoogleCalendarUrl, downloadIcsFile } from "@/lib/calendar";

interface EventItem {
  _id?: string;
  id?: string;
  slug: string;
  title: string;
  desc?: string;
  description?: string;
  date: string;
  tag?: string;
  tags?: string[];
  tagColor?: string;
  category?: string;
  speaker?: string;
  location?: string;
  isPast?: boolean;
}

const DEFAULT_EVENTS: EventItem[] = [
  {
    slug: "cloud-community-day-2025",
    title: "Google Cloud Community Day",
    desc: "Hands-on workshops on Vertex AI, Gemini APIs, Kubernetes, and Cloud Run architecture with industry cloud architects.",
    date: "November 15, 2026",
    tag: "Workshops",
    category: "Workshops",
    tagColor: "bg-[#4285f4]",
    speaker: "Google Cloud Advocates",
    location: "AEC Seminar Hall 1",
    isPast: false,
  },
  {
    slug: "winter-hackathon-2026",
    title: "Open Orbit Hackathon 2026",
    desc: "48-hour open-source sprint bringing campus engineers together to build real-world AI and web solutions.",
    date: "December 05, 2026",
    tag: "Hackathons",
    category: "Hackathons",
    tagColor: "bg-[#db4437]",
    speaker: "GDGC AEC Mentors",
    location: "Tech Innovation Lab",
    isPast: false,
  },
  {
    slug: "android-compose-camp",
    title: "Modern Android with Jetpack Compose",
    desc: "Master declarative UI programming and reactive state flows in Kotlin for production mobile apps.",
    date: "December 20, 2026",
    tag: "Workshops",
    category: "Workshops",
    tagColor: "bg-[#0f9d58]",
    speaker: "Mobile Dev Leads",
    location: "Virtual & Lab 3",
    isPast: false,
  },
  {
    slug: "compose-camp-kickoff",
    title: "Campus Compose Camp Kickoff",
    desc: "Introduction to Android development fundamentals and modern Google developer tools for beginners.",
    date: "September 18, 2026",
    tag: "Workshops",
    category: "Past",
    tagColor: "bg-[#f4b400]",
    speaker: "Core Team",
    location: "Auditorium",
    isPast: true,
  },
];

const CATEGORIES = ["All", "Upcoming", "Past", "Workshops", "Hackathons"] as const;

export default function EventsSection() {
  const [events, setEvents] = useState<EventItem[]>(DEFAULT_EVENTS);
  const [loading, setLoading] = useState(true);
  const [debugError, setDebugError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [rsvpdEvents, setRsvpdEvents] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events");
        if (!res.ok) {
          throw new Error(`Server returned status: ${res.status}`);
        }

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("API didn't return JSON.");
        }

        const data = await res.json();
        const rawEvents = Array.isArray(data) ? data : data.events && Array.isArray(data.events) ? data.events : [];
        if (rawEvents.length > 0) {
          setEvents(rawEvents);
        }
      } catch (error: unknown) {
        const err = error as Error;
        console.warn("Using default events fallback:", err?.message);
        setDebugError(null);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const q = searchQuery.toLowerCase().trim();
      const titleMatch = ev.title.toLowerCase().includes(q);
      const descMatch = (ev.desc || ev.description || "").toLowerCase().includes(q);
      const speakerMatch = (ev.speaker || "").toLowerCase().includes(q);
      const tagMatch = (ev.tag || (ev.tags && ev.tags.join(" ")) || "").toLowerCase().includes(q);
      const matchesSearch = !q || titleMatch || descMatch || speakerMatch || tagMatch;

      if (!matchesSearch) return false;

      if (activeCategory === "All") return true;
      if (activeCategory === "Upcoming") return !ev.isPast;
      if (activeCategory === "Past") return Boolean(ev.isPast);
      if (activeCategory === "Workshops") {
        return (
          ev.category?.toLowerCase() === "workshops" ||
          ev.tag?.toLowerCase().includes("workshop") ||
          (ev.tags && ev.tags.some((t) => t.toLowerCase().includes("workshop")))
        );
      }
      if (activeCategory === "Hackathons") {
        return (
          ev.category?.toLowerCase() === "hackathons" ||
          ev.tag?.toLowerCase().includes("hackathon") ||
          (ev.tags && ev.tags.some((t) => t.toLowerCase().includes("hackathon")))
        );
      }
      return true;
    });
  }, [events, searchQuery, activeCategory]);

  const toggleRsvp = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRsvpdEvents((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  const handleExportIcs = (event: EventItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    downloadIcsFile({
      title: event.title,
      description: event.desc || event.description,
      location: event.location,
      date: event.date,
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120 } },
  };

  return (
    <section id="events" className="relative w-full max-w-7xl mx-auto px-4 py-16 sm:py-24 bg-[#FDFBF7] z-30">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#4285f4] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full inline-block mb-3">
            Community Calendar & Activities
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2">Events & Workshops</h2>
          <p className="text-gray-500 font-medium">Join us to learn, build, network, and grow.</p>
        </div>
        <Link
          href="/gallery"
          className="flex items-center gap-1 font-bold text-[#0f9d58] hover:underline shrink-0"
        >
          View Past Gallery <ArrowUpRight className="w-5 h-5" />
        </Link>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center mb-8">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeCategory === cat
                  ? "bg-gray-900 text-white shadow-sm"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search topic or speaker..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-full text-xs sm:text-sm focus:outline-none focus:border-gray-900 transition-colors"
          />
        </div>
      </div>

      {/* DIAGNOSTIC ERROR DISPLAY */}
      {debugError && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 font-medium text-sm">
          <AlertCircle size={18} />
          API Connection: {debugError}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-2xl w-full" />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-gray-500 py-16 font-medium bg-white border-2 border-dashed border-gray-200 rounded-2xl text-center w-full">
          No events match the selected criteria. Try adjusting your search query or category filter!
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredEvents.map((event) => {
            const isRsvpd = Boolean(rsvpdEvents[event.slug]);
            const gcalUrl = generateGoogleCalendarUrl({
              title: event.title,
              description: event.desc || event.description,
              location: event.location,
              date: event.date,
            });

            return (
              <motion.div
                variants={item}
                key={event._id || event.id || event.slug}
                className="relative h-full group bg-white border-2 border-gray-900 rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-bold text-white rounded-full ${
                        event.tagColor || "bg-[#0f9d58]"
                      }`}
                    >
                      {event.tag || (event.tags && event.tags[0]) || "Event"}
                    </span>
                    {event.location && (
                      <span className="text-[11px] font-semibold text-gray-500 truncate max-w-[140px]">
                        {event.location}
                      </span>
                    )}
                  </div>

                  <Link href={`/events/${event.slug}`} className="block group-hover:underline">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2">
                      {event.title}
                    </h3>
                  </Link>

                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {event.desc || event.description || "No description provided."}
                  </p>

                  {event.speaker && (
                    <p className="text-xs text-gray-500 font-medium mb-4">
                      <span className="font-semibold text-gray-700">Speaker:</span> {event.speaker}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100 mt-auto flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                      <Calendar className="w-4 h-4 text-gray-900 shrink-0" />
                      <span>{event.date}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <a
                        href={gcalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="Add to Google Calendar"
                        className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors text-xs inline-flex items-center gap-1 font-semibold"
                      >
                        <Calendar size={13} />
                        <span className="hidden sm:inline">Google Cal</span>
                      </a>
                      <button
                        type="button"
                        onClick={(e) => handleExportIcs(event, e)}
                        title="Download .ics Calendar File"
                        className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors text-xs inline-flex items-center gap-1 font-semibold"
                      >
                        <Download size={13} />
                        <span className="hidden sm:inline">.ICS</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={(e) => toggleRsvp(event.slug, e)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border-2 ${
                        isRsvpd
                          ? "bg-green-50 border-[#0f9d58] text-[#0f9d58]"
                          : "bg-gray-900 border-gray-900 text-white hover:bg-gray-800"
                      }`}
                    >
                      {isRsvpd ? (
                        <>
                          <CheckCircle size={14} /> RSVP Confirmed
                        </>
                      ) : (
                        "Quick RSVP"
                      )}
                    </button>
                    <Link
                      href={`/events/${event.slug}`}
                      className="px-3 py-2 rounded-xl border-2 border-gray-200 text-gray-700 hover:border-gray-900 text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      Details <ArrowUpRight size={13} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </section>
  );
}