import { db } from "@/lib/firebaseAdmin";
import { jsonError, jsonSuccess } from "@/lib/types/api";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ year: string }> }
) {
  if (!db) {
    return jsonError("Firebase is not configured", 503);
  }
  try {
    const { year } = await params;
    const parsedYear = parseInt(year, 10);

    if (Number.isNaN(parsedYear)) {
      return jsonError("Invalid year parameter", 400);
    }

    const snapshot = await db
      .collection("members")
      .where("year", "==", parsedYear)
      .get();

    const members = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return jsonSuccess(members, 200);
  } catch (error) {
    console.error("Firebase Team by Year GET Error:", error);
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return jsonError(msg, 500);
  }
}
