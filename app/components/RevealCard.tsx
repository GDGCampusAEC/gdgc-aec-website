"use client";

import React, { useState, useEffect, useRef } from "react";
import { toPng } from "html-to-image";

export default function RevealCard() {
  const [isOpen, setIsOpen] = useState(false);

  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  // Random Pokemon states
  const [pokemonId, setPokemonId] = useState<number>(25);
  const [pokemonName, setPokemonName] = useState("pikachu");

  const ticketRef = useRef<HTMLDivElement>(null);

  // Open modal + lock scroll
  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 1000);

    // Save current scroll position
    const scrollY = window.scrollY;

    // Lock background scroll completely
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    return () => {
      clearTimeout(timer);

      // Restore scroll
      const top = document.body.style.top;

      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";

      // Restore previous scroll position
      window.scrollTo(0, parseInt(top || "0") * -1);
    };
  }, []);

  // Generate Random Pokemon Ticket
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    setStep(2);

    try {
      // Random Pokemon from Gen 1
      const randomId = Math.floor(Math.random() * 1000) + 1;

      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${randomId}`
      );

      const data = await response.json();

      setPokemonId(data.id);
      setPokemonName(data.name);
    } catch (error) {
      console.error("Failed to fetch Pokemon:", error);

      // fallback
      setPokemonId(25);
      setPokemonName("pikachu");
    }

    setTimeout(() => {
      setStep(3);
    }, 2500);
  };

  // Download Ticket
  const handleDownload = async () => {
    if (!ticketRef.current) return;

    setIsDownloading(true);

    try {
      const dataUrl = await toPng(ticketRef.current, {
        quality: 1.0,
        pixelRatio: 6,
        cacheBust: true,
      });

      const link = document.createElement("a");

      link.download = `GDGC-AEC-Pass-${name
        .replace(/\s+/g, "-")
        .toLowerCase()}.png`;

      link.href = dataUrl;

      link.click();
    } catch (error) {
      console.error("Failed to generate ticket image:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).toUpperCase();

  const pokemonUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#FFFDF5]/85 backdrop-blur-xl px-3 py-6 sm:p-6 select-none font-sans overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Close Button */}
      <button
        onClick={() => {
          const top = document.body.style.top;

          document.body.style.position = "";
          document.body.style.top = "";
          document.body.style.left = "";
          document.body.style.right = "";
          document.body.style.width = "";
          document.body.style.overflow = "";

          window.scrollTo(0, parseInt(top || "0") * -1);

          setIsOpen(false);
        }}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors z-50 text-2xl font-medium"
      >
        &times;
      </button>

      {/* Ticket Wrapper */}
      <div className="w-full max-w-4xl flex flex-col items-center gap-6 animate-fade-in">

        {/* Ticket */}
        <div
          ref={ticketRef}
          className="
            relative
            w-full
            max-w-4xl
            bg-white
            border
            border-slate-200/60
            rounded-3xl
            overflow-hidden
            shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05),0_0_40px_rgba(66,133,244,0.08)]

            md:aspect-[16/9]

            flex
            flex-col
            md:block
          "
        >

          {/* Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />

          {/* Google Color Strip */}
          <div className="absolute top-0 left-0 right-0 h-1.5 flex z-20">
            <div className="w-1/4 bg-[#4285F4]" />
            <div className="w-1/4 bg-[#EA4335]" />
            <div className="w-1/4 bg-[#FBBC05]" />
            <div className="w-1/4 bg-[#34A853]" />
          </div>

          <div className="w-full h-full grid grid-cols-1 md:grid-cols-5 relative z-10">

            {/* LEFT SECTION (Wild Pokemon Display) */}
            <div className="col-span-1 md:col-span-2 relative min-h-[220px] md:h-full bg-gradient-to-b from-slate-50/50 to-[#34A853]/10 md:border-r border-b md:border-b-0 border-slate-100 flex flex-col items-center justify-center p-4 overflow-hidden">

              {/* Background ambient color */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#34A853]/20 via-transparent to-transparent pointer-events-none" />

              <div className="relative w-32 h-32 sm:w-48 sm:h-48 flex items-center justify-center group z-10">
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#4285F4]/30 to-[#34A853]/40 blur-2xl rounded-full group-hover:scale-110 transition-transform duration-700" />

                {/* Pokemon */}
                <img
                  src={pokemonUrl}
                  alt="Pokemon"
                  crossOrigin="anonymous"
                  className="w-full h-full object-contain relative z-20 drop-shadow-xl animate-float scale-125"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>

              {/* Wild Grass Decor */}
              {/* Background Tall Grass */}
              <svg viewBox="0 0 100 20" className="absolute bottom-[-1px] left-0 w-full h-16 sm:h-24 fill-[#34A853]/20 z-10 pointer-events-none" preserveAspectRatio="none">
                <path d="M0 20 L5 8 L10 20 L15 12 L20 20 L27 4 L33 20 L38 10 L44 20 L50 6 L56 20 L62 14 L68 20 L75 5 L82 20 L88 12 L94 20 L100 8 V20 H0 Z" />
              </svg>
              {/* Foreground Short Grass */}
              <svg viewBox="0 0 100 20" className="absolute bottom-[-1px] left-0 w-full h-8 sm:h-12 fill-[#34A853]/40 z-30 pointer-events-none" preserveAspectRatio="none">
                <path d="M0 20 L4 10 L8 20 L13 6 L18 20 L24 14 L30 20 L35 8 L40 20 L47 4 L53 20 L59 12 L65 20 L72 8 L78 20 L84 14 L90 20 L95 10 L100 20 V20 H0 Z" />
              </svg>
            </div>

            {/* RIGHT SECTION */}
            <div className="col-span-1 md:col-span-3 flex flex-col justify-between p-5 sm:p-8 relative bg-white min-h-[340px]">

              {/* STEP 1 */}
              {step === 1 && (
                <form
                  onSubmit={handleGenerate}
                  className="h-full flex flex-col justify-between animate-fade-in"
                >
                  {/* Header */}
                  <div className="flex items-center gap-3 sm:gap-4 group cursor-default">
                    <img
                      src="/gdsc-logo.png"
                      alt="GDGC Logo"
                      className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                    />

                    <div className="flex flex-col text-left">
                      <span className="font-bold text-sm sm:text-lg leading-none tracking-tight text-slate-900">
                        Google Developer Groups
                      </span>
                      <span className="text-[9px] sm:text-xs font-semibold text-[#4285F4] leading-none mt-1.5">
                        On Campus Asansol Engineering College
                      </span>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="my-auto py-4">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                      Claim Your Pass
                    </h2>
                    <p className="text-sm text-slate-500 mb-5 leading-relaxed">
                      Imprint your name below to reveal your unique launch
                      companion and high-fidelity entry ticket.
                    </p>

                    <div className="relative group w-full">
                      <input
                        type="text"
                        maxLength={22}
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Souvik Majee"
                        className="w-full bg-slate-50 border-2 border-slate-200 focus:bg-white focus:border-[#4285F4] px-4 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-bold text-slate-800 outline-none transition-all duration-300 shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Generate Button */}
                  <button
                    type="submit"
                    disabled={!name.trim()}
                    className={`w-full py-3.5 sm:py-4 rounded-xl text-sm font-bold tracking-wide text-white transition-all duration-300 ${name.trim()
                      ? "bg-slate-900 hover:bg-[#4285F4] shadow-lg shadow-slate-200 active:scale-[0.98]"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                  >
                    Generate Ticket
                  </button>
                </form>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in">
                  <div className="relative z-10 flex flex-col items-center space-y-6">
                    {/* Loader */}
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
                      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#4285F4] border-r-[#EA4335] border-b-[#FBBC05] border-l-[#34A853] animate-spin" />
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-bold text-slate-800 tracking-wide uppercase">
                        A Wild Pokemon Appeared!
                      </p>
                      <p className="text-xs text-slate-400 font-mono">
                        Catching companion...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="h-full flex flex-col justify-between animate-scale-up">
                  {/* Header */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src="/gdsc-logo.png"
                        alt="GDGC Logo"
                        className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                      />

                      <div className="flex flex-col text-left">
                        <span className="font-bold text-sm sm:text-lg leading-none tracking-tight text-slate-900">
                          Google Developer Groups
                        </span>
                        <span className="text-[9px] sm:text-xs font-semibold text-[#4285F4] leading-none mt-1.5">
                          On Campus Asansol Engineering College
                        </span>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="text-right shrink-0">
                      <p className="text-[8px] sm:text-[9px] text-slate-400 uppercase tracking-widest font-bold">
                        Date
                      </p>
                      <p className="text-[10px] sm:text-[11px] text-slate-800 font-extrabold uppercase font-mono">
                        {currentDate}
                      </p>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="my-auto py-4">
                    <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">
                      Pass Holder
                    </p>
                    <h1 className="text-2xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 tracking-tight capitalize break-words leading-tight pb-1">
                      {name}
                    </h1>

                    {/* WEBSITE LAUNCH TEXT & PROUD MEMBER BADGE */}
                    <div className="mt-5 space-y-3">
                      <p className="text-[10px] sm:text-sm font-black uppercase tracking-[0.18em] sm:tracking-[0.35em] text-transparent bg-clip-text bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#34A853] leading-relaxed">
                        GDGC-AEC WEBSITE LAUNCH
                      </p>

                      {/* Proud Member Badge */}
                      <div className="inline-block bg-slate-50 border border-slate-200/60 rounded-lg px-2.5 py-1.5 shadow-sm">
                        <p className="text-[9px] sm:text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">
                          ⚡ I am a proud member of GDGC-AEC
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-end border-t border-slate-100 pt-4 gap-4">
                    <div className="flex items-center gap-4">
                      {/* Pokeball Icon */}
                      <div className="hidden sm:flex items-center justify-center opacity-90">
                        <svg
                          viewBox="0 0 100 100"
                          className="w-9 h-9 drop-shadow-sm hover:rotate-180 transition-transform duration-700 ease-in-out"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {/* Top Half (Red) */}
                          <path d="M 50 5 A 45 45 0 0 1 95 50 L 5 50 A 45 45 0 0 1 50 5 Z" fill="#EA4335" />

                          {/* Bottom Half (White) */}
                          <path d="M 5 50 A 45 45 0 0 0 95 50 L 5 50 Z" fill="#F8FAFC" />

                          {/* Outer Stroke */}
                          <circle cx="50" cy="50" r="45" fill="none" stroke="#0F172A" strokeWidth="6" />

                          {/* Center Divider */}
                          <line x1="5" y1="50" x2="95" y2="50" stroke="#0F172A" strokeWidth="6" />

                          {/* Inner Circles */}
                          <circle cx="50" cy="50" r="14" fill="#F8FAFC" stroke="#0F172A" strokeWidth="6" />
                          <circle cx="50" cy="50" r="5" fill="#0F172A" />
                        </svg>
                      </div>

                      {/* Pokemon Info */}
                      <div className="text-[10px] sm:text-[11px] text-slate-500 leading-tight">
                        <p className="uppercase font-bold tracking-wider text-[8px] sm:text-[9px] mb-0.5 text-slate-400">
                          Pokemon
                        </p>
                        <p className="font-extrabold text-[#4285F4] uppercase font-mono tracking-widest">
                          #{pokemonId.toString().padStart(3, "0")}
                        </p>
                        <p className="font-black text-slate-700 capitalize text-xs tracking-wide mt-1">
                          {pokemonName}
                        </p>
                      </div>
                    </div>

                    {/* Website */}
                    <div className="flex flex-col items-end">
                      <p className="text-[12px] sm:text-[15px] font-black text-slate-800 tracking-wide">
                        gdgcaec.com
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Download Button */}
        {step === 3 && (
          <div className="animate-slide-up w-full flex justify-center">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className={`w-full max-w-sm py-4 rounded-2xl text-sm font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-3 ${isDownloading
                ? "bg-slate-200 text-slate-500 cursor-wait"
                : "bg-slate-900 hover:bg-[#4285F4] text-white shadow-xl hover:shadow-[#4285F4]/30 hover:-translate-y-1 active:translate-y-0"
                }`}
            >
              {isDownloading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-slate-500"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Encoding Image...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download High-Res Ticket
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}