import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { validateProjectCreate } from "@/lib/types/project";
import { verifyAdminSecret, parseJsonBody, jsonError } from "@/lib/types/api";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!db) {
    // Return empty list if Firebase is not configured in build/preview
    return NextResponse.json([], { status: 200 });
  }

  try {
    let snapshot;
    try {
      snapshot = await db.collection("projects").orderBy("createdAt", "desc").get();
    } catch {
      // Fallback if orderBy index is missing
      snapshot = await db.collection("projects").get();
    }

    if (snapshot.empty) {
      return NextResponse.json([], { status: 200 });
    }

    const projects = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("Firebase Projects GET Error:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  if (!db) {
    return jsonError("Firebase database not configured", 503);
  }

  if (!verifyAdminSecret(req)) {
    return jsonError("Unauthorized: Missing or invalid admin secret", 401);
  }

  const parseResult = await parseJsonBody(req);
  if (!parseResult.ok) {
    return jsonError(parseResult.error, 400);
  }

  const validation = validateProjectCreate(parseResult.data);
  if (!validation.valid) {
    return jsonError(validation.error, 400);
  }

  try {
    const timestamp = new Date().toISOString();
    const projectData = {
      ...validation.data,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const docRef = await db.collection("projects").add(projectData);

    return NextResponse.json({ id: docRef.id, ...projectData }, { status: 201 });
  } catch (error) {
    console.error("Firebase Projects POST Error:", error);
    const msg = error instanceof Error ? error.message : "Failed to create project";
    return jsonError(msg, 500);
  }
}
