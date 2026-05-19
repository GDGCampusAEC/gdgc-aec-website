"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface CinematicLightboxProps {
  isOpen: boolean;
  images: string[];
  currentIndex: number | null;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function CinematicLightbox({
  isOpen,
  images,
  currentIndex,
  onClose,
  onSelectIndex,
  onPrev,
  onNext
}: CinematicLightboxProps) {
  if (!isOpen || currentIndex === null) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-8"
        onClick={onClose}
      >
        <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-[110]">
          <div className="px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-white font-semibold text-sm tracking-widest">
            {String(currentIndex + 1).padStart(2, '0')}{" "}
            <span className="text-white/40">/</span>{" "}
            {String(images.length).padStart(2, '0')}
          </div>
          <button
            className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-white transition-all hover:scale-105"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="relative w-full max-w-6xl flex-grow flex items-center justify-between group h-[60vh]">
          <button
            className="absolute left-2 md:left-8 p-4 text-white/40 hover:text-white hover:scale-110 transition-all z-[115]"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
          >
            <ChevronLeft size={40} strokeWidth={2} />
          </button>

          <div className="flex-grow flex justify-center items-center h-full relative z-[105]">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={images[currentIndex]}
                initial={{ opacity: 0, scale: 0.98, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.02, filter: "blur(8px)" }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] as any }}
                className="max-w-full max-h-[60vh] object-contain rounded-2xl shadow-2xl absolute"
                onClick={(e) => e.stopPropagation()}
              />
            </AnimatePresence>
          </div>

          <button
            className="absolute right-2 md:right-8 p-4 text-white/40 hover:text-white hover:scale-110 transition-all z-[115]"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
          >
            <ChevronRight size={40} strokeWidth={2} />
          </button>
        </div>

        <div
          className="absolute bottom-8 md:bottom-10 max-w-[95vw] md:max-w-3xl overflow-x-auto rounded-[2rem] bg-black/40 border border-white/10 backdrop-blur-xl p-3 flex gap-3 z-[110] hide-scrollbar shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img: string, idx: number) => (
            <button
              key={idx}
              onClick={() => onSelectIndex(idx)}
              className={`relative shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-[1.25rem] overflow-hidden transition-all duration-500 ease-out ${
                currentIndex === idx
                  ? "ring-2 ring-white scale-100 opacity-100 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                  : "ring-1 ring-white/10 scale-90 opacity-40 hover:opacity-80 hover:scale-95"
              }`}
            >
              <img
                src={img}
                className="w-full h-full object-cover"
                alt={`Thumbnail ${idx}`}
              />
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
