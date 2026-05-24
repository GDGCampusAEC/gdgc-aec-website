import { NextResponse } from "next/server";
import coursesData from "@/courses.json";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(coursesData, { status: 200 });
}
