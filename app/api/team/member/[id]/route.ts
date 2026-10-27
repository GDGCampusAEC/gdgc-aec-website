import { db } from "@/lib/firebaseAdmin";
import {
  jsonError,
  jsonSuccess,
  parseJsonBody,
  validateTeamMemberUpdate,
  verifyAdminSecret,
} from "@/lib/types/api";

export const dynamic = "force-dynamic";

// Updating a member
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!db) {
    return jsonError("Firebase is not configured", 503);
  }

  if (!verifyAdminSecret(req)) {
    return jsonError("Unauthorized", 401);
  }

  const { id } = await params;
  if (!id) {
    return jsonError("Missing member ID", 400);
  }

  const parsed = await parseJsonBody(req);
  if (!parsed.ok) {
    return jsonError(parsed.error, 400);
  }

  const validation = validateTeamMemberUpdate(parsed.data);
  if (!validation.valid) {
    return jsonError(validation.error, 400);
  }

  try {
    const docRef = db.collection("members").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return jsonError("Member not found", 404);
    }

    const updateData = {
      ...validation.data,
      updatedAt: new Date().toISOString(),
    };

    await docRef.update(updateData);

    if (updateData.showOnTrain === true) {
      const year =
        updateData.year !== undefined ? updateData.year : docSnap.data()?.year;
      if (year !== undefined) {
        const snapshot = await db
          .collection("members")
          .where("year", "==", year)
          .get();
        const batch = db.batch();
        snapshot.docs.forEach((doc) => {
          if (doc.id !== id) {
            batch.update(doc.ref, { showOnTrain: false });
          }
        });
        await batch.commit();
      }
    }

    const updatedDoc = await docRef.get();
    return jsonSuccess({ id: updatedDoc.id, ...updatedDoc.data() }, 200);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to update member";
    return jsonError(msg, 500);
  }
}

// Deleting a member
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!db) {
    return jsonError("Firebase is not configured", 503);
  }

  if (!verifyAdminSecret(req)) {
    return jsonError("Unauthorized", 401);
  }

  const { id } = await params;
  if (!id) {
    return jsonError("Missing member ID", 400);
  }

  try {
    const docRef = db.collection("members").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return jsonError("Member not found", 404);
    }

    await docRef.delete();

    return jsonSuccess({ message: "Member deleted successfully" }, 200);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to delete member";
    return jsonError(msg, 500);
  }
}
