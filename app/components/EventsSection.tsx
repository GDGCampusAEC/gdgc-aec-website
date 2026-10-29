"use client";

import { motion } from "framer-motion";
import { Calendar, ArrowUpRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function EventsSection() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [debugError, setDebugError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events");

        // Check 1: Did the server actually respond with 200 OK?
        if (!res.ok) {
          throw new Error(`Server returned status: ${res.status}`);
        }

        // Check 2: Are we getting HTML (an error page) instead of JSON?
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("API didn't return JSON. Check your /api/events/route.ts file!");
        }

        const data = await res.json();

        // Check 3: Is the data actually an array? 
        // (Sometimes backend returns { events: [...] } instead of [...])
        if (Array.isArray(data)) {
          setEvents(data);
        } else if (data.events && Array.isArray(data.events)) {
          setEvents(data.events); // Failsafe if your API nests the data
        } else {
          throw new Error("Data from API is not an array");
        }

      } catch (error: any) {
        console.error("Diagnostic Error:", error.message);
        setDebugError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
  };

  return (
    <section id="events" className="relative w-full max-w-7xl mx-auto px-4 py-24 bg-[#FDFBF7] z-30">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2">Upcoming Events</h2>
          <p className="text-gray-500 font-medium">Join us to learn, build, and connect.</p>
        </div>
        <Link href="#gallery" className="hidden md:flex items-center gap-1 font-bold text-[#0f9d58] hover:underline">
          View Past Gallery <ArrowUpRight className="w-5 h-5" />
        </Link>
      </div>

      {/* DIAGNOSTIC ERROR DISPLAY (Only shows if something breaks) */}
      {debugError && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 font-medium text-sm">
          <AlertCircle size={18} />
          API Connection Error: {debugError}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col gap-4">
          {/* Skeleton Loader for Premium Feel */}
          <div className="h-48 bg-gray-100 animate-pulse rounded-2xl w-full max-w-sm" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-gray-500 py-12 font-medium bg-white border-2 border-dashed border-gray-200 rounded-2xl text-center w-full">
          No upcoming events scheduled at the moment. Check back soon!
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {events.map((event) => (
            <Link
              key={event._id || event.id || event.slug}
              href={`/events/${event.slug}`}
              className="block"
            >
              <motion.div
                variants={item}
                className="relative h-full group bg-white border-2 border-gray-900 rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className={`inline-block px-3 py-1 text-xs font-bold text-white rounded-full mb-4 ${event.tagColor || 'bg-[#0f9d58]'}`}>
                    {event.tag || (event.tags && event.tags[0]) || 'Event'}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 leading-tight mb-3">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    {event.desc || event.description || 'No description provided.'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                    <Calendar className="w-4 h-4 text-gray-900" />
                    {event.date}
                  </div>
                  <div className="bg-gray-100 group-hover:bg-[#0f9d58] group-hover:text-white text-gray-900 w-8 h-8 rounded-full flex items-center justify-center transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      )}
    </section>
  );
}