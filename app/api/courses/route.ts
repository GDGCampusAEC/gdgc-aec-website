import { db } from "@/lib/firebaseAdmin";
import {
  jsonError,
  jsonSuccess,
  parseJsonBody,
  validateCourseCreate,
  verifyAdminSecret,
} from "@/lib/types/api";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!db) {
    return jsonError("Firebase not configured", 503);
  }

  try {
    const snapshot = await db.collection("courses").orderBy("createdAt", "desc").get();
    const courses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return jsonSuccess(courses, 200);
  } catch (error) {
    console.error("Firebase Courses GET Error:", error);
    try {
      const snapshot = await db.collection("courses").get();
      const courses = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return jsonSuccess(courses, 200);
    } catch (fallbackError) {
      const msg = fallbackError instanceof Error ? fallbackError.message : "Internal Server Error";
      return jsonError(msg, 500);
    }
  }
}

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

  const validation = validateCourseCreate(parsed.data);
  if (!validation.valid) {
    return jsonError(validation.error, 400);
  }

  try {
    const newCourse = {
      ...validation.data,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("courses").add(newCourse);

    return jsonSuccess({ id: docRef.id, ...newCourse }, 201);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to create course";
    return jsonError(msg, 500);
  }
}
