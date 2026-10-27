import { NextResponse } from "next/server";

/**
 * Standard API error structure.
 */
export interface ApiErrorResponse {
  error: string;
  details?: unknown;
}

/**
 * Shared helper to return standardized JSON errors.
 */
export function jsonError(message: string, status: number = 400, details?: unknown) {
  return NextResponse.json(
    {
      error: message,
      ...(details !== undefined ? { details } : {}),
    },
    { status }
  );
}

/**
 * Shared helper to return standardized JSON success responses.
 */
export function jsonSuccess<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status });
}

/**
 * Verify admin authorization header against process.env.ADMIN_SECRET.
 */
export function verifyAdminSecret(req: Request): boolean {
  const adminSecret = req.headers.get("x-admin-secret");
  const expectedSecret = process.env.ADMIN_SECRET;
  if (!expectedSecret) {
    // If not configured in environment, fail securely
    return false;
  }
  return adminSecret === expectedSecret;
}

/**
 * Safe JSON body parser with typed return.
 */
export async function parseJsonBody<T = Record<string, unknown>>(
  req: Request
): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  try {
    const raw = await req.json();
    if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
      return { ok: false, error: "Invalid JSON payload: expected a JSON object" };
    }
    return { ok: true, data: raw as T };
  } catch {
    return { ok: false, error: "Malformed JSON in request body" };
  }
}

// ──────────────────────────────────────────────────────────
// Course types and validation
// ──────────────────────────────────────────────────────────

export interface Course {
  id?: string;
  title: string;
  description: string;
  instructor?: string;
  category?: string;
  playlistId?: string;
  firstVideoId?: string;
  image?: string;
  link?: string;
  createdAt?: string;
}

export interface CourseCreateInput {
  title: string;
  description: string;
  instructor?: string;
  category?: string;
  playlistId?: string;
  firstVideoId?: string;
  image?: string;
  link?: string;
}

export function validateCourseCreate(
  body: Record<string, unknown>
): { valid: true; data: CourseCreateInput } | { valid: false; error: string } {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";

  if (!title) {
    return { valid: false, error: "Field 'title' is required and must be a non-empty string" };
  }
  if (!description) {
    return { valid: false, error: "Field 'description' is required and must be a non-empty string" };
  }

  const clean: CourseCreateInput = {
    title,
    description,
    image: typeof body.image === "string" ? body.image.trim() : "",
    link: typeof body.link === "string" ? body.link.trim() : "",
  };

  if (typeof body.instructor === "string" && body.instructor.trim()) {
    clean.instructor = body.instructor.trim();
  }
  if (typeof body.category === "string" && body.category.trim()) {
    clean.category = body.category.trim();
  }
  if (typeof body.playlistId === "string" && body.playlistId.trim()) {
    clean.playlistId = body.playlistId.trim();
  }
  if (typeof body.firstVideoId === "string" && body.firstVideoId.trim()) {
    clean.firstVideoId = body.firstVideoId.trim();
  }

  return { valid: true, data: clean };
}

// ──────────────────────────────────────────────────────────
// Event types and validation
// ──────────────────────────────────────────────────────────

export interface EventCreateInput {
  slug: string;
  title: string;
  date?: string;
  time?: string;
  location?: string;
  tag?: string;
  tags?: string[];
  tagColor?: string;
  image?: string;
  description?: string;
  desc?: string;
  longDescription?: string;
  gallery?: string[];
}

export function validateEventCreate(
  body: Record<string, unknown>
): { valid: true; data: EventCreateInput } | { valid: false; error: string } {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";

  if (!title) {
    return { valid: false, error: "Field 'title' is required and must be a non-empty string" };
  }
  if (!slug) {
    return { valid: false, error: "Field 'slug' is required and must be a non-empty string" };
  }

  const clean: EventCreateInput = {
    slug,
    title,
  };

  if (typeof body.date === "string" && body.date.trim()) clean.date = body.date.trim();
  if (typeof body.time === "string" && body.time.trim()) clean.time = body.time.trim();
  if (typeof body.location === "string" && body.location.trim()) clean.location = body.location.trim();
  if (typeof body.tag === "string" && body.tag.trim()) clean.tag = body.tag.trim();
  if (typeof body.tagColor === "string" && body.tagColor.trim()) clean.tagColor = body.tagColor.trim();
  if (typeof body.image === "string" && body.image.trim()) clean.image = body.image.trim();
  if (typeof body.description === "string" && body.description.trim()) clean.description = body.description.trim();
  if (typeof body.desc === "string" && body.desc.trim()) clean.desc = body.desc.trim();
  if (typeof body.longDescription === "string" && body.longDescription.trim()) clean.longDescription = body.longDescription.trim();

  if (Array.isArray(body.tags)) {
    clean.tags = body.tags.filter((item): item is string => typeof item === "string");
  }
  if (Array.isArray(body.gallery)) {
    clean.gallery = body.gallery.filter((item): item is string => typeof item === "string");
  }

  return { valid: true, data: clean };
}

// ──────────────────────────────────────────────────────────
// Team member types and validation
// ──────────────────────────────────────────────────────────

export interface TeamMemberInput {
  name: string;
  role: string;
  year: number;
  showOnTrain?: boolean;
  img?: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  globe?: string;
}

export function validateTeamMemberCreate(
  body: Record<string, unknown>
): { valid: true; data: TeamMemberInput } | { valid: false; error: string } {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const role = typeof body.role === "string" ? body.role.trim() : "";
  const rawYear = body.year;

  if (!name) return { valid: false, error: "Field 'name' is required" };
  if (!role) return { valid: false, error: "Field 'role' is required" };

  const parsedYear = Number(rawYear);
  if (Number.isNaN(parsedYear) || parsedYear <= 0) {
    return { valid: false, error: "Field 'year' must be a valid numeric year" };
  }

  const clean: TeamMemberInput = {
    name,
    role,
    year: Math.floor(parsedYear),
    showOnTrain: body.showOnTrain === true,
  };

  if (typeof body.img === "string") clean.img = body.img.trim();
  if (typeof body.github === "string") clean.github = body.github.trim();
  if (typeof body.linkedin === "string") clean.linkedin = body.linkedin.trim();
  if (typeof body.instagram === "string") clean.instagram = body.instagram.trim();
  if (typeof body.twitter === "string") clean.twitter = body.twitter.trim();
  if (typeof body.globe === "string") clean.globe = body.globe.trim();

  return { valid: true, data: clean };
}

export function validateTeamMemberUpdate(
  body: Record<string, unknown>
): { valid: true; data: Partial<TeamMemberInput> } | { valid: false; error: string } {
  const clean: Partial<TeamMemberInput> = {};

  if (body.name !== undefined) {
    if (typeof body.name !== "string" || !body.name.trim()) {
      return { valid: false, error: "Field 'name' must be a non-empty string" };
    }
    clean.name = body.name.trim();
  }

  if (body.role !== undefined) {
    if (typeof body.role !== "string" || !body.role.trim()) {
      return { valid: false, error: "Field 'role' must be a non-empty string" };
    }
    clean.role = body.role.trim();
  }

  if (body.year !== undefined && body.year !== null) {
    const parsedYear = Number(body.year);
    if (Number.isNaN(parsedYear) || parsedYear <= 0) {
      return { valid: false, error: "Field 'year' must be a valid numeric year" };
    }
    clean.year = Math.floor(parsedYear);
  }

  if (body.showOnTrain !== undefined) {
    clean.showOnTrain = body.showOnTrain === true;
  }

  if (body.img !== undefined) clean.img = typeof body.img === "string" ? body.img.trim() : "";
  if (body.github !== undefined) clean.github = typeof body.github === "string" ? body.github.trim() : "";
  if (body.linkedin !== undefined) clean.linkedin = typeof body.linkedin === "string" ? body.linkedin.trim() : "";
  if (body.instagram !== undefined) clean.instagram = typeof body.instagram === "string" ? body.instagram.trim() : "";
  if (body.twitter !== undefined) clean.twitter = typeof body.twitter === "string" ? body.twitter.trim() : "";
  if (body.globe !== undefined) clean.globe = typeof body.globe === "string" ? body.globe.trim() : "";

  return { valid: true, data: clean };
}
