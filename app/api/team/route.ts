import { db } from "@/lib/firebaseAdmin";
import {
  jsonError,
  jsonSuccess,
  parseJsonBody,
  validateTeamMemberCreate,
  verifyAdminSecret,
} from "@/lib/types/api";

export const dynamic = "force-dynamic";

// Get all members
export async function GET() {
  if (!db) {
    return jsonError("Firebase is not configured", 503);
  }
  try {
    const snapshot = await db.collection("members").get();

    const members = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return jsonSuccess(members, 200);
  } catch (error) {
    console.error("Firebase Team GET Error:", error);
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return jsonError(msg, 500);
  }
}

// Creating a new member
export async function POST(req: Request) {
  if (!db) {
    return jsonError("Firebase is not configured", 503);
  }

  if (!verifyAdminSecret(req)) {
    return jsonError("Unauthorized", 401);
  }

  const parsed = await parseJsonBody(req);
  if (!parsed.ok) {
    return jsonError(parsed.error, 400);
  }

  const validation = validateTeamMemberCreate(parsed.data);
  if (!validation.valid) {
    return jsonError(validation.error, 400);
  }

  try {
    const memberData = {
      ...validation.data,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("members").add(memberData);

    if (memberData.showOnTrain) {
      const year = memberData.year;
      const snapshot = await db.collection("members").where("year", "==", year).get();
      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        if (doc.id !== docRef.id) {
          batch.update(doc.ref, { showOnTrain: false });
        }
      });
      await batch.commit();
    }

    return jsonSuccess({ id: docRef.id, ...memberData }, 201);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to create team member";
    return jsonError(msg, 500);
  }
}
