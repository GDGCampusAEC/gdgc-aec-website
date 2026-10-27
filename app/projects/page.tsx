import type { Metadata } from "next";
import ProjectsShowcaseSection from "@/app/components/ProjectsShowcaseSection";
import { SEED_PROJECTS } from "@/lib/types/project";

export const metadata: Metadata = {
  title: "Projects & Achievements | GDG On Campus AEC",
  description:
    "Explore innovative open-source projects, hackathon solutions, and software achievements built by students at Asansol Engineering College.",
  openGraph: {
    title: "Student Project Showcase | GDG AEC",
    description:
      "Spotlight on outstanding student projects, hackathon wins, and open-source contributions created by campus members.",
  },
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-[#FFFDF5] pt-24 pb-16">
      <ProjectsShowcaseSection initialProjects={SEED_PROJECTS} />
    </main>
  );
}
