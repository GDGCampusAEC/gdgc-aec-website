import { db } from "@/lib/firebaseAdmin";
import {
  jsonError,
  jsonSuccess,
  parseJsonBody,
  validateEventCreate,
  verifyAdminSecret,
} from "@/lib/types/api";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!db) {
    return jsonError("Firebase not configured", 503);
  }

  try {
    const snapshot = await db.collection("events").get();

    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return jsonSuccess(events, 200);
  } catch (error) {
    console.error("Firebase GET Error:", error);
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return jsonError(msg, 500);
  }
}

// Creating new event
export async function POST(req: Request) {
  if (!db) {
    return jsonError("Firebase not configured", 503);
  }

  if (!verifyAdminSecret(req)) {
    return jsonError("Unauthorized: Invalid Admin Secret", 401);
  }

  const parsed = await parseJsonBody(req);
  if (!parsed.ok) {
    return jsonError(parsed.error, 400);
  }

  const validation = validateEventCreate(parsed.data);
  if (!validation.valid) {
    return jsonError(validation.error, 400);
  }

  const { slug, ...eventData } = validation.data;

  try {
    const docRef = db.collection("events").doc(slug);

    const docSnap = await docRef.get();
    if (docSnap.exists) {
      return jsonError("An event with this slug already exists", 409);
    }

    const payload = {
      slug,
      ...eventData,
      createdAt: new Date().toISOString(),
    };

    await docRef.set(payload);

    return jsonSuccess({ id: docRef.id, ...payload }, 201);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to create event";
    return jsonError(msg, 500);
  }
}
