import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

export async function GET() {
  try {
    const snapshot = await db.collection("events").get();

    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Firebase GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

//Creating new event
export async function POST(req) {
  try {
    const adminSecret = req.headers.get("x-admin-secret");

    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid Admin Secret" },
        { status: 401 },
      );
    }
    
    const body = await req.json();

    if (!body.title || !body.slug) {
      return NextResponse.json(
        { error: "Title and slug are required fields" },
        { status: 400 },
      );
    }

    const docRef = db.collection('events').doc(body.slug);

    const docSnap = await docRef.get();
    if (docSnap.exists) {
      return NextResponse.json({ error: 'An event with this slug already exists' }, { status: 409 });
    }

    await docRef.set({
      ...body,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ id: docRef.id, ...body }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
