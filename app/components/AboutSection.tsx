"use client";

import { motion } from "framer-motion";
import { GraduationCap, Users, Code, Star } from "lucide-react";

export default function AboutSection() {

  const tags = [
    { text: "GDG AEC", color: "bg-[#0f9d58]", x: "-60%", y: "20%", rotate: -15, delay: 0 },
    { text: "GDG AEC", color: "bg-[#db4437]", x: "60%", y: "10%", rotate: 15, delay: 0.2 },
    { text: "GDG AEC", color: "bg-[#f4b400]", x: "-70%", y: "60%", rotate: -10, delay: 0.4 },
    { text: "GDG AEC", color: "bg-[#4285f4]", x: "50%", y: "70%", rotate: 10, delay: 0.6 },
  ];


  const features = [
    { icon: <GraduationCap className="w-6 h-6 text-[#0f9d58]" />, title: "Learn", desc: "New skills and grow together" },
    { icon: <Users className="w-6 h-6 text-[#f4b400]" />, title: "Connect", desc: "Build a strong Developer Community" },
    { icon: <Code className="w-6 h-6 text-[#4285f4]" />, title: "Build", desc: "Work on real projects and solve problems" },
    { icon: <Star className="w-6 h-6 text-[#db4437]" />, title: "Succeed", desc: "Achieve more with Google Technologies" },
  ];

  return (
    <section id="about" className="relative w-full max-w-7xl mx-auto px-4 py-24 z-30 bg-[#FDFBF7]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">


        <div className="relative flex flex-col items-center justify-center h-[500px]">


          <motion.div
            animate={{ y: [-15, 15, -15] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="relative w-64 md:w-80 z-20"
          >
            <img src="/assets/balloon.svg" alt="Hot Air Balloon" className="w-full h-auto drop-shadow-xl" />


            {tags.map((tag, idx) => (
              <motion.div
                key={idx}
                className={`absolute top-1/2 left-1/2 text-white font-bold text-xs md:text-sm px-3 py-1 rounded shadow-md border border-white/20 ${tag.color}`}
                style={{ x: tag.x, y: tag.y }}
                animate={{ rotate: [tag.rotate - 5, tag.rotate + 5, tag.rotate - 5] }}
                transition={{ repeat: Infinity, duration: 3, delay: tag.delay, ease: "easeInOut" }}
              >
                {tag.text}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 w-56 md:w-64 bg-white p-3 pb-8 shadow-2xl rounded-sm border border-gray-100"
            animate={{ rotate: -8 }}
            initial={{ rotate: -8 }}
            whileHover={{ rotate: -2, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img src="/assets/group-photo.png" alt="GDGC AEC Team" className="w-full h-auto bg-gray-200 aspect-video object-cover" />
          </motion.div>


          <img src="/assets/clouds-white.svg" alt="clouds" className="absolute bottom-0 w-full opacity-60 z-0 drop-shadow-md scale-110" />
        </div>



        <div className="flex flex-col gap-8 bg-[#fcf9f2] p-8 md:p-12 rounded-3xl shadow-sm border border-orange-50/50">
          <h2 className="text-2xl md:text-3xl font-medium leading-relaxed text-gray-800">
            GDGC are campus-based groups specifically designed to support aspiring developers on university campuses to learn and build successfully with <span className="text-[#0f9d58] font-bold">Google technologies.</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-200">
            {features.map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center text-center gap-3 relative">
                {idx !== 0 && <div className="hidden md:block absolute -left-3 top-2 bottom-2 w-px bg-gray-200"></div>}

                <div className="p-3 bg-white rounded-full shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-sm">{feature.title}</h3>
                <p className="text-xs text-gray-500 leading-tight">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}