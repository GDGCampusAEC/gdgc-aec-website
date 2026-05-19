import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { secret } = body;

    // Grab the real secret from your .env file
    const actualSecret = process.env.ADMIN_SECRET;

    if (!actualSecret) {
      console.error("ADMIN_SECRET is not set in .env file");
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    if (secret === actualSecret) {
      return NextResponse.json({ success: true, message: "Authorized" });
    } else {
      return NextResponse.json({ error: "Invalid Admin Secret" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
}