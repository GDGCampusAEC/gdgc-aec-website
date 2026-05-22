"use client";

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, Camera, Calendar, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

const defaultPhotos = [
  { id: "1", src: "/assets/event-1.jpg", title: "Workshop Sessions", size: "md:col-span-2 md:row-span-2", eventSlug: "cloud-craft-workshop" },
  { id: "2", src: "/assets/event-2.jpg", title: "Hackathon 2026", size: "col-span-1", eventSlug: "aec-hack-2026" },
  { id: "3", src: "/assets/event-3.jpg", title: "Keynote Speakers", size: "col-span-1", eventSlug: "google-dev-keynote" },
  { id: "4", src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop", title: "Tech Talk", size: "md:col-span-2", eventSlug: "cloud-craft-workshop" },
  { id: "5", src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop", title: "Networking", size: "col-span-1", eventSlug: "google-dev-keynote" },
  { id: "6", src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop", title: "Community Meetup", size: "col-span-1", eventSlug: "aec-hack-2026" },
  { id: "7", src: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop", title: "Innovation Lab", size: "col-span-1", eventSlug: "cloud-craft-workshop" },
  { id: "8", src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop", title: "Design Sprint", size: "col-span-1", eventSlug: "aec-hack-2026" },
];

function PerspectiveCard({ photo, linkedEvent, onClick }: { photo: any, linkedEvent: any, onClick: () => void }) {
  const router = useRouter();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
      className={`relative cursor-pointer group rounded-[2rem] bg-gray-900 overflow-hidden shadow-xl transition-shadow hover:shadow-2xl ${photo.size || "col-span-1"}`}
    >
      <div style={{ transform: "translateZ(50px)" }} className="absolute inset-0 z-20 pointer-events-none p-6 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <p className="text-[10px] font-black text-[#0f9d58] uppercase tracking-[0.2em] mb-1">
          {linkedEvent ? (linkedEvent.tag || "GDGC Event") : "GDGC Archive"}
        </p>
        <h3 className="text-xl font-black text-white uppercase leading-tight mb-1">{photo.title}</h3>
        {linkedEvent && (
          <p className="text-[11px] font-medium text-white/70 italic mb-2 line-clamp-1">
            Linked: {linkedEvent.title}
          </p>
        )}
        <div className="mt-2 flex items-center justify-between">
          <span className="flex items-center gap-2 text-white/80 text-[10px] font-bold bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
            <Calendar size={12} /> {linkedEvent ? linkedEvent.date : "2026"}
          </span>
          {linkedEvent && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/events/${linkedEvent.slug}`);
              }}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black shadow-lg pointer-events-auto hover:scale-110 active:scale-95 transition-transform duration-200"
              title="Explore Event details"
            >
              <ArrowUpRight size={20} />
            </div>
          )}
        </div>
      </div>

      <motion.img
        src={photo.src}
        alt={photo.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
      />
    </motion.div>
  );
}

export default function GallerySection() {
  const router = useRouter();
  const [photos, setPhotos] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [galleryRes, eventsRes] = await Promise.all([
          fetch("/api/gallery", { cache: "no-store" }),
          fetch("/api/events", { cache: "no-store" })
        ]);
        let galleryData = [];
        let eventsData = [];
        if (galleryRes.ok) galleryData = await galleryRes.json();
        if (eventsRes.ok) eventsData = await eventsRes.json();

        setEvents(eventsData);
        if (galleryData && galleryData.length > 0) {
          setPhotos(galleryData);
        } else {
          setPhotos(defaultPhotos);
        }
      } catch (err) {
        console.error("Failed to load gallery/events", err);
        setPhotos(defaultPhotos);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const selectedEvent = selected ? events.find(e => e.slug === selected.eventSlug) : null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-32">
      <div className="mb-24 flex flex-col items-center text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} className="w-12 h-12 rounded-2xl bg-[#0f9d58]/10 flex items-center justify-center text-[#0f9d58] mb-6">
          <Camera size={24} />
        </motion.div>
        <h2 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter mb-6">
          THE <span className="text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-500">VAULT.</span>
        </h2>
        <p className="text-gray-400 font-bold uppercase tracking-[0.4em] text-[10px]">
          Visual History of GDGC AEC
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-black/10 border-t-[#0f9d58] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-auto md:h-[800px] perspective-[1000px]">
          {photos.map((photo, index) => {
            const linkedEvent = events.find(e => e.slug === photo.eventSlug);
            return (
              <PerspectiveCard
                key={photo.id || index}
                photo={photo}
                linkedEvent={linkedEvent}
                onClick={() => setSelected(photo)}
              />
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6 backdrop-blur-xl">
            <button className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors"><X size={40} /></button>

            <div className="max-w-5xl w-full flex flex-col items-center">
              <motion.img initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} src={selected.src} className="w-full h-auto max-h-[60vh] object-contain rounded-3xl shadow-2xl border border-white/10" />
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="mt-8 text-center flex flex-col items-center gap-4">
                <div>
                  <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2">{selected.title}</h2>
                  {selectedEvent && (
                    <p className="text-[#0f9d58] font-bold uppercase tracking-wider text-sm">
                      Event: <span className="text-white">{selectedEvent.title}</span>
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-center gap-4">
                  <div className="h-[2px] w-12 bg-[#0f9d58]" />
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                    {selectedEvent ? selectedEvent.date : "AEC Chapter Event"}
                  </p>
                  <div className="h-[2px] w-12 bg-[#0f9d58]" />
                </div>

                {selectedEvent && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(null);
                      router.push(`/events/${selectedEvent.slug}`);
                    }}
                    className="mt-4 px-8 py-3 bg-[#0f9d58] text-white font-bold rounded-full hover:bg-[#0b703e] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    Explore Event Details <ArrowUpRight size={18} />
                  </button>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}