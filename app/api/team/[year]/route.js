import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Member from "@/models/Member";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { year } = await params;

    const members = await Member.find({ year: Number(year) })
      .sort({ createdAt: 1 })
      .lean();
    return NextResponse.json(members);
  } catch (error) {
    NextResponse.json({ error: error.message }, { status: 500 });
  }
}

