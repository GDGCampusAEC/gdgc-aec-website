import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { SEED_PROJECTS, validateProjectCreate } from "@/lib/types/project";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!db) {
    // Return static seed projects if Firebase is unconfigured
    return NextResponse.json(SEED_PROJECTS, { status: 200 });
  }

  try {
    const snapshot = await db.collection("projects").orderBy("createdAt", "desc").get();
    if (snapshot.empty) {
      return NextResponse.json(SEED_PROJECTS, { status: 200 });
    }

    const projects = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("Firebase Projects GET Error:", error);
    // Graceful fallback to seed entries
    return NextResponse.json(SEED_PROJECTS, { status: 200 });
  }
}

export async function POST(req: Request) {
  if (!db) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  }

  const adminSecret = req.headers.get("x-admin-secret");
  if (!process.env.ADMIN_SECRET || adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    const raw = await req.json();
    if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
      return NextResponse.json({ error: "Expected JSON object payload" }, { status: 400 });
    }
    body = raw as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Malformed JSON payload" }, { status: 400 });
  }

  const validation = validateProjectCreate(body);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  try {
    const projectData = {
      ...validation.data,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("projects").add(projectData);

    return NextResponse.json({ id: docRef.id, ...projectData }, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to create project";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
