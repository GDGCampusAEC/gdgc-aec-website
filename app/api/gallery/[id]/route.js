import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function PATCH(req, { params }) {
  if (!db) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  }

  try {
    const adminSecret = req.headers.get("x-admin-secret");
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized: Invalid Admin Secret" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const docRef = db.collection("gallery").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Gallery photo not found" }, { status: 404 });
    }

    const updatedData = {
      ...body,
      updatedAt: new Date().toISOString(),
    };

    delete updatedData.id;
    delete updatedData.createdAt;

    await docRef.update(updatedData);

    const freshSnap = await docRef.get();
    return NextResponse.json({ id: freshSnap.id, ...freshSnap.data() }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  if (!db) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  }

  try {
    const adminSecret = req.headers.get("x-admin-secret");
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized: Invalid Admin Secret" }, { status: 401 });
    }

    const { id } = await params;
    const docRef = db.collection("gallery").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({ error: "Gallery photo not found" }, { status: 404 });
    }

    await docRef.delete();

    return NextResponse.json({ message: "Gallery photo deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
