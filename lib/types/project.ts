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
  updatedAt?: string;
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

export const VALID_PROJECT_CATEGORIES = [
  "Web Development",
  "AI & Machine Learning",
  "Mobile Apps",
  "Cloud & DevOps",
  "Open Source",
] as const;

export function validateProjectCreate(
  body: Record<string, unknown>
): { valid: true; data: ProjectCreateInput } | { valid: false; error: string } {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const tagline = typeof body.tagline === "string" ? body.tagline.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";

  if (!title) return { valid: false, error: "Field 'title' is required" };
  if (!tagline) return { valid: false, error: "Field 'tagline' is required" };
  if (!description) return { valid: false, error: "Field 'description' is required" };

  const category = (body.category as string) || "Web Development";
  if (!VALID_PROJECT_CATEGORIES.includes(category as (typeof VALID_PROJECT_CATEGORIES)[number])) {
    return {
      valid: false,
      error: `Invalid category. Must be one of: ${VALID_PROJECT_CATEGORIES.join(", ")}`,
    };
  }

  // Parse tech stack: support array or comma-separated string
  let techStack: string[] = [];
  if (Array.isArray(body.techStack)) {
    techStack = body.techStack
      .filter((t): t is string => typeof t === "string" && t.trim().length > 0)
      .map((t) => t.trim());
  } else if (typeof body.techStack === "string" && body.techStack.trim().length > 0) {
    techStack = body.techStack
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  // Parse contributors: support array of objects or comma-separated string
  const contributors: ProjectContributor[] = [];
  if (Array.isArray(body.contributors)) {
    for (const c of body.contributors) {
      if (typeof c === "string" && c.trim()) {
        contributors.push({ name: c.trim() });
      } else if (c && typeof c === "object") {
        const cObj = c as Record<string, unknown>;
        const name = typeof cObj.name === "string" ? cObj.name.trim() : "";
        if (name) {
          contributors.push({
            name,
            role: typeof cObj.role === "string" ? cObj.role.trim() : undefined,
            github: typeof cObj.github === "string" ? cObj.github.trim() : undefined,
            avatar: typeof cObj.avatar === "string" ? cObj.avatar.trim() : undefined,
          });
        }
      }
    }
  } else if (typeof body.contributors === "string" && body.contributors.trim().length > 0) {
    body.contributors
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean)
      .forEach((name) => contributors.push({ name }));
  }

  // Parse achievements: support array or comma-separated string
  let achievements: string[] = [];
  if (Array.isArray(body.achievements)) {
    achievements = body.achievements
      .filter((a): a is string => typeof a === "string" && a.trim().length > 0)
      .map((a) => a.trim());
  } else if (typeof body.achievements === "string" && body.achievements.trim().length > 0) {
    achievements = body.achievements
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);
  }

  const rawYear = Number(body.year);
  const currentYear = new Date().getFullYear();
  const year = Number.isNaN(rawYear) || rawYear < 2000 || rawYear > currentYear + 2 ? currentYear : Math.floor(rawYear);

  const clean: ProjectCreateInput = {
    title,
    tagline,
    description,
    category: category as (typeof VALID_PROJECT_CATEGORIES)[number],
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
  if (achievements.length > 0) {
    clean.achievements = achievements;
  }

  return { valid: true, data: clean };
}
