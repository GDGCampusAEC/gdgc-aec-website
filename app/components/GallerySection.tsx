"use client";

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { X, Maximize2, Camera, Calendar, ArrowUpRight } from "lucide-react";

const photos = [
  { id: 1, src: "/assets/event-1.jpg", title: "Workshop Sessions", color: "#4285f4", size: "md:col-span-2 md:row-span-2" },
  { id: 2, src: "/assets/event-2.jpg", title: "Hackathon 2026", color: "#db4437", size: "col-span-1" },
  { id: 3, src: "/assets/event-3.jpg", title: "Keynote Speakers", color: "#f4b400", size: "col-span-1" },
  { id: 4, src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop", title: "Tech Talk", color: "#0f9d58", size: "md:col-span-2" },
  { id: 5, src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop", title: "Networking", color: "#4285f4", size: "col-span-1" },
  { id: 6, src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop", title: "Community Meetup", color: "#db4437", size: "col-span-1" },
  { id: 7, src: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop", title: "Innovation Lab", color: "#f4b400", size: "col-span-1" },
  { id: 8, src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop", title: "Design Sprint", color: "#0f9d58", size: "col-span-1" },
];

function PerspectiveCard({ photo, onClick }: { photo: any, onClick: () => void }) {
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
      className={`relative cursor-pointer group rounded-[2rem] bg-gray-900 overflow-hidden shadow-xl transition-shadow hover:shadow-2xl ${photo.size}`}
    >
      <div style={{ transform: "translateZ(50px)" }} className="absolute inset-0 z-20 pointer-events-none p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-1">GDGC Archive</p>
        <h3 className="text-xl font-black text-white uppercase">{photo.title}</h3>
        <div className="mt-4 flex items-center justify-between">
          <span className="flex items-center gap-2 text-white/80 text-[10px] font-bold bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
            <Calendar size={12} /> 2026
          </span>
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black shadow-lg">
            <ArrowUpRight size={20} />
          </div>
        </div>
      </div>

      <motion.img
        src={photo.src}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
      />
    </motion.div>
  );
}

export default function GallerySection() {
  const [selected, setSelected] = useState<any>(null);

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


      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-auto md:h-[800px] perspective-[1000px]">
        {photos.map((photo) => (
          <PerspectiveCard key={photo.id} photo={photo} onClick={() => setSelected(photo)} />
        ))}
      </div>


      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6 backdrop-blur-xl">
            <button className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors"><X size={40} /></button>

            <div className="max-w-5xl w-full flex flex-col items-center">
              <motion.img initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} src={selected.src} className="w-full h-auto max-h-[70vh] object-contain rounded-3xl shadow-2xl border border-white/10" />
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="mt-12 text-center">
                <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-2">{selected.title}</h2>
                <div className="flex items-center justify-center gap-4">
                  <div className="h-[2px] w-12 bg-[#0f9d58]" />
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">AEC Chapter Event</p>
                  <div className="h-[2px] w-12 bg-[#0f9d58]" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}