"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, BookOpen, Briefcase, Check, Code2, Lightbulb, PlusIcon, Rocket, Users, Zap } from "lucide-react";
import { RECRUITMENT_ROLES } from "@/lib/recruitment";
import Image from "next/image";
import { notFound } from "next/navigation";
import { RECRUITMENT_OPEN } from "@/lib/recruitment";

const whyJoin = [
  {
    icon: Rocket,
    title: "Lead",
    text: "Take ownership of a team, initiative, or technical domain.",
    color: "blue",
  },
  {
    icon: BookOpen,
    title: "Build",
    text: "Create projects, sessions, resources, and experiences for the community.",
    color: "green",
  },
  {
    icon: Briefcase,
    title: "Organize",
    text: "Plan and execute workshops, hackathons, study jams, meetups, and other initiatives.",
    color: "red",
  },
  {
    icon: Users,
    title: "Grow",
    text: "Help students discover technologies, develop skills, and find people to build with.",
    color: "yellow",
  },
  {
    icon: Lightbulb,
    title: "Collaborate",
    text: "Work across technical, creative, outreach, and operations teams to make things happen.",
    color: "blue",
  },
];

const whatYouCanDo = [
  {
    title: "Lead",
    text: "Take ownership of an initiative or team.",
  },
  {
    title: "Build",
    text: "Turn ideas into useful projects and experiences.",
  },
  {
    title: "Organize",
    text: "Make events and initiatives actually happen.",
  },
  {
    title: "Communicate",
    text: "Bring people in and keep the community connected.",
  },
  {
    title: "Collaborate",
    text: "Work across teams and make others better.",
  },
];

const googleColors = {
  blue: {
    text: "text-[#1a73e8]",
    bg: "bg-[#e8f0fe]",
    dot: "bg-[#4285f4]",
  },
  red: {
    text: "text-[#d93025]",
    bg: "bg-[#fce8e6]",
    dot: "bg-[#ea4335]",
  },
  yellow: {
    text: "text-[#b06000]",
    bg: "bg-[#fef7e0]",
    dot: "bg-[#fbbc04]",
  },
  green: {
    text: "text-[#188038]",
    bg: "bg-[#e6f4ea]",
    dot: "bg-[#34a853]",
  },
};

function SectionLabel({
  children,
  color = "blue",
}: {
  children: React.ReactNode;
  color?: keyof typeof googleColors;
}) {
  const styles = googleColors[color];

  return (
    <div className="mb-4 flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${styles.dot}`} />
      <span className={`text-xs font-bold uppercase tracking-[0.18em] ${styles.text}`}>
        {children}
      </span>
    </div>
  );
}

function ColorShape({
  className = "",
  color,
  shape = "circle",
}: {
  className?: string;
  color: "blue" | "red" | "yellow" | "green";
  shape?: "circle" | "pill" | "square";
}) {
  const colorMap = {
    blue: "bg-[#4285f4]",
    red: "bg-[#ea4335]",
    yellow: "bg-[#fbbc04]",
    green: "bg-[#34a853]",
  };

  const shapeMap = {
    circle: "rounded-full",
    pill: "rounded-full",
    square: "rounded-[1.5rem]",
  };

  return (
    <div
      aria-hidden="true"
      className={`absolute ${colorMap[color]} ${shapeMap[shape]} ${className}`}
    />
  );
}

export default function RecruitmentPage() {

  if (!RECRUITMENT_OPEN) {
    notFound();
  }
  
  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfaff] text-[#202124]">
      <section className="relative isolate">
        {/* Decorative Google inspired shapes */}
        <ColorShape
          color="blue"
          shape="circle"
          className="right-[-90px] top-20 h-44 w-44 opacity-90 sm:right-[-70px] sm:h-60 sm:w-60"
        />

        <ColorShape
          color="yellow"
          shape="circle"
          className="left-[-70px] top-[42%] h-28 w-28 opacity-90 sm:left-[-50px] sm:h-36 sm:w-36"
        />

        <ColorShape
          color="red"
          shape="pill"
          className="right-[12%] top-[54%] hidden h-10 w-24 rotate-[-18deg] md:block"
        />

        <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-28 sm:px-8 sm:pb-20 sm:pt-36 lg:px-12 lg:pt-40">

          <div className="mb-8 flex items-center gap-3 sm:mb-10">
            <div className="flex -space-x-1.5">
              <span className="h-3.5 w-3.5 rounded-full bg-[#4285f4]" />
              <span className="h-3.5 w-3.5 rounded-full bg-[#ea4335]" />
              <span className="h-3.5 w-3.5 rounded-full bg-[#fbbc04]" />
              <span className="h-3.5 w-3.5 rounded-full bg-[#34a853]" />
            </div>

            <span className="text-sm font-medium text-[#5f6368]">
              GDGC AEC · Core Team 2026-27
            </span>
          </div>

          <div className="max-w-5xl">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="text-[3.35rem] font-semibold leading-[0.98] tracking-[-0.055em] text-[#202124] sm:text-6xl md:text-7xl lg:text-[6.6rem]"
            >
              Build what&apos;s
              <br />

              <span className="relative inline-block">next</span>
              <span className=" ml-2 size-3 leading-none rounded-full inline-block bg-[#34a853] sm:ml-3 sm:-right-7 sm:h-4 sm:w-4"></span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-7 max-w-2xl text-lg leading-7 text-[#5f6368] sm:mt-8 sm:text-xl sm:leading-8"
            >
              Step up. Take ownership. Build the next GDGC AEC.
              <br className="hidden sm:block" />
              We&apos;re looking for students who want to shape the community,
              run initiatives, lead teams, and create meaningful experiences
              for developers on campus.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.18,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/recruitment/apply"
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#1a73e8] px-7 text-base font-semibold text-white shadow-[0_8px_24px_rgba(26,115,232,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1769d3] hover:shadow-[0_12px_30px_rgba(26,115,232,0.28)] active:translate-y-0"
              >
                Apply for the Core Team
                <ArrowRight
                  size={19}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <a
                href="#what-youll-own"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-[#dadce0] bg-white/80 px-7 text-base font-semibold text-[#3c4043] backdrop-blur transition hover:bg-white"
              >
                What you&apos;ll own
                <ArrowDown size={17} />
              </a>
            </motion.div>
          </div>

          {/* Hero bottom visual */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative mt-16 sm:mt-20"
          >
            <div className="relative overflow-hidden rounded-[2rem] bg-[#202124] px-6 py-8 text-white sm:rounded-[2.5rem] sm:px-10 sm:py-10">
              {/* decorative shapes */}
              <ColorShape
                color="blue"
                className="right-[-30px] top-[-35px] h-32 w-32 opacity-80"
              />

              <ColorShape
                color="yellow"
                shape="pill"
                className="bottom-[-20px] left-[28%] h-10 w-24 rotate-12 opacity-90"
              />

              <ColorShape
                color="red"
                shape="circle"
                className="bottom-5 right-[18%] h-5 w-5"
              />

              <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                      The Next Team
                    </span>
                  </div>

                  <h2 className="max-w-xl text-2xl font-medium tracking-tight sm:text-3xl">
                    Build the community.
                    <br />
                    Run the initiatives.
                    <br />
                    Make the year count.
                  </h2>
                </div>

                <div className="flex items-center gap-3 text-sm text-white/70">
                  <div className="flex -space-x-3">
                    {[
                      "https://ik.imagekit.io/rlvi9ou8u/gdgc-aec/team/ADITYA_SHARMA_yLyV6gwTN.jpg",
                      "https://ik.imagekit.io/rlvi9ou8u/gdgc-aec/team/Soumik_Ghosh_YnHqgeb3t.jpg",
                      "https://ik.imagekit.io/rlvi9ou8u/gdgc-aec/team/niraj_modi_0FIBjTiJy.jpg"
                    ].map((src, index) => (
                      <div
                        key={src}
                        className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-[#202124] bg-[#f1f3f4] transition-transform duration-300 hover:z-10 hover:scale-110"
                      >
                        <Image
                          sizes="40px"
                          src={src}
                          alt={`GDGC AEC member ${index + 1}`}
                          className="h-full w-full object-cover"
                          fill
                        />
                      </div>
                    ))}

                    <div className="flex z-2 h-10 w-10 items-center justify-center rounded-full border-2 border-[#202124] bg-[#4285f4] text-xs font-bold text-white">
                      <PlusIcon size={22} />
                    </div>
                  </div>

                  <span className="whitespace-nowrap">
                    Build with your people.
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      <section
        id="what-youll-own"
        className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-12"
      >
        <div className="max-w-2xl">
          <SectionLabel>What you&apos;ll own</SectionLabel>

          <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#202124] sm:text-5xl">
            More than a title.
            <br />
            <span className="text-[#5f6368]">Help shape what GDGC AEC does.</span>
          </h2>

          <p className="mt-5 max-w-xl text-base leading-7 text-[#5f6368] sm:text-lg">
            Being part of the core team means more than adding a title to your
            resume. You&apos;ll help shape what GDGC AEC does, how it feels, and
            what students take away from it.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {whyJoin.map(({ icon: Icon, title, text, color }, index) => {
            const styles = googleColors[color as keyof typeof googleColors];

            const spans = [
              "lg:col-span-2",
              "lg:col-span-2",
              "lg:col-span-2",
              "lg:col-span-3",
              "lg:col-span-3",
            ];

            return (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.04,
                }}
                whileHover={{ y: -4 }}
                className={`${spans[index]} group relative overflow-hidden rounded-[2rem] border border-[#e8eaed] bg-white p-6 transition-shadow duration-300 hover:shadow-[0_16px_40px_rgba(60,64,67,0.08)] sm:p-7`}
              >
                <div
                  className={`mb-8 flex h-12 w-12 items-center justify-center rounded-[1.25rem] ${styles.bg} ${styles.text}`}
                >
                  <Icon size={23} strokeWidth={2} />
                </div>

                <h3 className="text-xl font-semibold tracking-tight text-[#202124]">
                  {title}
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-[#5f6368]">
                  {text}
                </p>

                <span
                  className={`absolute bottom-6 right-7 h-2.5 w-2.5 rounded-full ${styles.dot} opacity-0 transition-opacity group-hover:opacity-100`}
                />
              </motion.div>
            );
          })}
        </div>
      </section>


      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <SectionLabel color="green">What we&apos;re looking for</SectionLabel>

              <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#202124] sm:text-5xl">
                Bring your
                <br />
                <span className="text-[#34a853]">strengths.</span>
              </h2>

              <p className="mt-5 max-w-md text-base leading-7 text-[#5f6368]">
                You don&apos;t need to be great at everything. We&apos;re looking
                for people who are willing to take ownership, work with others,
                learn quickly, and follow through. Whether your strength is
                technology, design, communication, events, outreach, or
                execution — there&apos;s a place for you.
              </p>

              <div className="mt-8 hidden items-center gap-3 text-sm font-medium text-[#5f6368] lg:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e6f4ea] text-[#188038]">
                  <Zap size={17} />
                </div>
                Start small. Make it real.
              </div>
            </div>

            <div className="space-y-3">
              {whatYouCanDo.map(({ title, text }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: index * 0.04 }}
                  className="group flex gap-5 rounded-[1.75rem] border border-[#e8eaed] bg-[#fbfaff] p-5 transition-all duration-300 hover:-translate-x-1 hover:border-[#dadce0] hover:bg-white hover:shadow-[0_12px_30px_rgba(60,64,67,0.07)] sm:p-6"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-[#5f6368] shadow-sm ring-1 ring-[#e8eaed] transition-colors group-hover:bg-[#e8f0fe] group-hover:text-[#1a73e8]">
                    0{index + 1}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[#202124]">
                      {title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-[#5f6368]">
                      {text}
                    </p>
                  </div>

                  <ArrowRight
                    size={19}
                    className="ml-auto mt-2 hidden shrink-0 text-[#9aa0a6] transition-transform group-hover:translate-x-1 sm:block"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>


      <section className="relative overflow-hidden bg-[#f8fafd]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
          <div className="max-w-2xl">
            <SectionLabel color="red">Find where you can contribute</SectionLabel>

            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#202124] sm:text-5xl">
              There&apos;s a role
              <br />
              <span className="text-[#ea4335]">for you.</span>
            </h2>

            <p className="mt-5 text-base leading-7 text-[#5f6368] sm:text-lg">
              Choose the areas where you&apos;d like to take ownership. You can
              select up to three roles in the application.
            </p>
          </div>

          {/* Roles */}
          <div className="mt-10 flex flex-wrap gap-2.5">
            {RECRUITMENT_ROLES.map((role, index) => {
              const colors = [
                "hover:border-[#4285f4] hover:bg-[#e8f0fe]",
                "hover:border-[#ea4335] hover:bg-[#fce8e6]",
                "hover:border-[#fbbc04] hover:bg-[#fef7e0]",
                "hover:border-[#34a853] hover:bg-[#e6f4ea]",
              ];

              return (
                <motion.div
                  key={role}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.3,
                    delay: Math.min(index * 0.025, 0.35),
                  }}
                  className={`cursor-default rounded-full border border-[#dadce0] bg-white px-4 py-2.5 text-sm font-medium text-[#3c4043] transition-all duration-200 ${colors[index % colors.length]}`}
                >
                  {role}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>


      <section
        id="eligibility"
        className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-12"
      >
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
          <div>
            <SectionLabel color="yellow">Who are we looking for?</SectionLabel>

            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#202124] sm:text-5xl">
              Ready to take
              <br />
              <span className="text-[#b06000]">responsibility?</span>
            </h2>

            <p className="mt-5 max-w-md text-base leading-7 text-[#5f6368]">
              You don&apos;t need to be the most experienced person in the room.
              We care about how you think, how you work with people, and whether
              you&apos;re willing to take responsibility.
            </p>
          </div>

          <div className="grid gap-3">
            {[
              {
                title: "Ownership",
                text: "You follow through instead of waiting for someone else to do it.",
                color: "blue",
              },
              {
                title: "Teamwork",
                text: "You can collaborate, communicate, and support people around you.",
                color: "red",
              },
              {
                title: "Initiative",
                text: "You see something that can be better and are willing to act on it.",
                color: "green",
              },
              {
                title: "Consistency",
                text: "You can commit time and effort throughout the tenure.",
                color: "yellow",
              },
            ].map(({ title, text, color }) => {
              const styles =
                googleColors[color as keyof typeof googleColors];

              return (
                <div
                  key={title}
                  className="flex gap-4 rounded-[1.5rem] bg-[#f8fafd] p-5 sm:p-6"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${styles.bg} ${styles.text}`}
                  >
                    <Check size={18} strokeWidth={2.5} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-[#202124]">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-[#5f6368]">
                      {text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      <section className="px-5 pb-8 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#e8eaed] bg-white p-8 text-center sm:p-12">
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full bg-[#fef7e0] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#b06000]">
            This is a responsibility, not just a title
          </div>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#5f6368] sm:text-lg">
            Being on the GDGC AEC core team means showing up, working with
            others, and taking ownership of the things you say you&apos;ll do.
            You&apos;ll help decide what we build, what we teach, what we
            organize, and how the community grows.
          </p>
        </div>
      </section>


      <section className="px-5 pb-28 pt-4 sm:px-8 sm:pb-32 lg:px-12">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.25rem] bg-[#202124] px-6 py-14 text-center sm:rounded-[3rem] sm:px-12 sm:py-20">
          <ColorShape
            color="blue"
            className="left-[-45px] top-[-45px] h-36 w-36 opacity-90"
          />

          <ColorShape
            color="red"
            shape="pill"
            className="right-[-30px] top-12 h-10 w-28 rotate-[-20deg]"
          />

          <ColorShape
            color="yellow"
            className="bottom-[-30px] left-[20%] h-20 w-20"
          />

          <ColorShape
            color="green"
            shape="circle"
            className="bottom-8 right-[20%] h-6 w-6"
          />

          <div className="relative mx-auto max-w-2xl">
            <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
              <Code2 size={15} />
              Core Team Applications Open
            </div>

            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-6xl">
              Your turn
              <br />
              <span className="text-[#8ab4f8]">to build.</span>
            </h2>

            <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-white/65 sm:text-base">
              The next GDGC AEC chapter starts with the people who choose to
              take responsibility for it.
            </p>

            <Link
              href="/recruitment/apply"
              className="group mt-8 inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-white px-7 text-base font-semibold text-[#202124] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.2)]"
            >
              Apply for the Core Team
              <ArrowRight
                size={19}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}