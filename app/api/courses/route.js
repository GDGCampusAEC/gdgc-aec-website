import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!db) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 503 });
  }

  try {
    const snapshot = await db.collection("courses").orderBy("createdAt", "desc").get();
    const courses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error("Firebase Courses GET Error:", error);
    try {
      const snapshot = await db.collection("courses").get();
      const courses = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return NextResponse.json(courses, { status: 200 });
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

    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: "Title and description are required fields" },
        { status: 400 }
      );
    }

    const newCourse = {
      title: body.title,
      description: body.description,
      image: body.image || "",
      link: body.link || "",
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("courses").add(newCourse);

    return NextResponse.json({ id: docRef.id, ...newCourse }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
