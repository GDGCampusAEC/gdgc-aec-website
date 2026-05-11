"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";


const teamYears = [
  {
    yop: "Class of 2026",
    color: "from-[#0f9d58] to-[#0b703e]",
    members: [
      { name: "Souvik Majee", role: "Lead Web Dev", img: "/assets/team-1.jpg" },
      { name: "Member 2", role: "UI/UX", img: "/assets/team-2.jpg" },
      { name: "Member 3", role: "App Dev", img: "/assets/team-3.jpg" },
      { name: "Member 4", role: "Cloud", img: "/assets/team-4.jpg" },
      { name: "Member 5", role: "AI/ML", img: "/assets/team-5.jpg" },
    ],
  },
  {
    yop: "Class of 2025",
    color: "from-[#4285f4] to-[#2c5ea8]",
    members: [
      { name: "Member 6", role: "Cloud Lead", img: "/assets/team-4.jpg" },
      { name: "Member 5", role: "AI/ML Lead", img: "/assets/team-5.jpg" },
    ],
  },
  {
    yop: "Class of 2024",
    color: "from-[#f4b400] to-[#b38500]",
    members: [
      { name: "Member 7", role: "Founder", img: "/assets/team-1.jpg" },
    ],
  },
];

export default function TeamTrainSection() {
  const targetRef = useRef<HTMLDivElement>(null);
  const [expandedYear, setExpandedYear] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({ target: targetRef });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 18,
    mass: 0.8,
    restDelta: 0.001
  });

  const dynamicTrainEnd = `-${teamYears.length * 60}vw`;
  const trainX = useTransform(smoothProgress, [0, 1], ["10vw", dynamicTrainEnd]);
  const wheelRotation = useTransform(smoothProgress, [0, 1], [0, -1800]);

  const dynamicGroundEnd = `${teamYears.length * 40}vw`;
  const groundX = useTransform(smoothProgress, [0, 1], ["0vw", dynamicGroundEnd]);

  const skyX = useTransform(smoothProgress, [0, 1], ["0%", "-10%"]);
  const mountainsX = useTransform(smoothProgress, [0, 1], ["0%", "-30%"]);

  return (
    <section ref={targetRef} className="relative bg-[#FDFBF7]" style={{ height: `${teamYears.length * 100}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-end pb-10 md:pb-24">

        <div className="absolute top-32 left-1/2 -translate-x-1/2 flex flex-col items-center text-gray-400 animate-bounce z-50">
          <span className="text-sm font-bold uppercase tracking-widest mb-2 text-gray-500">Scroll to ride</span>
          <ChevronDown className="w-6 h-6" />
        </div>


        <motion.div style={{ x: skyX }} className="absolute top-20 w-[300%] flex opacity-40 z-0 pointer-events-none">
          <img src="/assets/clouds-blue.svg" alt="clouds" className="w-1/3 object-contain" />
          <img src="/assets/clouds-blue.svg" alt="clouds" className="w-1/3 object-contain" />
          <img src="/assets/clouds-blue.svg" alt="clouds" className="w-1/3 object-contain" />
        </motion.div>

        <motion.div style={{ x: mountainsX }} className="absolute bottom-16 md:bottom-32 w-[300%] flex items-end opacity-20 z-0 pointer-events-none">
          <div className="w-[800px] h-64 bg-gray-400 rounded-t-full -ml-40" />
          <div className="w-[1200px] h-96 bg-gray-500 rounded-t-[100%] -ml-64" />
          <div className="w-[900px] h-72 bg-gray-400 rounded-t-full -ml-40" />
          <div className="w-[1000px] h-80 bg-gray-500 rounded-t-[100%] -ml-20" />
        </motion.div>


        <div className="absolute bottom-0 w-full h-16 md:h-24 bg-gray-800 z-10 border-t-[12px] border-[#db4437]">
          <motion.div style={{ x: groundX }} className="absolute top-0 -left-[300vw] w-[600vw] h-full flex justify-around pt-2">
            {[...Array(75)].map((_, i) => (
              <div key={i} className="w-8 md:w-10 h-3 md:h-4 bg-gray-600 rounded-full shadow-inner shrink-0" />
            ))}
          </motion.div>
        </div>

        <motion.div
          style={{ x: trainX }}
          className="relative z-20 flex items-end gap-2 md:gap-8 px-4 w-max"
        >


          <div className="flex items-end shrink-0 drop-shadow-2xl relative z-20">
            <div className="w-16 h-20 bg-gray-800 rounded-tl-full border-l-4 border-gray-500 z-10 skew-x-[15deg] -mr-8" />

            <div className="w-[280px] md:w-[450px] h-40 bg-gradient-to-b from-gray-700 via-gray-600 to-gray-900 rounded-l-[3rem] border-l-8 border-gray-500 shadow-inner z-20 flex items-center pl-6 md:pl-10 relative">
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-12 rounded-full bg-yellow-400 border-4 border-yellow-600 shadow-[0_0_30px_rgba(250,204,21,0.8)] z-30" />

              <div className="absolute top-[-80px] left-12 w-12 h-20 bg-gradient-to-r from-gray-700 to-gray-900 rounded-t-xl border-t-8 border-gray-950 z-10">
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  {[1, 2, 3].map((puff) => (
                    <motion.div key={puff} initial={{ opacity: 0, scale: 0.5, y: 10, x: 0 }} animate={{ opacity: [0, 0.8, 0], scale: [0.5, 2, 3], y: [-10, -80, -120], x: [0, -30, -60] }} transition={{ repeat: Infinity, duration: 2.5, delay: puff * 0.8, ease: "easeOut" }} className="absolute w-12 h-12 bg-gray-300 rounded-full blur-md" />
                  ))}
                </div>
              </div>

              <div className="ml-4 md:ml-10 flex flex-col items-start z-10">
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-wider drop-shadow-lg flex items-center gap-1">
                  <span className="text-[#4285f4]">G</span><span className="text-[#db4437]">D</span><span className="text-[#f4b400]">G</span><span className="text-[#0f9d58]">C</span>
                  <span className="ml-2">AEC</span>
                </h2>
                <p className="text-gray-300 text-[10px] md:text-sm font-bold tracking-widest uppercase mt-1">Developer Student Clubs</p>
              </div>
            </div>

            <div className="w-40 md:w-48 h-64 bg-gradient-to-tr from-gray-900 to-gray-800 rounded-t-[2.5rem] shadow-xl relative border-4 border-gray-950 flex flex-col items-center z-30 -ml-6">
              <div className="absolute -top-4 w-[110%] h-8 bg-gray-950 rounded-full shadow-lg" />
              <div className="mt-12 w-24 h-24 bg-blue-200/90 rounded-xl border-4 border-gray-700 overflow-hidden relative shadow-inner">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rotate-45 transform origin-top-right"></div>
              </div>
            </div>

            <div className="absolute -bottom-8 left-16 right-4 flex justify-between z-40">
              {[1, 2, 3].map((wheel) => (
                <motion.div key={`engine-wheel-${wheel}`} style={{ rotate: wheelRotation }} className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border-4 border-gray-400 flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.5)] relative shrink-0">
                  <div className="w-full h-2 bg-gray-400 absolute"></div><div className="w-2 h-full bg-gray-400 absolute"></div>
                  <div className="w-6 h-6 rounded-full bg-[#f4b400] z-10 border-2 border-yellow-600 shadow-md"></div>
                </motion.div>
              ))}
            </div>
          </div>



          {teamYears.map((yearGroup, idx) => {
            const isExpanded = expandedYear === yearGroup.yop;

            const collapsedWidth = 360;

            const expandedWidth = Math.max(
              collapsedWidth,
              (yearGroup.members.length * 180) + ((yearGroup.members.length - 1) * 32) + 200
            );

            const leadMember = yearGroup.members[0];

            return (
              <div key={idx} className="flex items-end shrink-0 z-10 drop-shadow-xl relative">


                <div className="w-12 h-4 bg-gray-800 mb-8 shrink-0 shadow-inner flex justify-center items-center">
                  <div className="w-6 h-2 bg-gray-600 rounded-full" />
                </div>

                <div
                  onClick={() => setExpandedYear(isExpanded ? null : yearGroup.yop)}
                  className={`relative px-4 py-6 bg-gradient-to-br ${yearGroup.color} rounded-[2rem] border border-white/30 flex flex-col items-center justify-center shadow-2xl cursor-pointer shrink-0 transition-[width] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] transform-gpu will-change-[width] hover:brightness-105`}
                  style={{ width: isExpanded ? `${expandedWidth}px` : `${collapsedWidth}px`, height: '420px' }}
                >


                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-gray-900 px-6 py-2 rounded-xl font-black text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] border-2 border-gray-900 whitespace-nowrap z-30">
                    {yearGroup.yop}
                  </div>


                  <div className="relative w-full h-full flex items-center justify-center">


                    <div className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center transition-all duration-300 ${isExpanded ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100 delay-200'}`}>

                      <div className="w-44 aspect-[3/4] bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.25)] relative overflow-hidden mb-3">
                        <img src={leadMember.img} alt={leadMember.name} className="w-full h-full object-cover rounded-xl" />
                      </div>

                      <h3 className="font-bold text-white text-base text-center drop-shadow-md">{leadMember.name}</h3>
                      <p className="text-white/90 text-[10px] text-center font-bold tracking-widest uppercase bg-black/20 backdrop-blur-sm border border-white/10 px-3 py-1 rounded-full mt-1">
                        {leadMember.role}
                      </p>

                      <p className="text-white/80 text-[9px] font-bold uppercase tracking-widest mt-4 bg-white/10 border border-white/10 px-4 py-1.5 rounded-full animate-pulse">
                        Tap to view team
                      </p>
                    </div>


                    <div className={`absolute inset-0 w-full h-full flex gap-8 items-center justify-center transition-opacity duration-300 ${isExpanded ? 'opacity-100 delay-200' : 'opacity-0 pointer-events-none'}`}>
                      {yearGroup.members.map((member, mIdx) => (
                        <div key={mIdx} className="flex flex-col items-center w-[160px] md:w-[180px] shrink-0 group">

                          <div className="w-full aspect-[3/4] bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.15)] relative overflow-hidden mb-4 transition-all duration-500 group-hover:-translate-y-2 group-hover:bg-white/20 group-hover:shadow-[0_16px_48px_rgba(0,0,0,0.3)] group-hover:border-white/40 z-10">
                            <img src={member.img} alt={member.name} className="w-full h-full object-cover rounded-xl" />
                            <div className="absolute top-0 left-[-150%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[30deg] transition-all duration-700 group-hover:left-[150%] pointer-events-none" />
                          </div>

                          <h3 className="font-bold text-white text-sm md:text-base text-center tracking-wide drop-shadow-md">{member.name}</h3>
                          <p className="text-white/90 text-[10px] md:text-xs text-center font-bold tracking-widest uppercase bg-black/20 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-full mt-2 shadow-inner">
                            {member.role}
                          </p>
                        </div>
                      ))}
                    </div>

                  </div>


                  <div className="absolute -bottom-10 left-0 w-full flex justify-around px-8 z-20">
                    {[1, 2].map((wheel) => (
                      <motion.div key={`car-wheel-${idx}-${wheel}`} style={{ rotate: wheelRotation }} className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border-4 border-gray-400 flex items-center justify-center shadow-lg shrink-0">
                        <div className="w-full h-1.5 bg-gray-400 absolute"></div><div className="w-1.5 h-full bg-gray-400 absolute"></div>
                        <div className="w-5 h-5 rounded-full bg-white z-10 shadow-sm"></div>
                      </motion.div>
                    ))}
                  </div>

                </div>
              </div>
            );
          })}

        </motion.div>
      </div>
    </section>
  );
}