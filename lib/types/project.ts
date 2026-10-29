export type ProjectCategory =
  | "All"
  | "Web Development"
  | "AI & Machine Learning"
  | "Mobile Apps"
  | "Cloud & DevOps"
  | "Open Source";

export interface ProjectContributor {
  name: string;
  role?: string;
  github?: string;
  avatar?: string;
}

export interface StudentProject {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: "Web Development" | "AI & Machine Learning" | "Mobile Apps" | "Cloud & DevOps" | "Open Source";
  techStack: string[];
  contributors: ProjectContributor[];
  githubUrl?: string;
  liveDemoUrl?: string;
  thumbnailUrl?: string;
  featured?: boolean;
  achievements?: string[];
  year: number;
  createdAt?: string;
}

export interface ProjectCreateInput {
  title: string;
  tagline: string;
  description: string;
  category: "Web Development" | "AI & Machine Learning" | "Mobile Apps" | "Cloud & DevOps" | "Open Source";
  techStack: string[];
  contributors: ProjectContributor[];
  githubUrl?: string;
  liveDemoUrl?: string;
  thumbnailUrl?: string;
  featured?: boolean;
  achievements?: string[];
  year: number;
}

export const SEED_PROJECTS: StudentProject[] = [
  {
    id: "campus-orbit",
    title: "Campus Orbit",
    tagline: "Centralized smart event & attendance tracking system for campus clubs",
    description: "An automated RFID & QR-based attendance management system built for campus technical clubs and annual symposiums with live analytics and automated certificate issuance.",
    category: "Web Development",
    techStack: ["Next.js", "TypeScript", "TailwindCSS", "Firebase", "Node.js"],
    contributors: [
      { name: "AEC Dev Team", role: "Fullstack", github: "https://github.com/GDGCampusAEC" },
    ],
    githubUrl: "https://github.com/GDGCampusAEC",
    liveDemoUrl: "https://gdg-aec.live",
    featured: true,
    achievements: ["Hack-A-League 2024 Winner", "Deployed campus-wide across 1,200+ students"],
    year: 2024,
    createdAt: "2024-10-15T00:00:00.000Z",
  },
  {
    id: "neuro-vision",
    title: "NeuroVision AI",
    tagline: "Edge-based real-time assistive vision for visually impaired students",
    description: "Computer vision pipeline running on edge hardware that detects obstacles, reads signboards, and delivers spatial audio feedback in real-time.",
    category: "AI & Machine Learning",
    techStack: ["Python", "PyTorch", "OpenCV", "TensorRT", "FastAPI"],
    contributors: [
      { name: "ML Research Group", role: "AI Engineers" },
    ],
    githubUrl: "https://github.com/GDGCampusAEC",
    featured: true,
    achievements: ["Smart India Hackathon Finalist", "Best AI Innovation Award"],
    year: 2024,
    createdAt: "2024-09-20T00:00:00.000Z",
  },
  {
    id: "aec-pulse-mobile",
    title: "AEC Pulse",
    tagline: "Cross-platform campus companion for schedules, bus tracking, and notices",
    description: "Mobile application providing offline-first schedule synchronization, campus bus GPS tracking, and instant alerts for exam notices.",
    category: "Mobile Apps",
    techStack: ["Flutter", "Dart", "Firebase Cloud Messaging", "Google Maps API"],
    contributors: [
      { name: "Mobile Guild", role: "Flutter Developers" },
    ],
    githubUrl: "https://github.com/GDGCampusAEC",
    featured: false,
    achievements: ["Over 2,500 active downloads on campus"],
    year: 2024,
    createdAt: "2024-08-11T00:00:00.000Z",
  },
  {
    id: "dev-relay-cli",
    title: "CloudFlow CLI",
    tagline: "Zero-config deployment and containerization toolkit for student developers",
    description: "A lightweight CLI tool that scaffolds Dockerfiles, pushes preview environments, and integrates GitHub Actions pipelines in one keystroke.",
    category: "Cloud & DevOps",
    techStack: ["Go", "Docker", "Kubernetes", "GitHub Actions"],
    contributors: [
      { name: "DevOps Circle", role: "Maintainers" },
    ],
    githubUrl: "https://github.com/GDGCampusAEC",
    featured: false,
    achievements: ["Featured in GitHub Student Developer Showcase"],
    year: 2023,
    createdAt: "2023-11-05T00:00:00.000Z",
  },
  {
    id: "eco-track-iot",
    title: "EcoTrack IoT",
    tagline: "Campus solar and energy monitoring grid with predictive load balancing",
    description: "LoRaWAN sensor network collecting telemetry from college solar inverters to predict peak energy demand and curtail power wastage.",
    category: "AI & Machine Learning",
    techStack: ["ESP32", "MQTT", "Python", "InfluxDB", "Grafana"],
    contributors: [
      { name: "Hardware & IoT SIG", role: "Embedded Developers" },
    ],
    githubUrl: "https://github.com/GDGCampusAEC",
    featured: false,
    achievements: ["Energy Conservation Grant Winner 2024"],
    year: 2024,
    createdAt: "2024-07-01T00:00:00.000Z",
  },
];

export function validateProjectCreate(
  body: Record<string, unknown>
): { valid: true; data: ProjectCreateInput } | { valid: false; error: string } {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const tagline = typeof body.tagline === "string" ? body.tagline.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";

  if (!title) return { valid: false, error: "Field 'title' is required" };
  if (!tagline) return { valid: false, error: "Field 'tagline' is required" };
  if (!description) return { valid: false, error: "Field 'description' is required" };

  const validCategories = [
    "Web Development",
    "AI & Machine Learning",
    "Mobile Apps",
    "Cloud & DevOps",
    "Open Source",
  ] as const;

  const category = body.category as (typeof validCategories)[number];
  if (!validCategories.includes(category)) {
    return {
      valid: false,
      error: `Invalid category. Must be one of: ${validCategories.join(", ")}`,
    };
  }

  const techStack = Array.isArray(body.techStack)
    ? body.techStack.filter((t): t is string => typeof t === "string" && t.trim().length > 0)
    : [];

  const rawContributors = Array.isArray(body.contributors) ? body.contributors : [];
  const contributors: ProjectContributor[] = rawContributors
    .filter((c) => c && typeof c === "object")
    .map((c: Record<string, unknown>) => ({
      name: typeof c.name === "string" ? c.name.trim() : "Contributor",
      role: typeof c.role === "string" ? c.role.trim() : undefined,
      github: typeof c.github === "string" ? c.github.trim() : undefined,
      avatar: typeof c.avatar === "string" ? c.avatar.trim() : undefined,
    }));

  if (contributors.length === 0) {
    contributors.push({ name: "Student Contributor" });
  }

  const rawYear = Number(body.year);
  const year = Number.isNaN(rawYear) || rawYear < 2000 ? new Date().getFullYear() : Math.floor(rawYear);

  const clean: ProjectCreateInput = {
    title,
    tagline,
    description,
    category,
    techStack,
    contributors,
    year,
    featured: body.featured === true,
  };

  if (typeof body.githubUrl === "string" && body.githubUrl.trim()) {
    clean.githubUrl = body.githubUrl.trim();
  }
  if (typeof body.liveDemoUrl === "string" && body.liveDemoUrl.trim()) {
    clean.liveDemoUrl = body.liveDemoUrl.trim();
  }
  if (typeof body.thumbnailUrl === "string" && body.thumbnailUrl.trim()) {
    clean.thumbnailUrl = body.thumbnailUrl.trim();
  }
  if (Array.isArray(body.achievements)) {
    clean.achievements = body.achievements.filter((a): a is string => typeof a === "string" && a.trim().length > 0);
  }

  return { valid: true, data: clean };
}
