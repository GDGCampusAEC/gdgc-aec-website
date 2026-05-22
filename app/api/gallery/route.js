import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!db) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  }

  try {
    const snapshot = await db.collection("gallery").orderBy("createdAt", "desc").get();
    const photos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(photos, { status: 200 });
  } catch (error) {
    console.error("Firebase Gallery GET Error:", error);
    try {
      const snapshot = await db.collection("gallery").get();
      const photos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return NextResponse.json(photos, { status: 200 });
    } catch (fallbackError) {
      return NextResponse.json({ error: fallbackError.message }, { status: 500 });
    }
  }
}

export async function POST(req) {
  if (!db) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  }

  try {
    const adminSecret = req.headers.get("x-admin-secret");

    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid Admin Secret" },
        { status: 401 }
      );
    }

    const body = await req.json();

    if (!body.src || !body.title) {
      return NextResponse.json(
        { error: "Source image URL and Title are required fields" },
        { status: 400 }
      );
    }

    const newPhoto = {
      src: body.src,
      title: body.title,
      eventSlug: body.eventSlug || "",
      size: body.size || "col-span-1",
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("gallery").add(newPhoto);

    return NextResponse.json({ id: docRef.id, ...newPhoto }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
