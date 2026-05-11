
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-gray-900 text-white pt-24 pb-8 overflow-hidden">


      <div className="absolute top-0 left-0 w-full overflow-hidden rotate-180 -translate-y-[1px]">
        <img src="/assets/clouds-white.svg" alt="Border" className="w-[120%] min-w-[1000px] opacity-20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">


        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-2xl font-bold mb-2">
            <span className="text-[#4285f4]">G</span>
            <span className="text-[#db4437]">D</span>
            <span className="text-[#f4b400]">G</span>
            <span className="text-[#0f9d58]">C</span> AEC
          </h2>
          <p className="text-sm text-gray-400 max-w-xs">
            Empowering students at Asansol Engineering College to build real-world solutions using Google technologies.
          </p>
        </div>


        <div className="flex flex-col items-center md:items-start gap-2">
          <h3 className="font-bold text-lg mb-2">Quick Links</h3>
          {["Home", "About", "Events", "Teams", "Contact"].map((link) => (
            <Link key={link} href={`#${link.toLowerCase()}`} className="text-sm text-gray-400 hover:text-white transition-colors">
              {link}
            </Link>
          ))}
        </div>


        <div className="flex flex-col items-center md:items-start">
          <h3 className="font-bold text-lg mb-2">Join the Community</h3>
          <p className="text-sm text-gray-400 mb-4">
            Don't miss out on upcoming hackathons, workshops, and study jams.
          </p>
          <a href="#join" className="bg-white text-gray-900 px-6 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">
            Become a Member
          </a>
        </div>
      </div>


      <div className="relative z-10 border-t border-gray-800 mt-16 pt-8 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Google Developer Groups OnCampus AEC. All rights reserved.</p>
        <p className="mt-1">Designed & Built with ❤️ by the GDGC AEC Core Team.</p>
      </div>

export default function Footer() {
  return (
    <footer className="p-6 text-center text-gray-400 border-t">
      © GDGC PRC
    </footer>
  );
}