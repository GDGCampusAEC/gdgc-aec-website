import { NextResponse } from "next/server";
import { getContributions } from "@/lib/openOrbit/db";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;
    const numericId = parseInt(userId, 10);

    if (isNaN(numericId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const contributions = await getContributions(numericId);
    return NextResponse.json(contributions);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load contributor contributions" },
      { status: 500 }
    );
  }
}
