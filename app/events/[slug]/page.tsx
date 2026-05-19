"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, MapPin, Clock, ArrowLeft, Share2, 
  Users, Sparkles, Ticket, ArrowUpRight, ChevronRight,
  Check, AlertCircle, Camera
} from "lucide-react";
import { isEventUpcoming } from "@/lib/dateUtils";
import CinematicLightbox from "@/app/components/CinematicLightbox";

interface EventData {
  id?: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  tag?: string;
  tags?: string[];
  tagColor?: string;
  image?: string;
  description?: string;
  desc?: string;
  longDescription?: string;
  gallery?: string[];
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const swipeVariants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.85,
      filter: "blur(12px)",
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      x: { type: "spring" as any, stiffness: 300, damping: 30 },
      opacity: { duration: 0.3 },
      scale: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as any },
      filter: { duration: 0.4 }
    }
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.85,
      filter: "blur(12px)",
      transition: {
        x: { type: "spring" as any, stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.4 },
        filter: { duration: 0.4 }
      }
    };
  }
};

export default function EventDetailPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    async function fetchEvent() {
      if (!slug) return;
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/events/${slug}`, { signal: abortController.signal });
        if (!res.ok) throw new Error(res.status === 404 ? "Event not found" : `Server error`);
        const data = await res.json();
        if (!abortController.signal.aborted) setEvent(data);
      } catch (err: any) {
        if (err.name !== 'AbortError') setError(err.message === "Event not found" ? err.message : "Failed to load event details.");
      } finally {
        if (!abortController.signal.aborted) setLoading(false);
      }
    }
    fetchEvent();
    return () => abortController.abort();
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === "ArrowRight") navigateGallery(1);
      if (e.key === "ArrowLeft") navigateGallery(-1);
      if (e.key === "Escape") {
        setSelectedImageIndex(null);
        setDirection(0);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    
    if (selectedImageIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedImageIndex]);

  const activeEvent = event ? {
    title: event.title,
    tag: event.tag || (event.tags && event.tags[0]) || "Featured Event",
    date: event.date,
    time: event.time || "TBA",
    location: event.location || "AEC Campus",
    address: event.location || "Asansol Engineering College, Vivekananda Sarani",
    description: event.longDescription || event.description || event.desc || "Join us for an immersive tech event designed to explore, build, and connect with like-minded developers and industry peers.",
    host: { name: "GDGC AEC", role: "Organizer", initials: "GD" },
    speakers: [
      { name: "Dr. Sarah Chen", role: "AI Researcher", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" },
      { name: "Marcus Doe", role: "Cloud Architect", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" }
    ],
    gallery: event.gallery && event.gallery.length > 0 ? event.gallery : [
      event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
    ]
  } : null;

  const navigateGallery = (newDirection: number) => {
    if (selectedImageIndex === null || !activeEvent) return;
    setDirection(newDirection);
    let nextIndex = selectedImageIndex + newDirection;
    if (nextIndex >= activeEvent.gallery.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = activeEvent.gallery.length - 1;
    setSelectedImageIndex(nextIndex);
  };

  const openGallery = (index: number) => {
    setDirection(0);
    setSelectedImageIndex(index);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F9] flex justify-center items-center">
        <div className="w-16 h-16 border-[4px] border-black/10 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !activeEvent) {
    return (
      <div className="min-h-screen bg-[#F7F7F9] flex flex-col items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-lg">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-6" />
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Event Unavailable</h1>
          <p className="text-gray-500 font-medium mb-10">{error || "This event seems to have vanished."}</p>
          <button onClick={() => router.back()} className="px-8 py-4 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-colors">
            Return to Directory
          </button>
        </motion.div>
      </div>
    );
  }

  const isUpcoming = isEventUpcoming(activeEvent.date, activeEvent.tag);
  const tagColor = event?.tagColor || '#2563eb';

  return (
    <main className="min-h-screen bg-[#F7F7F9] text-gray-900 font-sans selection:bg-blue-200 selection:text-blue-900 pb-32">
      
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
      </div>

      <nav className="fixed top-6 left-0 right-0 z-40 px-6 pointer-events-none">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => router.back()}
            className="pointer-events-auto flex items-center gap-2 px-5 py-3 bg-white/80 backdrop-blur-xl border border-black/5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-sm font-medium hover:scale-105 transition-transform duration-300"
          >
            <ArrowLeft size={16} /> Back
          </button>
          
          <button 
            onClick={handleShare}
            className="pointer-events-auto flex items-center gap-2 px-5 py-3 bg-white/80 backdrop-blur-xl border border-black/5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-sm font-medium hover:scale-105 transition-all duration-300 w-28 justify-center"
          >
            {isCopied ? (
              <><Check size={16} className="text-green-600" /> <span className="text-green-600">Copied!</span></>
            ) : (
              <><Share2 size={16} /> Share</>
            )}
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-32 lg:pt-40 relative z-10">
        
        <motion.header 
          variants={staggerContainer} initial="hidden" animate="visible"
          className="mb-16 lg:mb-24"
        >
          <motion.div 
            variants={fadeUp} 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold tracking-wide uppercase mb-8 border"
            style={{ 
              borderColor: `${tagColor}25`, 
              backgroundColor: `${tagColor}10`, 
              color: tagColor 
            }}
          >
            <Sparkles size={16} />
            {activeEvent.tag}
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter leading-[0.95] max-w-4xl text-black">
            {activeEvent.title}
          </motion.h1>
        </motion.header>

        <motion.div 
          variants={staggerContainer} initial="hidden" animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-24"
        >
          <motion.div 
            variants={fadeUp} 
            onClick={() => openGallery(0)}
            className="md:col-span-2 md:row-span-2 rounded-[2rem] overflow-hidden relative group h-[400px] md:h-full cursor-pointer"
          >
            <img src={activeEvent.gallery[0]} alt="Event hero" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100 transition-opacity duration-300 group-hover:opacity-90" />
            
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/20 backdrop-blur-md rounded-full p-4 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                <Ticket className="text-white" size={32} />
              </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white/80 uppercase tracking-wider mb-1">Status</p>
                  {isUpcoming ? (
                    <p className="font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Spots Available
                    </p>
                  ) : (
                    <p className="font-semibold flex items-center gap-2 text-red-200">
                      <span className="w-2 h-2 rounded-full bg-red-400" /> Event Completed
                    </p>
                  )}
                </div>
                {isUpcoming && <ArrowUpRight className="text-white/50 group-hover:text-white transition-colors" size={24} />}
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="md:col-span-1 lg:col-span-2 bg-white rounded-[2rem] p-8 border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-start justify-between mb-8">
              <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center text-gray-900 border border-gray-100">
                <Calendar size={24} />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">When</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{activeEvent.date}</h3>
              <p className="text-gray-500 font-medium flex items-center gap-2"><Clock size={16}/> {activeEvent.time}</p>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="md:col-span-1 lg:col-span-1 bg-gray-900 text-white rounded-[2rem] p-8 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full" />
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-white border border-white/10 mb-8 relative z-10">
              <MapPin size={24} />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Where</p>
              <h3 className="text-xl font-bold mb-1">{activeEvent.location}</h3>
              <p className="text-gray-400 font-medium text-sm leading-relaxed">{activeEvent.address}</p>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="md:col-span-2 lg:col-span-1 bg-white rounded-[2rem] p-8 border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                {activeEvent.host.initials}
              </div>
              <div>
                <p className="font-bold text-gray-900">{activeEvent.host.name}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{activeEvent.host.role}</p>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-100">
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Featuring</p>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-3">
                  {activeEvent.speakers.map((speaker, i) => (
                    <img key={i} src={speaker.img} alt={speaker.name} className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" />
                  ))}
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 text-gray-400">
                  <Users size={16} />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="lg:col-span-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">About the Experience</h2>
            <p className="text-xl text-gray-600 leading-relaxed font-medium whitespace-pre-line">
              {activeEvent.description}
            </p>
          </motion.div>
        </div>

        {activeEvent.gallery.length > 1 && (
          <motion.section 
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mb-20"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">Visuals</h2>
                <p className="text-gray-500 font-medium">Glimpses into the experience.</p>
              </div>
              <div className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest bg-white px-4 py-2 rounded-full shadow-sm border border-gray-50">
                <Camera size={16} /> {activeEvent.gallery.length} Shots
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {activeEvent.gallery.map((img: string, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: idx * 0.05 }}
                  onClick={() => openGallery(idx)}
                  className={`group relative cursor-pointer overflow-hidden rounded-[2rem] bg-gray-100 ${idx === 0 || idx === 3 ? 'md:col-span-2 aspect-[2/1]' : 'aspect-square'}`}
                >
                  <img
                    src={img} alt={`Gallery ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gray-900/0 group-hover:bg-gray-900/10 transition-colors duration-500 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 ease-out shadow-xl">
                      <Sparkles size={20} className="text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      <AnimatePresence>
        {isScrolled && isUpcoming && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-8 left-0 right-0 z-30 flex justify-center px-6 pointer-events-none"
          >
            <div className="pointer-events-auto bg-gray-900 text-white rounded-full p-2 pl-6 md:pl-8 flex items-center gap-6 shadow-[0_20px_40px_rgb(0,0,0,0.2)] border border-white/10 max-w-lg w-full justify-between">
              <div className="flex flex-col hidden sm:block">
                <p className="text-sm font-medium text-gray-300">Ready to join?</p>
                <p className="text-xs font-semibold text-white/50">{activeEvent.date}</p>
              </div>
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-sm hover:scale-[1.02] active:scale-95 transition-all">
                RSVP Now <ArrowUpRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CinematicLightbox
        isOpen={selectedImageIndex !== null}
        images={activeEvent.gallery}
        currentIndex={selectedImageIndex}
        onClose={() => setSelectedImageIndex(null)}
        onSelectIndex={(idx) => setSelectedImageIndex(idx)}
        onPrev={() => navigateGallery(-1)}
        onNext={() => navigateGallery(1)}
      />

    </main>
  );
}