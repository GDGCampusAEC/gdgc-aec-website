import type { Metadata } from "next";
import ProjectsShowcaseSection from "@/app/components/ProjectsShowcaseSection";

export const metadata: Metadata = {
  title: "Student Projects & Achievements",
  description:
    "Explore innovative applications, hackathon-winning solutions, and open-source contributions built by student members at GDG On Campus AEC.",
  openGraph: {
    title: "Student Projects & Achievements | GDG On Campus AEC",
    description:
      "Explore innovative applications, hackathon-winning solutions, and open-source contributions built by student members at GDG On Campus AEC.",
  },
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen pt-24 pb-12 bg-[#FFFDF5] dark:bg-[#0b0f19] transition-colors duration-300">
      <ProjectsShowcaseSection />
    </main>
  );
}
