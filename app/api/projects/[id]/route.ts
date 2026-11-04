import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { verifyAdminSecret, parseJsonBody, jsonError } from "@/lib/types/api";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!db) {
    return jsonError("Firebase database not configured", 503);
  }

  const { id } = await params;
  if (!id) {
    return jsonError("Missing project ID", 400);
  }

  try {
    const doc = await db.collection("projects").doc(id).get();
    if (!doc.exists) {
      return jsonError("Project not found", 404);
    }

    return NextResponse.json({ id: doc.id, ...doc.data() }, { status: 200 });
  } catch (error) {
    console.error("Firebase Projects GET [id] Error:", error);
    const msg = error instanceof Error ? error.message : "Failed to fetch project";
    return jsonError(msg, 500);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!db) {
    return jsonError("Firebase database not configured", 503);
  }

  if (!verifyAdminSecret(req)) {
    return jsonError("Unauthorized: Missing or invalid admin secret", 401);
  }

  const { id } = await params;
  if (!id) {
    return jsonError("Missing project ID", 400);
  }

  const parseResult = await parseJsonBody(req);
  if (!parseResult.ok) {
    return jsonError(parseResult.error, 400);
  }

  try {
    const docRef = db.collection("projects").doc(id);
    const existing = await docRef.get();

    if (!existing.exists) {
      return jsonError("Project not found", 404);
    }

    const updates: Record<string, unknown> = {
      ...parseResult.data,
      updatedAt: new Date().toISOString(),
    };
    delete updates.id;
    delete updates._id;

    await docRef.update(updates);
    const updated = await docRef.get();

    return NextResponse.json({ id: updated.id, ...updated.data() }, { status: 200 });
  } catch (error) {
    console.error("Firebase Projects PATCH [id] Error:", error);
    const msg = error instanceof Error ? error.message : "Failed to update project";
    return jsonError(msg, 500);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!db) {
    return jsonError("Firebase database not configured", 503);
  }

  if (!verifyAdminSecret(req)) {
    return jsonError("Unauthorized: Missing or invalid admin secret", 401);
  }

  const { id } = await params;
  if (!id) {
    return jsonError("Missing project ID", 400);
  }

  try {
    const docRef = db.collection("projects").doc(id);
    const existing = await docRef.get();

    if (!existing.exists) {
      return jsonError("Project not found", 404);
    }

    await docRef.delete();
    return NextResponse.json({ success: true, message: "Project deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Firebase Projects DELETE [id] Error:", error);
    const msg = error instanceof Error ? error.message : "Failed to delete project";
    return jsonError(msg, 500);
  }
}
