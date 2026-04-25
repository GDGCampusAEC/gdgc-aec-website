import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { year } = await params;

    const snapshot = await db
      .collection("members")
      .where("year", "==", parseInt(year))
      .get();

    const members = snapshot.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(members, { status: 200 });
  } catch (error) {
    NextResponse.json({ error: error.message }, { status: 500 });
  }
}
