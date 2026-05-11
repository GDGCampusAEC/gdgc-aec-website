"use client";

import { motion } from "framer-motion";
import { Calendar, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function EventsSection() {

  const events = [
    {
      id: "firebase-kickoff",
      title: "Firebase Cloud & Serverless Bootcamp",
      date: "March 15, 2026",
      tag: "Workshop",
      tagColor: "bg-[#f4b400]",
      desc: "Learn how to build scalable backends with Firestore and Next.js.",
    },
    {
      id: "new",
      title: "Hackathon",
      date: "April 2, 2026",
      tag: "Hackathon",
      tagColor: "bg-[#4285f4]",
      desc: "Build, collaborate, and win prizes in our flagship campus hackathon.",
    },
    {
      id: "ui-ux-figma",
      title: "Mastering UI/UX with Figma",
      date: "April 20, 2026",
      tag: "Design",
      tagColor: "bg-[#db4437]",
      desc: "A hands-on session on creating wireframes and interactive prototypes.",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
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

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {events.map((event) => (
          <motion.div
            key={event.id}
            variants={item}
            className="relative group bg-white border-2 border-gray-900 rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:-translate-y-1"
          >

            <div className={`inline-block px-3 py-1 text-xs font-bold text-white rounded-full mb-4 ${event.tagColor}`}>
              {event.tag}
            </div>

            <h3 className="text-xl font-bold text-gray-900 leading-tight mb-3">
              {event.title}
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              {event.desc}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                <Calendar className="w-4 h-4 text-gray-900" />
                {event.date}
              </div>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-900 w-8 h-8 rounded-full flex items-center justify-center transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

    </section>
  );
}