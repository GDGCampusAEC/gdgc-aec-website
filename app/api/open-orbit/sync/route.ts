import { NextResponse } from "next/server";
import { syncEverything, syncLatest } from "@/lib/openOrbit/sync";

export const dynamic = "force-dynamic";

function isAdmin(req: Request): boolean {
  const secret = req.headers.get("x-admin-secret");
  const actualSecret = process.env.ADMIN_SECRET;
  return Boolean(secret && actualSecret && secret === actualSecret);
}

export async function POST(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized: Invalid Admin Secret" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const mode = body.mode === "everything" ? "everything" : "latest";

    if (mode === "everything") {
      const result = await syncEverything();
      return NextResponse.json(result);
    } else {
      const result = await syncLatest();
      return NextResponse.json(result);
    }
  } catch (err: unknown) {
    console.error("[OpenOrbit Sync Error]:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Synchronization failed" },
      { status: 500 }
    );
  }
}
